import { NextAuthOptions, getServerSession } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { redirect } from 'next/navigation';

import axios from 'axios';

export const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_URL,
  callbacks: {
    async jwt({ token, account }) {
      const expires_at = token.expires_at as number;
      if (account) {
        return {
          accessToken: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token
        };
      } else if (Date.now() < expires_at * 1000) {
        return token;
      } else {
        try {
          const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            {
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token! as string
            },
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization:
                  'Basic ' +
                  Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID +
                      ':' +
                      process.env.SPOTIFY_CLIENT_SECRET
                  ).toString('base64')
              }
            }
          );

          const tokens = response.data;

          if (response.status != 200) throw tokens;

          return {
            ...token,
            accessToken: tokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
            refresh_token: tokens.refresh_token ?? token.refresh_token
          };
        } catch (error) {
          console.error('Error refreshing access token', error);
          return { ...token, error: 'RefreshAccessTokenError' as const };
        }
      }
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    }
  },
  providers: [
    SpotifyProvider({
      authorization: { params: { scope: 'user-top-read' } },
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string
    })
  ]
};

export async function loginIsRequiredServer() {
  const session = await getServerSession(authConfig);
  if (!session) return redirect('/');
}
