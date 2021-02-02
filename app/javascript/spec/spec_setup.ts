import '@testing-library/jest-dom'
import { server } from './msw_mocks/server.js'

const ele = document.createElement('div')
ele.setAttribute('name', 'csrf-token')
document.body.append(ele)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
