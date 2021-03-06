import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { Session } from 'next-auth/client';

import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user',
    }),
  ],
  database: process.env.DATABASE_URL,
  callbacks: {
    async session(session: Session) {
      try {
        const getUserRefByEmail = q.Select(
          'ref',
          q.Get(q.Match(q.Index('user_by_email'), q.Casefold(session.user.email))),
        );

        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(q.Index('subscription_by_user_ref'), getUserRefByEmail),
              q.Match(q.Index('subscription_by_status'), 'active'),
            ]),
          ),
        );

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch (error) {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    async signIn(user, account, profile) {
      const { email } = user;

      const createUser = q.Create(q.Collection('users'), { data: { email } });

      const userWithEmail = q.Match(q.Index('user_by_email'), q.Casefold(user.email));

      try {
        await fauna.query(q.If(q.Not(q.Exists(userWithEmail)), createUser, q.Get(userWithEmail)));

        return true;
      } catch {
        return false;
      }
    },
  },
});
