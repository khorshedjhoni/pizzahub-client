import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

function getDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGO_URI environment variable");
  }

  const globalForMongo = globalThis;
  const client = globalForMongo._mongoClient ?? new MongoClient(uri);

  if (process.env.NODE_ENV !== "production") {
    globalForMongo._mongoClient = client;
  }

  return client.db(process.env.DB_NAME || "pizzaHubDB");
}

export const auth = betterAuth({
  database: mongodbAdapter(getDb()),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      businessName: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
      location: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      phone: { type: "string", required: false, defaultValue: "", input: true },
      bio: { type: "string", required: false, defaultValue: "", input: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const allowedRoles = ["customer", "vendor"];
          const safeRole = allowedRoles.includes(user.role) ? user.role : "customer";
          return {
            data: {
              ...user,
              role: safeRole,
              subscriptionPlan: "free",
              isBlocked: false,
            },
          };
        },
      },
    },
  },
  plugins: [jwt(), nextCookies()],
});