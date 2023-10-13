import { ThemeProvider } from 'styled-components';

import { ColorProviderProps } from '../type';

const colors = {
    background: '#1E2938',
    darkBackground: '#111727',
    primary: '#453AE4',
    secondary: '#81858D',
    darkSecondary: '#282F3D',
    white: '#FFFFFFCC',
    placeHolder: '#C3C3C3',
    tercary: '#182035',
    darkTercary: '#141B2F',
    selected: '#293556',
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
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
ColorProvider.defaultProps = {
    isHomeRendered: false,
};
