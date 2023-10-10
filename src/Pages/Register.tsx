import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { BegginForms } from '../Components/Forms';

// Début du style -------------->
const RegisterContainers = styled.div`
    position: relative;
`;
const LoginLink = styled(Link)`
    z-index: 1;
    color: ${(props) => props.theme.primary};
    font-weight: 500;
    text-decoration-color: ${(props) => props.theme.background};
    font-size: 1.4vw;
    position: absolute;
    top: 81%;
    left: 42%;
`;
// Fin du style --------------//

export function Register() {
    return (
        <RegisterContainers>
            <BegginForms title="Register" noAccount />
            <LoginLink to="/">Already have an account ?</LoginLink>
        </RegisterContainers>
    );
}
