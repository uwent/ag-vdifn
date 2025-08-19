import { mount } from 'svelte';
import App from '~/src/App.svelte';
import '~/src/scss/global.scss';
import '../stylesheets/tailwind.css';

const app = mount(App, { target: document.body });

export default app;
