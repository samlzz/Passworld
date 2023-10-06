import React from 'react';
import ReactDOM from 'react-dom/client';
import { LogIn } from './Pages/LogIn';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <LogIn />
    </React.StrictMode>
);
