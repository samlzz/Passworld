import styled from 'styled-components';
import submitLogo from '../assets/logoPW/SubmitLogo.png';

import { ForRegisterProps, FormsProps } from '../Utils/type';

// Début du style -------------->
const PageParent = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
`;
const FormContainer = styled.div<ForRegisterProps>`
    background-color: ${(props) => props.theme.darkBackground};
    height: ${(props) => (!props.forRegister ? `78vh` : `88vh`)};
    width: 40vw;
    border-radius: 10vh;
    margin-bottom: 10vh;
    margin-top: ${(props) => (!props.forRegister ? `-10vh` : `-12vh`)};
`;
const StyledTitle = styled.h1`
    color: ${(props) => props.theme.white};
    font-size: 7vw;
    text-align: center;
`;
const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4vh;
`;
const StyledInput = styled.input`
    background-color: ${(props) => props.theme.secondary};
    border: none;
    outline: none;
    border-radius: 2vh;
    margin-left: 8%;
    width: 80%;
    height: 7vh;
    padding-left: 20px;
`;
const StyledSubmit = styled.input<ForRegisterProps>`
    border: none;
    outline: none;
    border-radius: 2vh;
    margin-left: 67%;
    margin-top: ${(props) => (!props.forRegister ? `3.5vh` : `2.5vh`)};
    background-color: ${(props) => props.theme.white};
    width: 25%;
    height: 7vh;
    cursor: pointer;
    background-image: url(${submitLogo});
    background-repeat: no-repeat;
    background-size: 31% 83%;
    background-position: 90% 50%;
    color: ${(props) => props.theme.primary};
    font-size: 1.5vw;
    font-weight: bold;
    text-align: center;
    padding-right: 50px;
    z-index: 2;
`;
// Fin du style --------------//

export function BegginForms({ title, noAccount }: FormsProps) {
    return (
        <PageParent>
            <FormContainer forRegister={noAccount}>
                <StyledTitle>{title}</StyledTitle>
                {noAccount ? (
                    <InputContainer>
                        <StyledInput type="input" placeholder="e-mail..." />
                        <StyledInput type="input" placeholder="password..." />
                        <StyledInput
                            type="input"
                            placeholder="confirmation of password..."
                        />
                        <StyledSubmit
                            type="submit"
                            value="Submit"
                            forRegister={noAccount}
                        />
                    </InputContainer>
                ) : (
                    <InputContainer>
                        <StyledInput type="input" placeholder="e-mail..." />
                        <StyledInput type="input" placeholder="password..." />
                        <StyledSubmit
                            type="submit"
                            value="Submit"
                            forRegister={noAccount}
                        />
                    </InputContainer>
                )}
            </FormContainer>
        </PageParent>
    );
}
