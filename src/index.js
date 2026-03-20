import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { StrictMode } from 'react';
import { getElementById, getMountId } from './utils/dom';

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
