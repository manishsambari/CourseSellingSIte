import dotenv from "dotenv";
import mongoose from "mongoose";

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
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
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
    title: "Web3, EVM Smart Contracts & Zero-Knowledge Cryptography",
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
    title: "Full-Stack React Native & Cross-Platform Mobile Systems",
    description: "Build offline-first cross-platform native iOS & Android applications with Expo SDK, SQLite local sync, push notification servers, and biometrics security.",
    price: 1399,
    image: {
      public_id: "course_react_native",
      url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    title: "Advanced TypeScript 5, Design Patterns & Monorepo Tooling",
    description: "Master advanced type-level gymnastics, AST transformation, custom compiler plugins, architectural boundaries, and high-performance frontend builds.",
    price: 1199,
    image: {
      public_id: "course_typescript",
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    title: "Cybersecurity, Hands-on Pentesting & Cryptographic Protocols",
    description: "Hands-on network vulnerability assessments, OWASP top 10 security exploitation, zero-trust perimeter design, and cryptographic hashing security.",
    price: 1699,
    image: {
      public_id: "course_cybersec",
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    title: "Python for Quantitative Finance & High-Frequency Algorithms",
    description: "Build algorithmic order-routing engines, statistical arbitrage bots, financial data scrapers, and backtest trading systems with NumPy and Pandas.",
    price: 1899,
    image: {
      public_id: "course_quant_python",
      url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    title: "Modern Linux Kernel Internals, eBPF & Systems Engineering",
    description: "Explore Linux virtual memory architecture, write custom eBPF observability probes, debug kernel crashes, and optimize low-level system call throughput.",
    price: 1799,
    image: {
      public_id: "course_linux_ebpf",
      url: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80",
    },
  },
];

async function seedDatabase(targetDbName) {
  const baseUri = process.env.MONGO_URI;
  console.log(`\nConnecting to database "${targetDbName}"...`);
  const conn = await mongoose.createConnection(baseUri, {
    dbName: targetDbName,
  }).asPromise();

  const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    creatorId: { type: mongoose.Types.ObjectId },
  });

  const CourseModel = conn.model("Course", courseSchema);

  // Clear or update old test placeholder courses ("Nodejs", "Java", "Python", "MERN")
  console.log(`Current courses in "${targetDbName}": ${await CourseModel.countDocuments()}`);

  // Upsert each curated course
  for (const c of coursesData) {
    const existing = await CourseModel.findOne({ title: c.title });
    if (existing) {
      existing.description = c.description;
      existing.price = c.price;
      existing.image = c.image;
      await existing.save();
      console.log(`Updated course in ${targetDbName}: "${c.title}"`);
    } else {
      await CourseModel.create(c);
      console.log(`Created course in ${targetDbName}: "${c.title}"`);
    }
  }

  // Also replace any old placeholder courses like "Nodejs" with valid details and photos
  const oldTestCourses = await CourseModel.find({
    title: { $in: ["Nodejs", "Java", "Python", "MERN"] }
  });

  for (const oldCourse of oldTestCourses) {
    if (oldCourse.title === "Nodejs") {
      oldCourse.title = "Node.js & Express Microservices Deep Dive";
      oldCourse.description = "Build high-throughput async microservices, stream pipelines, Redis caching, and clustered Node.js architectures.";
      oldCourse.price = 1499;
      oldCourse.image = {
        public_id: "course_nodejs_pro",
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
      };
      await oldCourse.save();
      console.log(`Replaced old test course "Nodejs" in ${targetDbName}`);
    } else if (oldCourse.title === "Java") {
      oldCourse.title = "Enterprise Java 21, Spring Boot 3 & Microservices";
      oldCourse.description = "Master Java 21 Virtual Threads, Spring Cloud, Kafka streaming, Hibernate ORM, and resilient enterprise architectures.";
      oldCourse.price = 1599;
      oldCourse.image = {
        public_id: "course_java_pro",
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
      };
      await oldCourse.save();
      console.log(`Replaced old test course "Java" in ${targetDbName}`);
    } else if (oldCourse.title === "Python") {
      oldCourse.title = "Advanced Python Systems & Distributed Task Queues";
      oldCourse.description = "Asyncio, Celery distributed tasks, FastAPI microservices, type hinting, memory profiling, and high-concurrency Python.";
      oldCourse.price = 1399;
      oldCourse.image = {
        public_id: "course_python_pro",
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
      };
      await oldCourse.save();
      console.log(`Replaced old test course "Python" in ${targetDbName}`);
    } else if (oldCourse.title === "MERN") {
      oldCourse.title = "Full-Stack MERN 2026 Production Architecture";
      oldCourse.description = "Build full-stack React, Node.js, Express, and MongoDB applications with JWT auth, Cloudinary uploads, and Stripe billing.";
      oldCourse.price = 1499;
      oldCourse.image = {
        public_id: "course_mern_pro",
        url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80",
      };
      await oldCourse.save();
      console.log(`Replaced old test course "MERN" in ${targetDbName}`);
    }
  }

  console.log(`Total courses in "${targetDbName}" now: ${await CourseModel.countDocuments()}`);
  await conn.close();
}

async function run() {
  try {
    // Seed both E-com (Render production database) and test databases
    await seedDatabase("E-com");
    await seedDatabase("test");
    console.log("\nALL DATABASES SUCCESSFULLY SEEDED WITH HD ARTWORKS & FULL CATALOG!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

run();
