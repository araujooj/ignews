import { Session } from 'next-auth/client';

interface Subscription {
  data: {
    id: string;
    userId: string;
    status: string;
    price_id: string;
  };
}

interface ISession extends Session {
  activeSubscription?: Subscription | null;
}
