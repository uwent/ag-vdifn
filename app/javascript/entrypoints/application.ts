import { mount } from 'svelte';
import App from '~/src/App.svelte';
import "../stylesheets/application.css";

const app = mount(App, { target: document.body });

export default app;
