/* eslint-disable */
import { showAlert } from './alert';

export const createAccount = async (form) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: form,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created successfully!');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1500);
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};
