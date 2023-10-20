import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ThemeFurnisher } from './Utils/contexte';
import { ColorProvider } from './Utils/styles/colors';
import logo from './assets/logoPW/LogoPassWorld.png';
import { GlobalStyle, LogoPW } from './Utils/styles/globalStyle';
import { LogIn } from './Pages/LogIn';
import { Register } from './Pages/Register';
import { Home } from './Pages/Home';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
function App() {
    // Créez un état pour suivre si Home est rendu
    const [isItRende, setIsItRender] = useState(false);
    return (
        <Router>
            <ThemeFurnisher>
                <ColorProvider isHomeRendered={isItRende}>
                    <GlobalStyle />
                    <LogoPW src={logo} alt="Logo of PassWorld" />
                    <Routes>
                        <Route path="/" element={<LogIn />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/home"
                            element={
                                <Home
                                    isRendered={(valu) => setIsItRender(valu)}
                                />
                            }
                        />
                    </Routes>
                </ColorProvider>
            </ThemeFurnisher>
        </Router>
    );
}

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
