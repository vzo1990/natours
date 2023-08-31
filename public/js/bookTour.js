/* eslint-disable */
import { showAlert } from './alert';

export const bookTour = async (id) => {
  try {
    const res = await axios(
      `http://127.0.0.1:3000/api/v1/booking/checkout-session/${id}`,
    );

    location.assign(res.data.stripeSession.url);
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};
