/* eslint-disable */
import { login, logout } from './login';
import { showMap } from './mapbox';
import '@babel/polyfill';
import { updateSettings } from './updateSettings';

const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const userForm = document.querySelector('.form-user-data');
const userPassword = document.querySelector('.form-user-password');
const logoutBtn = document.querySelector('.nav__el--logout');

if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  showMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    logout();
  });
}

if (userForm) {
  userForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings('user', form);
  });
}

if (userPassword) {
  userPassword.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings('password', {
      passwordCurrent,
      password,
      passwordConfirm,
    });
    document.querySelector('.btn--password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
