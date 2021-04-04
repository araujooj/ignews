import React from 'react';
import { GetStaticProps } from 'next';
import { Landing } from './landing';
import { stripe } from '../services/stripe';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

const Home = ({ product }: HomeProps) => <Landing product={product} />;

export default Home;

// Utilizar getStaticProps apenas quando a página utiliza dados dinâmicos porém pode ser estática.
// Ou seja... Dados que não mudam facilmente.
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1IbO9YEX8A7yQBNbEw8wMBoc', {
    expand: ['product'],
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours,
  };
};
