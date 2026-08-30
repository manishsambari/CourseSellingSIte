import dotenv from "dotenv";
import mongoose from "mongoose";
import { Course } from "./models/course.model.js";
import { Admin } from "./models/admin.model.js";

dotenv.config();

const coursesData = [
  {
    title: "Next.js 15, Turborepo & Distributed Full-Stack Architecture",
    description: "Master App Router, Server Actions, multi-tenant Postgres schemas, Redis caching layers, and high-performance React 19 patterns with production monorepos.",
    price: 1499,
    image: {
      public_id: "course_nextjs_15",
      url: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    title: "Autonomous Multi-Agent AI & LangGraph Production Systems",
    description: "Build self-orchestrating LLM agent workflows, RAG vector retrieval with pgvector, real-time streaming tools, memory state machines, and fine-tuned model evaluation.",
    price: 1999,
    image: {
      public_id: "course_ai_agents",
      url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    title: "High-Performance Rust, WebAssembly & Low-Latency Engines",
    description: "Deep dive into memory safety, async Tokio runtimes, high-throughput network protocols, zero-cost abstractions, and compiling blazing fast WASM modules.",
    price: 1799,
    image: {
      public_id: "course_rust_engine",
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    title: "Cloud Native Kubernetes, Docker & Edge DevOps CI/CD",
    description: "Deploy and orchestrate resilient multi-cluster microservices using Kubernetes, Helm charts, Terraform infrastructure-as-code, and automated GitHub Actions pipelines.",
    price: 1299,
    image: {
      public_id: "course_k8s_devops",
      url: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    title: "Golang Microservices, gRPC & Event-Driven Kafka Architecture",
    description: "Architect distributed backends in Go with gRPC, Protocol Buffers, Kafka event streaming, distributed tracing with OpenTelemetry, and resilient fault-tolerance.",
    price: 1599,
    image: {
      public_id: "course_golang_grpc",
      url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    title: "Web3, EVM Smart Contracts & Zero-Knowledge Proofs",
    description: "Write gas-optimized Solidity smart contracts, build decentralized frontends with viem & wagmi, audit security vulnerabilities, and implement ZK proof verifiers.",
    price: 1699,
    image: {
      public_id: "course_web3_zk",
      url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    title: "System Design at Scale: 10M+ Concurrent WebSockets & Redis",
    description: "Scale real-time chat, collaborative canvases, and live trading systems using distributed Redis pub/sub, sticky load balancing, and connection sharding techniques.",
    price: 1899,
    image: {
      public_id: "course_system_design",
      url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    title: "Full-Stack React Native & Mobile Systems Architecture",
    description: "Build offline-first cross-platform native iOS & Android applications with Expo SDK, SQLite local sync, push notification servers, and biometrics security.",
    price: 1399,
    image: {
      public_id: "course_react_native",
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    },
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Find an admin user or create a fallback admin
    let admin = await Admin.findOne();
    const adminId = admin ? admin._id : new mongoose.Types.ObjectId();

    console.log(`Current courses in database: ${await Course.countDocuments()}`);

    for (const c of coursesData) {
      const existing = await Course.findOne({ title: c.title });
      if (existing) {
        // Update photo and description to ensure high-tech quality
        existing.image = c.image;
        existing.description = c.description;
        existing.price = c.price;
        await existing.save();
        console.log(`Updated course: "${c.title}"`);
      } else {
        await Course.create({
          ...c,
          creatorId: adminId,
        });
        console.log(`Created course: "${c.title}"`);
      }
    }

    // Also update any other existing courses that have broken or low-res images
    const allCourses = await Course.find();
    for (let i = 0; i < allCourses.length; i++) {
      const course = allCourses[i];
      if (!course.image || !course.image.url || course.image.url.includes("placeholder") || course.image.url.includes("avatar")) {
        course.image = {
          public_id: `course_img_${i}`,
          url: coursesData[i % coursesData.length].image.url,
        };
        await course.save();
        console.log(`Fixed image for: "${course.title}"`);
      }
    }

    console.log(`Seeding complete! Total courses now: ${await Course.countDocuments()}`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
