import '~/src/scss/global.scss';
import App from '~/src/app.svelte';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App({ target: document.body });
  (window as any).app = app;
});
