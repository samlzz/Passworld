import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ColorProvider } from './Utils/styles/colors';
import logo from './assets/logoPW/LogoPassWorld.png';
import { GlobalStyle, LogoPW } from './Utils/styles/globalStyle';
import { LogIn } from './Pages/LogIn';
import { Register } from './Pages/Register';
import { Home } from './Pages/Home';
import { DataProvider } from './Utils/contexte';
import { EditMdp } from './Pages/EditMdp';

axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
function App() {
    const [isItRende, setIsItRender] = useState(false); // ? Etat pour suivre si Home est rendu
    return (
        <DndProvider backend={HTML5Backend}>
            <Router>
                <DataProvider>
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
                                        isRendered={(valu: boolean) =>
                                            setIsItRender(valu)
                                        }
                                    />
                                }
                            />
                            <Route path="/editMdp" element={<EditMdp />} />
                        </Routes>
                    </ColorProvider>
                </DataProvider>
            </Router>
        </DndProvider>
    );
}

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
