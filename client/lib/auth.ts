import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { getUserByEmail, createUser, generateUniqueUsername } from './models/User'
import { connectDB } from './mongodb'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      await connectDB()
      
      let existingUser = await getUserByEmail(user.email)
      
      if (!existingUser) {
        const username = await generateUniqueUsername(user.name || 'user')
        existingUser = await createUser({
          email: user.email,
          name: user.name || 'User',
          image: user.image || '',
          username,
        })
      }
      
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        await connectDB()
        const dbUser = await getUserByEmail(user.email!)
        if (dbUser) {
          token.id = dbUser._id.toString()
          token.username = dbUser.username
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
