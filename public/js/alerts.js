// Hide Alert
export const hideAlert = () => {
  const div = document.querySelector('.alert');
  if (div) {
    div.parentElement.removeChild(div);
  }
};

// Show Alert
export const showAlert = (type, message, time = 7) => {
  const div = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', div);
  window.setTimeout(() => {
    hideAlert();
  }, time * 1000);
};
