import { signIn, useSession } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

export const SubscribeButton = () => {
  const [session] = useSession();

  const handleSubscribe = async () => {
    if (!session) {
      return signIn('github');
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
