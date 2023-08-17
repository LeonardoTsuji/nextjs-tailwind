import api from '@/utils/http';
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      type: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Email: exemplo@exemplo.com',
        },
        password: { label: 'Senha', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const user = await api.get('/usuario', {
            params: {
              login: credentials?.email,
            },
            headers: {
              Authorization: 'valid_token',
            },
          });

          if (user.data) return user.data[0];

          return null;
        } catch (error: any) {
          console.log(error, 'error');
          const message = error.response.data.message;
          throw new Error(message);
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log(token, 'token');
      console.log(user, 'user');
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        // session.id = token.id;
      }
      return session;
    },
  },
  secret: 'jwttoken',
  pages: {
    signIn: '/auth/signin',
    // error: '/auth/signin',
  },
  jwt: {
    secret: 'jwttoken',
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
