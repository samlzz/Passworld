import styled from 'styled-components';
import { useDrag, useDrop } from 'react-dnd/dist/hooks';

import { useState } from 'react';
import clickedFleche from '../assets/svgShape/Polygon.svg';
import fleche from '../assets/svgShape/Polygon _.svg';
import del from '../assets/Icones/PasswCard/suppr.svg';

import {
    ElemProps,
    LitleLogoProps,
    ElemOfTabProps,
    FolderOfTabProps,
    FoldDivProps,
    Iitem,
    DropZonProps,
} from '../Utils/type';
import { useData } from '../Utils/contexte';

// Début du style -------------->
const FolderDiv = styled.div<FoldDivProps>`
    background-color: ${({ theme, $isClick }) =>
        $isClick ? theme.selected : theme.tercary};
    border-radius: 0.6vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 2.3vw;
    width: 100%;S
    ${({ $isAll }) => !$isAll && `margin-left: 0vw; width: 99%;`}
    margin-left: 0.3vw;
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
    margin-top: 0.2vh;
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
            : `background-color: ${props.theme.tercary};`}
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
    IsSelect,
    whoIsClick,
    isDeleted,
    categId,
}: FolderOfTabProps) {
    const { moveOfCateg, rmInCategNotAllPsw } = useData();
    const [isAllPsw] = useState<boolean>(title === 'All passwords');
    const [, dropRef] = useDrop(() => ({
        accept: 'PASSWCARD',
        drop: (item: Iitem) => {
            if (item.type === 'PASSWCARD') {
                if (categId) moveOfCateg(categId, item.id);
                else rmInCategNotAllPsw(item.id);
            }
        },
    }));
    const [, dragRef] = useDrag(() => ({
        type: 'Category',
        item: { id: categId, type: 'Category' },
    }));
    return (
        <div>
            <FolderDiv $isClick={IsSelect} ref={dropRef} $isAll={isAllPsw}>
                <ElemPassw
                    ref={isAllPsw ? undefined : dragRef}
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
                {typeof isDeleted === 'function' && (
                    <StyledDelete
                        onClick={() => isDeleted()}
                        $isClick={IsSelect}
                    >
                        <StyledIco src={del} alt="delete" />
                    </StyledDelete>
                )}
            </FolderDiv>
            {IsSelect && <div style={{ height: '0.5vw' }} />}
            {IsSelect &&
                allPassw.map((mdp, i) => (
                    <ElemOfTab key={`${mdp._id}--${i}`} aPassw={mdp} />
                ))}
        </div>
    );
}

const ForDrop = styled.div`
    height: 0.8vw;
    width: 100%;
`;

export function DropZone({ index }: DropZonProps) {
    const { moveACateg } = useData();
    const [, dropRef] = useDrop(() => ({
        accept: 'Category',
        drop: (item: Iitem) => {
            if (item.type === 'Category') moveACateg(item.id, index);
        },
    }));
    return <ForDrop ref={dropRef} />;
}
