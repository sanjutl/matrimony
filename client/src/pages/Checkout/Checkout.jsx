import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutWrapper from './CheckoutForm';
import { useParams } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51QrI1KDAmifl26iyPebU9XYcNl3sWZW8yLoG7YWx7ejIQEUjsHnEt3v242qu7BlTH3eQydrwP4t3ugXInfzMf0qp0035cEq2zC');

const Checkout = () => {
    const { profileId, userId } = useParams(); 
  return (
    <Elements stripe={stripePromise}>
      <CheckoutWrapper userId={userId} profileId={profileId} stripePromise={stripePromise}/>
    </Elements>
  );
};

export default Checkout;
