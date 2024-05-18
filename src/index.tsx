import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const main = () => {
    const appDom = document.getElementById('app');
    const appRoot = createRoot(appDom ? appDom : document.body);

    appRoot.render(
        <StrictMode>
            <App />
        </StrictMode>
    );
};

main();
