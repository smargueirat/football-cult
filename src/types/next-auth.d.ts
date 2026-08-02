import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    favorites?: string[];
    priceAlerts?: string[];
    user?: DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    favorites?: string[];
    priceAlerts?: string[];
  }
}
