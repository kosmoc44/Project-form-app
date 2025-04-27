import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_L1yz5hWTprjl@ep-spring-dream-a4dpyqsm-pooler.us-east-1.aws.neon.tech/Project-Form?sslmode=require",
  },
});
