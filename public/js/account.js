/* eslint-disable */
import { showAlert } from './alert';

export const updateUserData = async (form) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/update-user',
      data: form,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account updated successfully!');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1500);
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};

export const updateUserPassword = async (
  currentPassword,
  password,
  passwordConfirm,
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/update-password',
      data: {
        currentPassword,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};
