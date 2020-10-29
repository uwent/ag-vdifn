import { setupWorker, rest } from 'msw'
import { handlers } from '../app/javascript/spec/msw_mocks/handlers'

// Export the worker instance, so we can await the activation on Storybook's runtime.
// You can use this reference to start the worker for local development as well.
export const worker = setupWorker(...handlers)
