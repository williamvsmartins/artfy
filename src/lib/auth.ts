import { NextAuthOptions, getServerSession } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { redirect } from 'next/navigation';

export const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_URL,
  callbacks: {
    async jwt({ token, account }) {
      const expires_at = token.expires_at as number;
      if (account) {
        console.log(account);
        const expires_in = account.expires_at as number;
        return {
          accessToken: account.access_token,
          expires_at: Math.floor((Date.now() / 1000 + expires_in) as number),
          refresh_token: account.refresh_token
        };
      } else if (Date.now() < expires_at * 1000) {
        return token;
      } else {
        try {
          const response = await fetch(
            'https://accounts.spotify.com/api/token',
            {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: token.refresh_token! as string,
                client_id: process.env.SPOTIFY_CLIENT_ID || ''
              }),
              method: 'POST'
            }
          );

          const tokens = await response.json();

          if (!response.ok) throw tokens;

          return {
            ...token,
            accessToken: tokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_at),
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
