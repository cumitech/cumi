import Auth0Provider from "next-auth/providers/auth0";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { emptyUser } from "../domain/models/user";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { User } from "../data/entities/index";
import { AuthOptions } from "next-auth";

const authOptions: AuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH0_CLIENT_SECRET ?? "",
      issuer: process.env.AUTH0_ISSUER_BASE_URL ?? "",
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { 
          label: "Password", 
          type: "password" 
        },
        username: {
          label: "Username",
          type: "text",
        },
        confirmPassword: {
          label: "Confirm Password",
          type: "password",
        },
        action: {
          label: "Action",
          type: "text",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Check if this is a registration attempt
          if (credentials.action === "register") {
            if (!credentials.username || !credentials.confirmPassword) {
              throw new Error("Missing required fields for registration");
            }

            if (credentials.password !== credentials.confirmPassword) {
              throw new Error("Passwords do not match");
            }

            // Check if user already exists
            const existingUser = await User.findOne({
              where: { email: credentials.email },
            });

            if (existingUser) {
              throw new Error("User with this email already exists");
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(credentials.password, 12);

            // Create new user
            const newUser = await User.create({
              ...emptyUser,
              id: nanoid(20),
              username: credentials.username,
              email: credentials.email,
              password: hashedPassword,
              authStrategy: "credentials",
              role: "user",
              verified: false,
              fullname: credentials.username,
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            const { password, ...userWithoutPassword } = newUser.toJSON();
            return userWithoutPassword;
          }

          // This is a login attempt
          const currentUser = await User.findOne({
            where: { email: credentials.email },
          });

          if (!currentUser) {
            throw new Error("Invalid email or password");
          }

          // Check if user has a password (credentials auth)
          const userData = currentUser.toJSON();
          if (!userData.password) {
            throw new Error("Please use social login or reset your password");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            userData.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          const { password, ...userWithoutPassword } = currentUser.toJSON();
          return userWithoutPassword;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        const userItem = await User.findOne({
          where: { email: user?.email ?? "" },
        });
        const data = userItem?.toJSON();
        token.id = data?.id;
        token.name = data?.username;
        token.email = data?.email;
        token.provider = account?.provider;
        token.role = data?.role || "user";
        token.accountStatus = data?.accountStatus || "pending"; // ✅ Add accountStatus to token
      }
      return token;
    },

    async session({ session, token }) {
      // Add user info from token to session
      if (session.user) {
        session.user.id = token.id as string ?? "";
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
        session.user.image = token.picture ?? "";
        // session.user.provider = token.provider ?? "";
        session.user.role = (token.role as string) ?? "";
        session.user.accountStatus = (token.accountStatus as string) ?? "pending"; // ✅ Add accountStatus to session
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // For credentials provider, user is already created/validated in authorize function
      if (account?.provider === "credentials") {
        return true;
      }

      // For social providers (Auth0, Google, etc.)
      try {
        // Find user by email
        const existingUser = await User.findOne({
          where: { email: user?.email ?? "" },
        });
        
        if (!existingUser) {
          await User.create({
            ...emptyUser,
            id: nanoid(20),
            username: `${user.name}`,
            email: `${user.email}`,
            authStrategy: account?.provider,
            role: "user",
            verified: true,
            fullname: `${user.name}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          // Update existing user with latest profile info
          const userData = existingUser.toJSON();
          await existingUser.update({
            fullname: user.name || userData.fullname,
            updatedAt: new Date(),
          });
        }
      } catch (error: any) {
        console.error("SignIn callback error:", error);
        return false;
      }
      
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH0_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    newUser: "/",
    error: "/error",
  },
};

export default authOptions;

