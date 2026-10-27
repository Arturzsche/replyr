import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const GOOGLE_SCOPES = "openid email profile https://www.googleapis.com/auth/business.manage"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: GOOGLE_SCOPES,
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
  events: {
    // The adapter only writes tokens when an account is first linked. Refresh them on every
    // sign-in so users who log in again (e.g. to grant business.manage) get fresh tokens stored.
    async signIn({ account }) {
      if (account?.provider !== "google") return
      await prisma.account.updateMany({
        where: { provider: "google", providerAccountId: account.providerAccountId },
        data: {
          access_token: account.access_token,
          expires_at: account.expires_at,
          scope: account.scope,
          id_token: account.id_token,
          token_type: account.token_type,
          // Google only returns a refresh token on consent; never overwrite one with undefined.
          ...(account.refresh_token ? { refresh_token: account.refresh_token } : {}),
        },
      })
    },
  },
})
