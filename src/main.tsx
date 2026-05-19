/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * @description
 * Application Root Entry Point.
 * Enforces strict concurrent mode rendering and global stylesheet injection.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('[Architect Fatal] Root element not found in DOM.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);