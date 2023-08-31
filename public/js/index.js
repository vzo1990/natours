/* eslint-disable */
import { login } from './login';
import { updateUserData, updateUserPassword } from './account';
import { logout } from './logout';
import { displayMap } from './mapbox';
import { bookTour } from './bookTour';

const mapBoxEl = document.getElementById('map');
const loginForm = document.querySelector('.login-form .form');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const logoutBtn = document.querySelector('.nav__el--logout');
const bookTourBtn = document.getElementById('book-tour');

if (mapBoxEl) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations,
  );

  if (locations.length > 0) displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });

if (logoutBtn)
  logoutBtn.addEventListener('click', () => {
    logout();
  });

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append('email', document.getElementById('email').value);
    form.append('name', document.getElementById('name').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateUserData(form);
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    updateUserPassword(currentPassword, newPassword, passwordConfirm);
  });

if (bookTourBtn)
  bookTourBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });
