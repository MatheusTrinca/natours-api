import { login, logout } from './login';
import { showMap } from './mapbox';
import '@babel/polyfill';

const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form');
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

if (logout) {
  logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    logout();
  });
}
