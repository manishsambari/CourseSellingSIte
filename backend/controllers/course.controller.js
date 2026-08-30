import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.model.js";
import Stripe from "stripe";
import config from "../config.js";

export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
      return res.status(400).json({ errors: "Course image file is required" });
    }

    const { image } = req.files;
    const allowedFormat = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res
        .status(400)
        .json({ errors: "Invalid file format. PNG, JPG, JPEG, and WebP are allowed" });
    }

    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "courses",
    });

    if (!cloud_response || cloud_response.error) {
      return res
        .status(400)
        .json({ errors: "Error uploading file to cloudinary" });
    }

    const courseData = {
      title,
      description,
      price: Number(price),
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.secure_url || cloud_response.url,
      },
      creatorId: adminId,
    };

    const course = await Course.create(courseData);
    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ errors: "Error creating course" });
  }
};

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price } = req.body;

  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ errors: "Course not found" });
    }

    const updateFields = {
      ...(title && { title }),
      ...(description && { description }),
      ...(price && { price: Number(price) }),
    };

    // If new image file is uploaded
    if (req.files && req.files.image) {
      const { image } = req.files;
      const allowedFormat = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!allowedFormat.includes(image.mimetype)) {
        return res
          .status(400)
          .json({ errors: "Invalid file format. PNG, JPG, JPEG, and WebP are allowed" });
      }

      const cloud_response = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "courses",
      });

      if (cloud_response && !cloud_response.error) {
        // Optionally delete old image from Cloudinary
        if (courseSearch.image?.public_id && courseSearch.image.public_id !== cloud_response.public_id) {
          try {
            await cloudinary.uploader.destroy(courseSearch.image.public_id);
          } catch (delErr) {
            console.error("Old image cleanup error:", delErr);
          }
        }

        updateFields.image = {
          public_id: cloud_response.public_id,
          url: cloud_response.secure_url || cloud_response.url,
        };
      }
    }

    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        creatorId: adminId,
      },
      updateFields,
      { new: true }
    );

    if (!course) {
      return res
        .status(404)
        .json({ errors: "Cannot update course: Not authorized or course not found" });
    }

    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error("Error in course updating:", error);
    res.status(500).json({ errors: "Error in course updating" });
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;

  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ errors: "Cannot delete course: Not authorized or course not found" });
    }

    // Clean up Cloudinary asset
    if (course.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(course.image.public_id);
      } catch (cloudErr) {
        console.error("Error deleting image from Cloudinary:", cloudErr);
      }
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error in course deleting:", error);
    res.status(500).json({ errors: "Error in course deleting" });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error in getting courses:", error);
    res.status(500).json({ errors: "Error in getting courses" });
  }
};

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    console.error("Error in course details:", error);
    res.status(500).json({ errors: "Error in getting course details" });
  }
};

export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ errors: "User has already purchased this course" });
    }

    if (!config.STRIPE_SECRET_KEY) {
      return res.status(500).json({ errors: "Payment system not configured" });
    }

    const stripe = new Stripe(config.STRIPE_SECRET_KEY);
    // Stripe expects amounts in cents / paise (multiplied by 100)
    const rawPrice = Number(course.price) || 0;
    const amountInCents = Math.max(Math.round(rawPrice * 100), 50); // min charge requirement

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        userId: String(userId),
        courseId: String(courseId),
        courseTitle: course.title,
      },
    });

    res.status(200).json({
      message: "Checkout session created successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error in course buying:", error);
    res.status(500).json({ errors: "Error in course buying" });
  }
};
