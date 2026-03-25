import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { connect } from "./mongodb";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const col = await connect("users");
          // email lowercase করে DB-তে খুঁজি
          const user = await col.findOne({ email: credentials.email.toLowerCase().trim() });

          if (!user || !user.password) return null;

          // bcryptjs synchronous compare
          const isValid = bcrypt.compareSync(credentials.password, user.password);
          if (!isValid) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || null,
            role: user.role || "user",
          };
        } catch (err) {
          console.error("Credentials authorize error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // Google login — DB-তে user না থাকলে তৈরি করো
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const col = await connect("users");
          const existing = await col.findOne({ email: user.email });

          if (!existing) {
            const result = await col.insertOne({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user",
              createdAt: new Date(),
            });
            user.id = result.insertedId.toString();
            user.role = "user";
          } else {
            user.id = existing._id.toString();
            user.role = existing.role || "user";
          }
        } catch (err) {
          console.error("Google signIn DB error:", err);
          return false;
        }
      }
      return true;
    },

    // JWT-তে id ও role রাখো
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    // Session-এ id ও role expose করো
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role ?? "user";
      }
      return session;
    },
  },

  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt" },
});
