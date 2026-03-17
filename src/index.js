import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { StrictMode } from 'react';
import { getElementById, getMountId, debug } from './utils/dom';

debug('ccdb5-ui bootstrap', window.__CCDB_CONFIG__ || {});
const container = getElementById(getMountId());
if (!container) {
  throw new Error('ccdb5-ui mount element not found.');
}
const root = createRoot(container);
root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
