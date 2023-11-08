import styled, { createGlobalStyle } from 'styled-components';

export const LogoPW = styled.img`
    width: 18vw;
    margin-top: 3vh;
    margin-left: 2vh;
    z-index: 100;
    ${({ theme }) =>
        theme.isHomeRendered &&
        `    margin-left: -200px;
            z-index: -100;
    `}
`;

export const GlobalStyle = createGlobalStyle`${({ theme }) => `
    * {
        font-family: 'Trebuchet MS', Helvetica, sans-serif;
    }
    body, html {
        margin: 0;
        padding: 0;
        background-color: ${theme.background};
    }
    h1, h2, h3, h4, h5, h6, p, a, button, span, input{
        color: ${theme.white}
    }
    input, button{
        border: none;
        outline: none;
    }
    button{
        background: none;
        cursor: pointer;
    }

    //? Changement de la couleur des textes dans les input vides
        //* Pour la plupart des navigateurs modernes 
        ::placeholder {
            color: ${theme.placeHolder}; /* Choisissez votre couleur */
            opacity: 1;
        }

        //* Pour Internet Explorer 10-11 
        :-ms-input-placeholder {
            color: ${theme.placeHolder};
        }

        //* Pour Safari et Chrome, versions plus anciennes 
        ::-webkit-input-placeholder {
            color: ${theme.placeHolder};
        }
    //? Enlever les barres de défilements
        //* Pour les navigateurs basés sur Webkit (comme Chrome, Safari):
        ::-webkit-scrollbar {
            width: 0px; /* Pour les barres de défilement vertical */
            height: 0px; /* Pour les barres de défilement horizontal */
            background: transparent; /* Rendre les barres invisibles */
        }

        //* Pour Firefox:
        * {
            scrollbar-width: none;
        }
    `}
`;
