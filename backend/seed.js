import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Course } from "./models/course.model.js";
import { Admin } from "./models/admin.model.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const MONGO_URI = process.env.MONGO_URI || process.env.DB_URI || process.argv[2];

const sampleCourses = [
  {
    title: "Full-Stack Next.js 15 & React 19 Masterclass",
    description:
      "Master modern production-grade Full-Stack development with Next.js 15 App Router, Server Actions, React 19 Compiler, Tailwind CSS, PostgreSQL with Prisma ORM, Auth.js, and automated CI/CD deployments on Vercel.",
    price: 1499,
    image: {
      public_id: "courses/nextjs_masterclass",
      url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    },
  },
  {
    title: "Generative AI & Autonomous Agentic Systems with Python",
    description:
      "Build production-ready multi-agent AI systems, LLM orchestrations with LangChain, LlamaIndex, OpenAI, Anthropic Claude, vector databases (Pinecone, ChromaDB, Qdrant), RAG architectures, and real-time streaming interfaces.",
    price: 1999,
    image: {
      public_id: "courses/genai_agents",
      url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800",
    },
  },
  {
    title: "Mastering Backend Systems, Microservices & Docker",
    description:
      "Deep dive into high-throughput scalable Node.js & Express architectures, Redis distributed caching, RabbitMQ/Kafka message queues, gRPC microservices, Docker containerization, and Kubernetes cluster orchestration.",
    price: 1299,
    image: {
      public_id: "courses/backend_microservices",
      url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800",
    },
  },
  {
    title: "DevOps & Cloud Architecture on AWS",
    description:
      "End-to-end cloud engineering with Terraform Infrastructure as Code (IaC), AWS ECS & EKS, Lambda serverless microservices, CloudWatch monitoring, S3/CloudFront CDN, and production GitHub Actions CI/CD pipelines.",
    price: 1799,
    image: {
      public_id: "courses/devops_aws",
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    },
  },
  {
    title: "Web3, Solidity & Smart Contract Security",
    description:
      "Build secure decentralized applications (dApps) on Ethereum & Polygon using Solidity, Hardhat, Ethers.js, IPFS, OpenZeppelin standards, Defi protocols, and smart contract security auditing patterns.",
    price: 1599,
    image: {
      public_id: "courses/web3_solidity",
      url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    },
  },
  {
    title: "Data Structures, Algorithms & System Design Bootcamp",
    description:
      "Ace FAANG & tier-1 technical interviews with 150+ curated LeetCode algorithmic patterns, high-level distributed system design, low-level object-oriented design, concurrency, and real mock interview breakdowns.",
    price: 999,
    image: {
      public_id: "courses/dsa_system_design",
      url: "https://images.unsplash.com/photo-1516116211227-bbc00bcfa438?w=800",
    },
  },
  {
    title: "Cross-Platform Mobile App Mastery with Flutter & Dart",
    description:
      "Build beautiful, native 60fps iOS and Android applications with Flutter 3, Riverpod state management, Firebase backend integration, offline SQLite caching, custom animations, and App Store / Google Play publishing.",
    price: 1199,
    image: {
      public_id: "courses/flutter_mobile",
      url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    },
  },
  {
    title: "Cybersecurity & Hands-on Ethical Hacking",
    description:
      "Hands-on penetration testing, OWASP Top 10 web vulnerabilities, network packet analysis with Wireshark, Metasploit exploitation, reverse engineering, and defensive security posture hardening.",
    price: 1699,
    image: {
      public_id: "courses/cybersecurity_ethical_hacking",
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    },
  },
];

async function seedDatabase() {
  if (!MONGO_URI) {
    console.error("\n❌ Error: MONGO_URI is missing.");
    console.error("Please provide it in backend/.env as MONGO_URI=... or run:");
    console.error("  node seed.js \"mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname\"\n");
    process.exit(1);
  }

  try {
    console.log("\n⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Successfully connected to MongoDB Database!");

    // Check or create a default Admin user for course creator reference
    let admin = await Admin.findOne();
    if (!admin) {
      console.log("⚙️  No existing admin found. Creating default admin profile...");
      const hashedPassword = await bcrypt.hash("Admin@12345", 10);
      admin = await Admin.create({
        firstName: "CourseShip",
        lastName: "Admin",
        email: "admin@courseship.com",
        password: hashedPassword,
      });
      console.log(`✅ Default Admin created: ${admin.email} (Password: Admin@12345)`);
    } else {
      console.log(`👤 Using existing Admin: ${admin.email} (ID: ${admin._id})`);
    }

    console.log(`\n📚 Preparing to seed ${sampleCourses.length} masterclasses...`);

    let insertedCount = 0;
    let updatedCount = 0;

    for (const courseData of sampleCourses) {
      const existingCourse = await Course.findOne({ title: courseData.title });
      if (existingCourse) {
        await Course.findByIdAndUpdate(existingCourse._id, {
          ...courseData,
          creatorId: admin._id,
        });
        console.log(`  🔄 Updated: "${courseData.title}" (₹${courseData.price})`);
        updatedCount++;
      } else {
        await Course.create({
          ...courseData,
          creatorId: admin._id,
        });
        console.log(`  ✨ Inserted: "${courseData.title}" (₹${courseData.price})`);
        insertedCount++;
      }
    }

    const totalCourses = await Course.countDocuments();

    console.log("\n🎉 ============================================");
    console.log(`🎉 Seeding Completed Successfully!`);
    console.log(`   - Newly Inserted : ${insertedCount}`);
    console.log(`   - Updated/Synced : ${updatedCount}`);
    console.log(`   - Total Courses in DB: ${totalCourses}`);
    console.log("🎉 ============================================\n");

    await mongoose.disconnect();
    console.log("🔌 Disconnected cleanly from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed with error:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

seedDatabase();
