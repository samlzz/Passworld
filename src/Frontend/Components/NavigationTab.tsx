import styled from 'styled-components';
import clickedFleche from '../assets/svgShape/Polygon.svg';
import fleche from '../assets/svgShape/Polygon _.svg';
import del from '../assets/Icones/PasswCard/suppr.svg';

import {
    ElemProps,
    LitleLogoProps,
    ElemOfTabProps,
    FolderOfTabProps,
    FoldDivProps,
} from '../Utils/type';

// Début du style -------------->
const FolderDiv = styled.div<FoldDivProps>`
    background-color: ${({ theme, $isClick }) =>
        $isClick ? theme.selected : theme.tercary};
    border-radius: 1.5vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4.5vh;
    margin-bottom: 1.5vh;
    margin-top: 2vh;
    width: 100%;
`;
const ElemPassw = styled.button<ElemProps>`
    //? cancel buttun style
    border: none;
    width: 95%;
    //?
    border-radius: 1.5vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 1vh;
    margin-left: 1vw;
    height: 4vh;
    ${(props) =>
        props.$isFolder
            ? `margin-left: 0vw;
        height: 4.5vh;
        margin-bottom: 1.5vh;
        margin-top: 2vh;
        width: 100%;
        position: relative;
        `
            : `    background-color: ${props.theme.tercary};`}
`;
const LitleLogo = styled.img<LitleLogoProps>`
    margin-left: 1vw;
    ${(props) =>
        props.$isFlech
            ? ` 
                height: 30%;
                margin-left: 1.5vw;
                margin-top: 0.5vh;`
            : ` width: 7%;
                height: 67%;
                margin-right: 0.6vw;`}
`;
const FolderName = styled.p`
    margin-left: 1vw;
`;
const StyledDelete = styled.button<{ $isClick?: boolean }>(
    (props) => `
    background-color: none;
    position: absolute;
    right: 0.2vw;
    margin-top: 0.2vw;
    ${props.$isClick ? `opacity: 1;` : `opacity: 0.4;`}
    z-index: 2;
`
);
const StyledIco = styled.img`
    width: 1.7vw;
`;
// Fin du style --------------//

export function ElemOfTab({ aPassw }: ElemOfTabProps) {
    return (
        <ElemPassw>
            <LitleLogo src={aPassw.icoLink} />
            <p> {aPassw.titre} </p>
        </ElemPassw>
    );
}

export function FolderOfTab({
    title,
    allPassw,
    whoIsClick,
    IsSelect,
    isDeleted,
}: FolderOfTabProps) {
    function generateHexKey(nbChar: number) {
        const history = [];
        let hexKey = '';
        const characters = '0123456789abcdef';
        const charactersLength = characters.length;

        for (let i = 0; i < nbChar; i += 1) {
            hexKey += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        history.push(hexKey);
        return hexKey;
    }

    return (
        <>
            <FolderDiv $isClick={IsSelect}>
                <ElemPassw
                    onMouseDown={() => {
                        if (IsSelect) {
                            whoIsClick('');
                        } else {
                            whoIsClick(title);
                        }
                    }}
                    $isFolder
                    $isClick={IsSelect}
                >
                    <LitleLogo
                        src={IsSelect ? clickedFleche : fleche}
                        $isFlech
                    />
                    <FolderName> {title} </FolderName>
                </ElemPassw>
                <StyledDelete onClick={() => isDeleted()} $isClick={IsSelect}>
                    <StyledIco src={del} alt="delete" />
                </StyledDelete>
            </FolderDiv>
            {IsSelect &&
                allPassw.map((mdp) => (
                    <ElemOfTab key={generateHexKey(8)} aPassw={mdp} />
                ))}
        </>
    );
}
