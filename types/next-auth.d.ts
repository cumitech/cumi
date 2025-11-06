import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: string;
      accountStatus: string; // ✅ Add the accountStatus property
    };
  }
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: string;
    accountStatus: string; // ✅ Add the accountStatus property
  }
}
