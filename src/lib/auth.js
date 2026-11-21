import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db(process.env.DB_NAME || "pizzaHubDB");

export const auth = betterAuth({
  database: mongodbAdapter(db),
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
        input: true, // Allows selecting "customer" or "vendor" on signup
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
          // Security: Prevent anyone from registering as "admin" publicly
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