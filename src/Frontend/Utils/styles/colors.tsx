import { ThemeProvider } from 'styled-components';

import { ColorProviderProps } from '../type';

const colors = {
    background: '#1E2938',
    darkBackground: '#111727',
    lightBackground: '#1D2333',
    primary: '#453AE4',
    lightPrimary: '#747FEE',
    secondary: '#3C495A',
    darkSecondary: '#282F3D',
    white: '#FFFFFFCC',
    black: '#000000',
    placeHolder: '#C3C3C3',
    tercary: '#182035',
    darkTercary: '#141B2F',
    selected: '#293556',
    fieldBckgrd: '#233041',
    fadeFieldTitle: '#3C495A',
    redExit: '#7B2E34',
};

export function ColorProvider({
    children,
    isHomeRendered,
}: ColorProviderProps) {
    //---------
    const theme = {
        ...colors,
        isHomeRendered,
    };
    return <ThemeProvider theme={theme}> {children} </ThemeProvider>;
}
ColorProvider.defaultProps = {
    isHomeRendered: false,
};
