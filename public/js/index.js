import { login } from '../js/login';
import { showMap } from '../js/mapbox';

const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form');

if (mapbox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  showMap(locations);
}

if (loginForm) {
  document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
