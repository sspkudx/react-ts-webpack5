import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const injected = document.querySelector('#app');
if (injected) {
    createRoot(injected).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}
