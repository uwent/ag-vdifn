import '@testing-library/jest-dom'
const ele = document.createElement("div");
ele.setAttribute("name", "csrf-token");
document.body.append(ele);

import { server } from './msw_mocks/server.js'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

