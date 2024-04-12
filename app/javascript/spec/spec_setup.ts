import { server } from './msw_mocks/server.js';
import { cleanup } from '@testing-library/svelte';

// add jest-dom matchers to vitest
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

// inject a fake CSRF token
const ele = document.createElement('div');
ele.setAttribute('name', 'csrf-token');
document.body.append(ele);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
