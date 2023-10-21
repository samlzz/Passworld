import { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';

import eysClose from '../assets/Icones/PasswCard/oeuil_fermer.svg';
import suprIco from '../assets/Icones/PasswCard/suppr.svg';
import editIco from '../assets/Icones/PasswCard/edit.svg';

import { PasswCardProps } from '../Utils/type';
import { CreatePassw } from './Password';

// Début du style -------------->
const CardDiv = styled.div`
    background-color: ${({ theme }) => theme.tercary};
    display: grid;
    height: 17.7vw;
    width: 17vw;
    border-radius: 2vw;
    margin-left: 4vw;
    overflow: hidden;
    padding-top: 1.3vw;
`;
const StyledEdit = styled.button`
    justify-self: end;
    align-self: start;
    margin: 1vw 0.7vw 0 0; //haut droite bas gauche
`;
const StyledLogo = styled.a`
    justify-self: center;
    align-self: start;
    margin-top: -6vh;
`;
const LogoImg = styled.img`
    width: 6vw;
`;
const IcoImg = styled.img`
    width: 2.2vw;
`;
const StyledTitle = styled.button`
    justify-self: start;
    margin: 0 0 0.5vh 0.8vw; //haut droite bas gauche
    font-size: 1.4vw;
`;
const MdpContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0.5vh 0 0 2vw; //haut droite bas gauche
    gap: 0.3vw;
    z-index: 0;
`;
const MdpWshow = styled.div`
    display: flex;
    flex-direction: row;
    background-color: ${({ theme }) => theme.selected};
    border-radius: 20vw;
    height: 3.2vh;
    align-items: center;
    padding-left: 0.8vw;
    width: 10vw;
    position: relative;
    z-index: 0;
`;
const EmailContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.selected};
    border-radius: 20vw;
    height: 3.2vh;
    margin: 1vh 0 0 2vw; // haut droite bas gauche
    width: 80%;
    padding-left: 0.2vw;
`;
const StyledAttrib = styled.button`
    font-size: 1.1vw;
`;
const StyledShow = styled.button`
    position: absolute;
    right: 0.5vw;
`;
const StyledDelete = styled.button`
    justify-self: end;
    align-self: end;
    background-color: ${({ theme }) => theme.tercary};
    margin: 0 0.8vw 1.6vh 0; //haut droite bas gauche
`;
// Fin du style --------------//

export function PasswCard({
    aPassw,
    copyIsSucces,
    toDelete,
    listFolderList,
}: PasswCardProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [locPassw, setLocPassw] = useState(aPassw);
    const [hidenmdp, setHidenmdp] = useState('**************');
    const { titre, icoLink, identifier, categName, id } = locPassw;

    useEffect(() => {
        if (isCopied) {
            copyIsSucces(isCopied);
        }
    }, [isCopied]);

    const handleShowMdp = () => {
        setHidenmdp((prev) =>
            prev === '**************' ? locPassw.mdp : '**************'
        );
    };

    function getAdress() {
        if (/^www\./.test(locPassw.siteAddress)) {
            return `https://${locPassw.siteAddress}`;
        }
        if (/^https:\/\//.test(locPassw.siteAddress)) {
            return locPassw.siteAddress;
        }
        return 'http://localhost:5173/home';
    }
    return (
        <CardDiv>
            <StyledEdit onClick={() => setIsEdit(true)}>
                <IcoImg src={editIco} alt="edit" />
            </StyledEdit>
            {
                // todo: Passer au premier plan
            }
            {isEdit ? (
                <CreatePassw
                    newPassw={(newPssw) => {
                        setLocPassw(newPssw);
                    }}
                    closed={(toClose) => setIsEdit(!toClose)}
                    arrOfArr={listFolderList}
                    aPassw={locPassw}
                />
            ) : (
                <></>
            )}
            <StyledLogo
                href={getAdress()}
                target={
                    getAdress() === 'http://localhost:5173/home' ? '' : '_blank'
                }
                rel="noopener noreferrer"
            >
                <LogoImg src={icoLink} alt={`Icon of ${titre}`} />
            </StyledLogo>
            <CopyToClipboard text={titre} onCopy={() => setIsCopied(true)}>
                <StyledTitle> {titre} </StyledTitle>
            </CopyToClipboard>
            {identifier === '' ? (
                <></>
            ) : (
                <EmailContainer>
                    <CopyToClipboard
                        text={identifier}
                        onCopy={() => setIsCopied(true)}
                    >
                        <StyledAttrib>{identifier}</StyledAttrib>
                    </CopyToClipboard>
                </EmailContainer>
            )}
            <MdpContainer>
                <MdpWshow>
                    <CopyToClipboard
                        text="motDePasse"
                        onCopy={() => setIsCopied(true)}
                    >
                        <StyledAttrib>{hidenmdp}</StyledAttrib>
                    </CopyToClipboard>
                    <StyledShow onClick={handleShowMdp}>
                        <img src={eysClose} alt="show button" />
                    </StyledShow>
                </MdpWshow>
            </MdpContainer>
            <StyledDelete
                onClick={
                    toDelete ? () => toDelete(categName, id, titre) : undefined
                }
            >
                <IcoImg src={suprIco} alt="delete" />
            </StyledDelete>
        </CardDiv>
    );
}
