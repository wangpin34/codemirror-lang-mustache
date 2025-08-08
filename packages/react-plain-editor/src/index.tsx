import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import "@radix-ui/themes/styles.css";
import { Theme } from '@radix-ui/themes'
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Theme>
        <App />
      </Theme>
    </React.StrictMode>,
  );
}
