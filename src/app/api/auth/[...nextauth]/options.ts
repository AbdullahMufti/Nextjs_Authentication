import { LoginSchema } from "@/models/authModel";
import { connect } from "@/database/mongo.config";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions, ISODateString, User } from "next-auth";

import { JWT } from "next-auth/jwt";

export type CustomSession = {
  user?: CustomUser;
  expires: ISODateString;
};

export type CustomUser = {
  _id?: string | null;
  name?: string | null;
  email?: string | null;
  account_type?: string | null;
};

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      connect();
      try {
        const findUser = await LoginSchema.findOne({ email: user.email });
        if (findUser) {
          return true;
        }
        let cyear = new Date();
        const ThisYear = cyear.getFullYear();

        const maxrollNumberPerson = await LoginSchema.find({})
          .sort({ rollnumber: -1 })
          .limit(1)
          .then((goods: any) => goods[0].rollnumber);

        let newRollnumber = maxrollNumberPerson + 1 || 0;

        await LoginSchema.create({
          email: user.email,
          name: user.name,
          account_type: "Student",
          allowed_roles: ["student"],
          rollyear: ThisYear,
          rollnumber: newRollnumber,
          rollclass: "GSTU",
          batch: "GStudent",
        });
        return true;
      } catch (error) {
        console.log("The error is ", error);
        return false;
      }
    },

    async jwt({ token, user }: { token: JWT; user: CustomUser }) {
      if (user) {
        user.account_type =
          user?.account_type == null ? "Student" : user?.account_type;
        token.user = user;
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: CustomSession;
      token: JWT;
      user: User;
    }) {
      session.user = token.user as CustomUser;
      return session;
    },
  },
  providers: [
    Credentials({
      name: "Welcome Back",
      type: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // * Connect to the MongoDb
        connect();
        const user = await LoginSchema.findOne(
          { email: credentials?.email },
          {
            name: 1,
            email: 1,
            account_type: 1,
            allowed_roles: 1,
            phone: 1,
            whatsapp: 1,
            address: 1,
            country: 1,
            childname: 1,
            childage: 1,
            rollclass: 1,
            rollyear: 1,
            rollnumber: 1,
            batch: 1,
          }
        );
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
};
