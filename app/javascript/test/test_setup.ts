import { cleanup } from '@testing-library/svelte';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom'; // Simplified import for newer versions

// inject a fake CSRF token
const ele = document.createElement('meta'); // Changed to meta which is more common for CSRF
ele.setAttribute('name', 'csrf-token');
ele.setAttribute('content', 'test-csrf-token');
document.head.append(ele); // Usually in document.head not body

afterEach(() => cleanup());
