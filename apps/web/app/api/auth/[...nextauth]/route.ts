import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from "jsonwebtoken"
import { prismaClient } from '@repo/db/client';

const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt' , 
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any) {
        const user = await prismaClient.user.findUnique({
          where: { email: credentials.email},
        });

        if (user && user.password === credentials.password) {
          return { id: user.id, email: user.email };
        }

        return null;
      },
    }),
  ],
  callbacks:{
   jwt: async ({ token, user }) => {
  if (user) {
    try {
      console.log(user.id)
      const realJWT = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.NEXTAUTH_SECRET!,
        { expiresIn: "1d" }
      );

      token.user = {
        id: user.id,
        email: user.email,
        token: realJWT,
      };
    } catch (err) {
      console.error("JWT generation error:", err);
    }
  }
  return token;
},
session: async ({ session, token }) => {
  try {
    session.user = token.user as any;
    return session;
  } catch (err) {
    console.error("Session callback error:", err);
    return session;
  }
},
   },

 
  pages: {
    signIn: '/signup',
  }
}



const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
