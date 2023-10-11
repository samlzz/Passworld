import styled, { createGlobalStyle } from 'styled-components';

export const LogoPW = styled.img`
    width: 18vw;
    margin-top: 3vh;
    margin-left: 2vh;
    z-index: 100;
    ${({ theme }) =>
        theme.isHomeRendered &&
        `    margin-bottom: 5vh;
    `}
`;

export const GlobalStyle = createGlobalStyle`
* {
    font-family: 'Trebuchet MS', Helvetica, sans-serif;
}
body, html {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.background};
}
h1, h2, h3, h4, h5, h6, p, a, button, span, input{
    color: ${({ theme }) => theme.white}
}
input, button{
    border: none;
    outline: none;
}
button{
    background: none;
}

//? Changement de la couleur des textes dans les input vides
    //* Pour la plupart des navigateurs modernes 
    ::placeholder {
        color: ${({ theme }) =>
            theme.placeHolder}; /* Choisissez votre couleur */
        opacity: 1; /* Firefox support, important de le définir pour assurer une couleur cohérente */
    }

    //* Pour Internet Explorer 10-11 
    :-ms-input-placeholder {
        color: ${({ theme }) => theme.placeHolder};
    }

    //* Pour Safari et Chrome, versions plus anciennes 
    ::-webkit-input-placeholder {
        color: ${({ theme }) => theme.placeHolder};
    }
`;
