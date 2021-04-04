import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { ISession } from '../../@types/ISession';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

export const SubscribeButton = () => {
  const [session]: [ISession, boolean] = useSession();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!session) {
      return signIn('github');
    }

    if (session.activeSubscription) {
      return router.push('/posts');
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;
      const stripe = await getStripeJs();

      stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <button onClick={handleSubscribe} className={styles.subscribeButton} type="button">
      Subscribe now
    </button>
  );
};
