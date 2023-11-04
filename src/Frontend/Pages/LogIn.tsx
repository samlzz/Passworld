import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { BegginForms } from '../Components/Forms';

// Début du style -------------->
const LoginContainers = styled.div`
    position: relative;
`;
const RegisterLink = styled(Link)`
    z-index: 1;
    color: ${(props) => props.theme.primary};
    font-weight: 500;
    text-decoration: none;
    position: absolute;
    top: 77%;
    left: 43%;
`;
// Fin du style --------------//

export function LogIn() {
    return (
        <LoginContainers>
            <BegginForms title="Login" noAccount={false} />
            <RegisterLink to="/register">Don't have an account ?</RegisterLink>
        </LoginContainers>
    );
}
