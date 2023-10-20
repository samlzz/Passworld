import { ThemeProvider } from 'styled-components';

import { useContext } from 'react';
import { ColorProviderProps } from '../type';
import { StyleContext } from '../contexte';

const colors = {
    background: '#1E2938',
    darkBackground: '#111727',
    primary: '#453AE4',
    lightPrimary: '#747FEE',
    secondary: '#81858D',
    darkSecondary: '#282F3D',
    white: '#FFFFFFCC',
    black: '#000000',
    placeHolder: '#C3C3C3',
    tercary: '#182035',
    darkTercary: '#141B2F',
    selected: '#293556',
};

export function ColorProvider({
    children,
    isHomeRendered,
}: ColorProviderProps) {
    const { selectWBut } = useContext(StyleContext);
    const theme = {
        ...colors,
        isHomeRendered,
        selectWBut,
    };
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
ColorProvider.defaultProps = {
    isHomeRendered: false,
};
