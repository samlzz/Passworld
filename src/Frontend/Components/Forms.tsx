import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import submitLogo from '../assets/logoPW/SubmitLogo.png';
import openedeys from '../assets/Icones/PasswCard/oeuil_ouvert.svg';
import closedeys from '../assets/Icones/PasswCard/oeuil_fermer.svg';
import { EyesProps, ForRegisterProps, FormsProps } from '../Utils/type';
import { CatchErrorAlert, ErrorAlert, GoodAlert } from './SweetAlert';

// Début du style -------------->
const PageParent = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
`;
const FormContainer = styled.form<ForRegisterProps>`
    background-color: ${(props) => props.theme.darkBackground};
    height: ${(props) => (!props.$forRegister ? `78vh` : `88vh`)};
    width: 40vw;
    border-radius: 10vh;
    margin-bottom: 10vh;
    margin-top: ${(props) => (!props.$forRegister ? `-10vh` : `-12vh`)};
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
    position: relative;
`;
const StyledInput = styled.input`
    background-color: ${(props) => props.theme.background};
    border: none;
    outline: none;
    border-radius: 2vh;
    margin-left: 8%;
    width: 80%;
    height: 7vh;
    padding-left: 20px;
`;
const EyesButton = styled.button<EyesProps>`
    width: 2vw;
    position: absolute;
    right: 4.3vw;
    ${(props) =>
        props.$isEdit
            ? props.$isConfirm
                ? `bottom: ${props.$isHide ? `7.9vw` : `7.5vw`};`
                : `bottom: ${props.$isHide ? `13.9vw` : `13.5vw`};`
            : `bottom: ${props.$isHide ? `8.5vw` : `8.2vw`};`}
`;
const StyledEyes = styled.img`
    width: 2vw;
`;
const StyledSubmit = styled.input<ForRegisterProps>`
    border: none;
    outline: none;
    border-radius: 2vh;
    margin-left: 67%;
    margin-top: ${(props) => (!props.$forRegister ? `3.5vh` : `2.5vh`)};
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
    opacity: 0.9;
`;
// Fin du style --------------//

export function BegginForms({ title, noAccount }: FormsProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPsw, setConfirmPsw] = useState('');
    const [isHide, setIsHide] = useState(false);
    const [hidenMdpVal, setHidenMdpVal] = useState('');
    const [hidenConfVal, setHidenConfVal] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (
        event:
            | React.FormEvent<HTMLFormElement>
            | React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
        if (email === '' || password === '') {
            ErrorAlert('Need to provide email, password and confirmation');
            return;
        }
        let apiUrl;
        if (noAccount) {
            apiUrl = 'http://localhost:3000/register';
            if (password !== confirmPsw) {
                ErrorAlert('Confirmation is different of password');
                return;
            }
        } else {
            apiUrl = 'http://localhost:3000/login';
        }
        axios
            .post(
                apiUrl,
                { email, mdp: password },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((resp) => {
                if (resp.status === 200) {
                    if (noAccount) GoodAlert('Account successfully created');
                    else GoodAlert('Signed in successfully');
                    navigate('/home');
                }
            })
            .catch((error) => CatchErrorAlert(error));
    };

    const handleGetLetter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword((prevState) => {
            if (e.target.value.length < password.length) {
                return prevState.slice(0, -1);
            }
            const lastLetter = e.target.value[e.target.value.length - 1];
            return prevState + lastLetter;
        });

        const hidenVal = '*'.repeat(e.target.value.length);
        setHidenMdpVal(hidenVal);
    };
    const handleShowMdp = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        const hidenVal = '*'.repeat(e.target.value.length);
        setHidenMdpVal(hidenVal);
    };
    const handleConfirmGetLetter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPsw((prevState) => {
            if (e.target.value.length < password.length) {
                return prevState.slice(0, -1);
            }
            const lastLetter = e.target.value[e.target.value.length - 1];
            return prevState + lastLetter;
        });

        const hidenVal = '*'.repeat(e.target.value.length);
        setHidenConfVal(hidenVal);
    };
    const handleConfirmShowMdp = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPsw(e.target.value);
        const hidenVal = '*'.repeat(e.target.value.length);
        setHidenConfVal(hidenVal);
    };

    return (
        <PageParent>
            <FormContainer $forRegister={noAccount} onSubmit={handleSubmit}>
                <StyledTitle>{title}</StyledTitle>
                <InputContainer>
                    <StyledInput
                        type="input"
                        placeholder="e-mail..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <StyledInput
                        type="input"
                        placeholder="password..."
                        value={isHide ? hidenMdpVal : password}
                        onChange={isHide ? handleGetLetter : handleShowMdp}
                    />
                    <EyesButton
                        type="button"
                        onClick={() => setIsHide((prev) => !prev)}
                        $isHide={isHide}
                        $isEdit={noAccount}
                    >
                        <StyledEyes src={isHide ? openedeys : closedeys} />
                    </EyesButton>
                    {noAccount && (
                        <>
                            <EyesButton
                                type="button"
                                onClick={() => setIsHide((prev) => !prev)}
                                $isHide={isHide}
                                $isEdit={noAccount}
                                $isConfirm
                            >
                                <StyledEyes
                                    src={isHide ? openedeys : closedeys}
                                />
                            </EyesButton>
                            <StyledInput
                                type="input"
                                placeholder="confirmation of password..."
                                value={isHide ? hidenConfVal : confirmPsw}
                                onChange={
                                    isHide
                                        ? handleConfirmGetLetter
                                        : handleConfirmShowMdp
                                }
                            />
                        </>
                    )}
                    <StyledSubmit
                        type="submit"
                        value="Submit"
                        $forRegister={noAccount}
                    />
                </InputContainer>
            </FormContainer>
        </PageParent>
    );
}
