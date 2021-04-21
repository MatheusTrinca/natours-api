import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51Iih4FCsX75FS7s7KHAH3uH0EZCvGzf5iBYrUqnhF726vpEvt55OTKPjnfLhrXPtIWicr8h1iFEwypLZC2v5dpyx00R6Fmzlel'
);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout from API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    // 2) create checkout form - charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
