import { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { useDrag } from 'react-dnd/dist/hooks';

import eysClose from '../assets/Icones/PasswCard/oeuil_fermer.svg';
import eysOpen from '../assets/Icones/PasswCard/eye-solid1.svg';
import suprIco from '../assets/Icones/PasswCard/suppr.svg';
import editIco from '../assets/Icones/PasswCard/edit.svg';

import { PasswCardProps } from '../Utils/type';
import { CreatePassw } from './Password';
import { useData } from '../Utils/contexte';

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
    margin-bottom: 2.4vw;
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
const MdpWshow = styled.div<{ $toLong?: boolean }>`
    display: flex;
    flex-direction: row;
    background-color: ${({ theme }) => theme.selected};
    border-radius: 20vw;
    height: 1.7vw;
    ${(props) => props.$toLong && `height: 3vw;`}
    align-items: center;
    padding-left: 0.8vw;
    width: 10vw;
    position: relative;
    z-index: 0;
    overflow: hidden;
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
const StyledAttrib = styled.button<{ $toLong?: boolean }>`
    font-size: 1.1vw;
    ${(props) =>
        props.$toLong &&
        `
        width: 8vw;
        word-break: break-all;
    `}
`;
const StyledShow = styled.button`
    position: absolute;
    right: 0.5vw;
`;
const ShowImage = styled.img`
    width: 1vw;
`;
const StyledDelete = styled.button`
    justify-self: end;
    align-self: end;
    background-color: ${({ theme }) => theme.tercary};
    margin: 0 0.8vw 1.6vh 0; //haut droite bas gauche
`;
const CopySucces = styled.span`
    position: fixed;
    bottom: 2vh;
    left: 50%;
    align-self: center;
    background-color: ${({ theme }) => theme.darkSecondary};
    width: 13vw;
    height: 2.5vw;
    border-radius: 1vw;
    padding: 1vw 0 0 1.4vw; //haut droite bas gauche
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
    opacity: 0.9;
`;
// Fin du style --------------//

export function PasswCard({ aPassw, toDelete, nouvCateg }: PasswCardProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [locPassw, setLocPassw] = useState(aPassw);
    const [hidenmdp, setHidenmdp] = useState('**************');
    const [isShow, setIsShow] = useState(false);
    const [isToLong, setIsToLong] = useState(false);

    const { editPassw } = useData();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { titre, icoLink, identifier, categName, _id } = locPassw;
    if (!categName) {
        setLocPassw((prev) => ({
            ...prev,
            categName: 'All paswords',
        }));
    }

    const [, dragRef] = useDrag(() => ({
        type: 'PASSWCARD',
        item: { id: _id, type: 'PASSWCARD' },
    }));

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false);
            }, 1500); // 1.5 secondes
            return () => clearTimeout(timer);
        }
        return () => null;
    }, [isCopied]);

    const handleShowMdp = () => {
        setIsShow((prev) => !prev);
        setIsToLong(locPassw.mdp.length > 12);
        setHidenmdp((prev) =>
            prev === '**************' ? locPassw.mdp : '**************'
        );
        if (hidenmdp !== '**************') setIsToLong(false);
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
        <>
            <CardDiv ref={dragRef}>
                <StyledEdit onClick={() => setIsEdit(true)}>
                    <IcoImg src={editIco} alt="edit" />
                </StyledEdit>
                {isEdit ? (
                    <CreatePassw
                        newPassw={(newPssw) => {
                            setLocPassw(newPssw);
                            editPassw(newPssw);
                        }}
                        closed={(toClose) => setIsEdit(!toClose)}
                        aPassw={locPassw}
                        newCateg={(newCtgNm) => nouvCateg(newCtgNm)}
                        isEdit
                    />
                ) : (
                    <></>
                )}
                <StyledLogo
                    href={getAdress()}
                    target={
                        getAdress() === 'http://localhost:5173/home'
                            ? ''
                            : '_blank'
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
                    <MdpWshow $toLong={isToLong}>
                        <CopyToClipboard
                            text={locPassw.mdp}
                            onCopy={() => setIsCopied(true)}
                        >
                            <StyledAttrib $toLong={isToLong}>
                                {hidenmdp}
                            </StyledAttrib>
                        </CopyToClipboard>
                        <StyledShow onClick={handleShowMdp}>
                            <ShowImage
                                src={isShow ? eysClose : eysOpen}
                                alt="show button"
                            />
                        </StyledShow>
                    </MdpWshow>
                </MdpContainer>
                <StyledDelete
                    onClick={() => toDelete(categName as string, _id)}
                >
                    <IcoImg src={suprIco} alt="delete" />
                </StyledDelete>
            </CardDiv>
            {isCopied && <CopySucces>Copied to clipboard</CopySucces>}
        </>
    );
}
