import { ChangeEvent, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { useNavigate } from 'react-router';
import pp from '../assets/Icones/ProfilePic.png';
import icoPW from '../assets/logoPW/SubmitLogo.png';
import edit from '../assets/Icones/PasswCard/edit.svg';
import logOut from '../assets/svgShape/LogOutRedIco.svg';
import cross from '../assets/Icones/crossWhite.svg';
import valid from '../assets/Icones/Valid.svg';
import defaultIco from '../assets/logoPW/defaultIcoDark.png';
import { IPassw, ParamProps } from '../Utils/type';
import { BadAlert, CatchErrorAlert, GoodAlert } from './SweetAlert';

// Début du style -------------->
const Backgrnd = styled.button`
    width: 100%;
    height: 130vh;
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${({ theme }) => theme.darkTercary};
    opacity: 0.8;
    cursor: default;
`;

const AllContainer = styled.div`
    background: ${({ theme }) => theme.darkBackground};
    border-radius: 3vw;
    z-index: 2;
    position: absolute;
    left: 20vw;
    top: 8vw;
    width: 63vw;
    height: 38vw;
    display: flex;
    flex-direction: row;
`;
const CrossButton = styled.button`
    width: 5vw;
    position: absolute;
    top: 2.5vw;
    left: 1.8vw;
`;
const CrossImg = styled.img`
    width: 2.8vw;
    opacity: 0.8;
`;
const ParamsContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 14% 8% 0 2%;
`;
const ChoosePrm = styled.button<{ $isAccount?: boolean; $isSelect: boolean }>(
    ({ theme, $isAccount, $isSelect }) => `
    padding-left: 3vw;
    padding-right: 1vw;
    background-color: ${theme.background};
    background-image: url(${$isAccount ? pp : icoPW});
    background-repeat: no-repeat;
    background-size: ${$isAccount ? ` 18% 77%;` : ` 15% 67%;`}
    background-position: 5% 50%;
    border-radius: 0.8vw;
    height: 3.8vw;
    width: ${$isAccount ? `16vw;` : `17vw;`}
    margin: 12% 0 0 10%;
    ${$isSelect && `background-color: ${theme.selected};`}
`
);
const FieldContainer = styled.div`
    width: 70%;
    height: 96%;
    z-index: 3;
    background: ${({ theme }) => theme.background};
    margin: 1.3% 0 0 0;
    border-radius: 3vw;
    display: flex;
    flex-direction: column;
    gap: 1vw;
    position: relative;
`;
const FieldsTitle = styled.h2`
    margin: 1.5vw 0 0 10.5vw;
`;
const ABar = styled.div`
    height: 0.15vw;
    width: 100%;
    background: ${({ theme }) => theme.fadeFieldTitle};
    z-index: 3;
    margin: 0.3vw 0 2.5vw 0;
`;
const CSVInfoBulle = styled.p(
    ({ theme }) => `
    color: ${theme.fadeFieldTitle};
    position: relative;
    margin: -3.5vw 0 0vw 24vw;

    &:hover::before {
        opacity: 0.4;
    }

    &::before {
        content: attr(data-tooltip);
        white-space: pre;
        position: absolute;
        bottom: 75%;
        left: 35%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
        color: ${theme.placeHolder};
        background: ${theme.darkBackground};
        border: 1px solid ${theme.placeHolder};
        width: 19vw;
        height: 3.3vw;
        border-radius: 0.5vw;
        font-size: 1vw;
        padding: 0.3vw;
        line-height: 1.2vw;
    }
`
);
const FadeTitles = styled.p<{ $multPsw?: boolean }>`
    color: ${({ theme }) => theme.fadeFieldTitle};
    margin: 0.6vw 0 0.6vw 5vw;
    font-weight: 700;
    ${({ $multPsw }) => $multPsw && `margin-top: 2vw;`}
`;
const StyledField = styled.div<{ $multPsw?: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    ${({ $multPsw }) =>
        $multPsw &&
        ` margin: 0 0 0 10vw;
          gap: 3vw;`}
`;
const FieldInput = styled.input`
    height: 3.8vw;
    width: 18.8vw;
    margin: 0 0 0.5vw 8.3vw;
    border-radius: 1vw;
    background-color: ${({ theme }) => theme.fieldBckgrd};
    padding-left: 1vw;
`;
const FieldEdit = styled.button<{ $isEdit?: boolean }>(
    ({ theme, $isEdit }) => `
    z-index: 5;
    background-color: ${theme.primary};
    background-image: url(${$isEdit ? valid : edit});
    background-repeat: no-repeat;
    background-position: 55% 45%;
    background-size: ${$isEdit ? `100% 100%;` : `60% 60%;`}
    margin: 0 0 0.35vw -4.1vw;
    width: 3.3vw;
    height: 2.75vw;
    border-radius: 0.6vw;
`
);
const ImgLogOut = styled.img`
    width: 3vw;
`;
const StyledLogOut = styled.button`
    width: 3vw;
    position: absolute;
    right: 2.5vw;
    top: 31.5vw;

    &:hover::before {
        opacity: 0.6;
    }

    &::before {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-opacity: 0.2;
        color: white;
        padding: 5px;
        border-radius: 5px;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
        z-index: 1000;
    }
`;
const PasswCount = styled.p`
    height: 3.3vw;
    width: 15vw;
    margin: 0.4vw 0 0.8vw 2vw;
    border-radius: 1vw;
    background-color: ${({ theme }) => theme.fieldBckgrd};
    padding-left: 1vw;
    padding-top: 0;
    display: flex;
    align-items: center;
    text-align: center;
`;
const TheCount = styled.p`
    background-color: ${({ theme }) => theme.primary};
    height: 2vw;
    padding: 0 0.7vw;
    border-radius: 0.6vw;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    position: absolute;
    top: 8.55vw;
    right: 7vw;
    font-weight: 700;
`;
const HiddenInput = styled.input`
    display: none;
`;
const StyledButt = styled.button<{ $isDel?: boolean }>(
    ({ theme, $isDel }) => `
    background-color: ${$isDel ? theme.redExit : theme.primary};
    height: 2.75vw;
    border-radius: 0.6vw;
    padding: 0 1vw;
    margin-top: 1vw;
`
);
// Fin du style --------------//

export function ParamsWindow({ toClosed, onLogOut }: ParamProps) {
    const [isAccount, setIsAccount] = useState(true);
    const [isPassw, setIsPassw] = useState(false);
    const [email, setEmail] = useState('');
    const [emailEdited, setEmailEdited] = useState(false);
    const [pswCount, setPswCount] = useState(0);

    const refFileInput = useRef<HTMLInputElement | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get('http://localhost:3000/setting')
            .then((resp) => {
                if (resp.status === 200) {
                    const { identifier, nbOfPassw } = resp.data;
                    if (identifier && nbOfPassw) {
                        setEmail(identifier);
                        setPswCount(nbOfPassw);
                    } else
                        throw new Error(
                            'Data of the user cannot be upload correctly'
                        );
                }
                if (resp.status === 401) navigate('/');
            })
            .catch((err) => {
                CatchErrorAlert(err);
                navigate('/home');
            });
    }, []);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (emailEdited === true) {
            setEmail(e.target.value);
        }
    };
    const handleEditEmail = () => {
        setEmailEdited((prev) => !prev);
        if (emailEdited === true) {
            axios
                .put('http://localhost:3000/editUser', { newEmail: email })
                .then((resp) => {
                    console.log(resp);
                    if (resp.status === 200) {
                        GoodAlert(resp.data.msg);
                    }
                    if (resp.status === 401) navigate('/');
                })
                .catch((err) => {
                    console.log(err);
                    CatchErrorAlert(err);
                    navigate('/home');
                });
        }
    };
    const handleImportPsw = () => {
        if (refFileInput.current) refFileInput.current.click();
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (event.target.files) {
                const file = event.target.files[0];
                if (event.target.files.length > 1)
                    BadAlert(
                        'Only the content of the first files will be import'
                    );
                const reader = new FileReader();
                reader.onload = (e) => {
                    const text = e?.target?.result as string;
                    if (text) {
                        const lines = text.split('\n');
                        const newpswList: IPassw[] = [];
                        lines.forEach((line) => {
                            const valu = line.split(',');
                            const passw: IPassw = {
                                _id: '',
                                mdp: valu[0],
                                identifier: valu[1],
                                categName: 'All passwords',
                                siteAddress: valu[2],
                                titre: valu[2].split('.')[1],
                                icoLink: defaultIco,
                            };
                            newpswList.push(passw);
                        });
                        axios
                            .post('http://localhost:3000/addMultPsw', {
                                newpswList,
                            })
                            .then((resp) => GoodAlert(resp.data.msg))
                            .catch(() => {
                                throw new Error();
                            });
                    }
                };
                reader.readAsText(file);
            } else throw new Error();
        } catch {
            BadAlert('Error when file import');
        }
    };

    return (
        <>
            <Backgrnd onClick={() => toClosed()} />
            <AllContainer>
                <CrossButton onClick={() => toClosed()}>
                    <CrossImg src={cross} alt="cross" />
                </CrossButton>
                <ParamsContainer>
                    <ChoosePrm
                        onClick={() => {
                            setIsPassw(false);
                            setIsAccount((prev) => !prev);
                        }}
                        $isAccount
                        $isSelect={isAccount}
                    >
                        Account parameters
                    </ChoosePrm>
                    <ChoosePrm
                        onClick={() => {
                            setIsAccount(false);
                            setIsPassw((prev) => !prev);
                        }}
                        $isSelect={isPassw}
                    >
                        Password parameters
                    </ChoosePrm>
                </ParamsContainer>
                {isAccount && (
                    <FieldContainer>
                        <FieldsTitle> Account parameters </FieldsTitle>
                        <ABar> </ABar>
                        <FadeTitles> Identifier: </FadeTitles>
                        <StyledField>
                            <FieldInput
                                value={email}
                                onChange={handleEmailChange}
                            />
                            <FieldEdit
                                $isEdit={emailEdited}
                                onClick={handleEditEmail}
                            />
                        </StyledField>
                        <FadeTitles> Password: </FadeTitles>
                        <StyledField>
                            <FieldInput defaultValue="**********" />
                            <FieldEdit />
                        </StyledField>
                        <StyledLogOut
                            type="button"
                            onClick={() => onLogOut()}
                            data-tooltip="Log Out.."
                        >
                            <ImgLogOut src={logOut} alt="log out" />
                        </StyledLogOut>
                    </FieldContainer>
                )}
                {isPassw && (
                    <FieldContainer>
                        <FieldsTitle> Password parameters </FieldsTitle>
                        <ABar />
                        <StyledField>
                            <FadeTitles> Password count: </FadeTitles>
                            <PasswCount> All passwords </PasswCount>
                            <TheCount> {pswCount} </TheCount>
                        </StyledField>
                        <FadeTitles $multPsw>
                            Actions on multiple passwords:
                        </FadeTitles>
                        <CSVInfoBulle
                            data-tooltip="For import some passwords you need to
provide a .csv file like :
PSW, IDENTIFIER, SITELINK"
                        >
                            *
                        </CSVInfoBulle>
                        <StyledField $multPsw>
                            <HiddenInput
                                type="file"
                                accept=".csv"
                                ref={refFileInput}
                                onChange={handleFileChange}
                            />
                            <StyledButt onClick={handleImportPsw}>
                                Import
                            </StyledButt>
                            <StyledButt>Export</StyledButt>
                            <StyledButt $isDel>Delete</StyledButt>
                        </StyledField>
                    </FieldContainer>
                )}
            </AllContainer>
        </>
    );
}
