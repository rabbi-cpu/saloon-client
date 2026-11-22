import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("salonBookDB");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://saloon-client-ten.vercel.app"
      : "http://localhost:3000"),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
      },
      phone: {
        type: "string",
        required: false,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
});