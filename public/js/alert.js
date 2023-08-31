/* eslint-disable */
export const showAlert = (type, msg) => {
  closeAlert();

  const markup = `<div class="alert alert--${type}"> ${msg} </div>`;

  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(() => {
    closeAlert();
  }, 3000);
};

export const closeAlert = () => {
  const alert = document.querySelector('.alert');
  if (alert) alert.parentElement.removeChild(alert);
};
