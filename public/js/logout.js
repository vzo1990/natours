/* eslint-disable */
import { showAlert } from './alert';

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully!');
      window.setTimeout(() => {
        location.replace('/');
      }, 1500);
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};
