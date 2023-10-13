import styled from 'styled-components';

import cross from '../assets/Icones/crossWhite.svg';
import check from '../assets/Icones/Valid.svg';
import ico from '../assets/logoPW/SubmitLogo.png';

import { APasswType, ContainerProps, CreatePswProps } from '../Utils/type';
import SelectBox from './Material_Ui';

// Début du style -------------->
const Backgrnd = styled.button`
    width: 100%;
    height: 130vh;
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${({ theme }) => theme.darkBackground};
    opacity: 0.8;
`;
const PasswDiv = styled.div`
    background-color: ${({ theme }) => theme.tercary};
    width: 38.4vw;
    height: 43vw;
    margin: -8vw 0 0 29.5vw; //haut droite bas gauche
    border-radius: 5vw;
    overflow: hidden;
    display: grid;
    position: absolute;
`;
const CrossButton = styled.button`
    width: 5vw;
    margin: 1vw 0 0 2.5vw; //haut droite bas gauche
`;
const CrossImg = styled.img`
    width: 3vw;
    opacity: 0.8;
`;
const StyledLogo = styled.button`
    justify-self: center;
    align-self: start;
    margin-top: -5vw;
`;
const IcoImg = styled.img`
    width: 12vw;
`;
const NameAndCateg = styled.div`
    display: flex;
    flex-direction: row;
`;
const StyledTitle = styled.input`
    justify-self: start;
    margin: -2vw 0 2vw 3.2vw; //haut droite bas gauche
    height: 4vw;
    width: 16vw;
    border-radius: 0.8vw;
    background-color: ${({ theme }) => theme.darkTercary};
    padding-left: 1vw;
    font-size: 2vw;
    &::placeholder {
        opacity: 0.6;
    }
`;
const StyledContainer = styled.input<ContainerProps>`
    display: flex;
    align-items: start;
    background-color: ${({ theme }) => theme.selected};
    border-radius: 0.8vw;
    height: 3vw;
    width: ${(props) => (props.$link ? `20vw` : `18vw`)};
    margin: ${(props) => (props.$link ? `-4.4vw 0 0 3.2vw` : `-4vw 0 0 5.2vw`)};
    padding-left: 1vw;
    &::placeholder {
        opacity: 0.6;
    }
    font-size: 1.1vw;
`;
const MdpContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1vw;
`;
const StyledGenerate = styled.button`
    background-color: ${({ theme }) => theme.selected};
    border-radius: 0.9vw;
    height: 2.7vw;
    padding-left: 0.5vw;
    font-size: 1.1vw;
    margin-top: -3.7vw;
`;
const ValidButton = styled.button`
    position: absolute;
    bottom: 1.8vw;
    right: 2vw;
`;
const ValidImg = styled.img`
    width: 4vw;
`;
// Fin du style --------------//

export function CreatePassw({ closed, arrOfArr }: CreatePswProps) {
    // function makePassw(id, titre, ico) {}
    function makeCategArr(listfolderList: Array<APasswType[]>) {
        const CategArr: Array<string> = [];
        listfolderList.forEach((categ, i) => {
            if (i !== 0 && i !== 1) {
                CategArr.push(categ[i].categName);
            }
        });
        return CategArr;
    }
    return (
        <>
            <Backgrnd onClick={() => closed(true)} />
            <PasswDiv>
                <CrossButton onClick={() => closed(true)}>
                    <CrossImg src={cross} alt="cross" />
                </CrossButton>
                <StyledLogo>
                    <IcoImg src={ico} alt="Icon" />
                </StyledLogo>
                <NameAndCateg>
                    <StyledTitle placeholder="Set name..." />
                    <SelectBox categArray={} />
                </NameAndCateg>
                <StyledContainer $link placeholder="Set site adress..." />
                <StyledContainer $id placeholder="Enter identifier..." />
                <MdpContainer>
                    <StyledContainer placeholder="Enter password..." />
                    <StyledGenerate> generate </StyledGenerate>
                </MdpContainer>
                <ValidButton>
                    <ValidImg src={check} alt="valid" />
                </ValidButton>
            </PasswDiv>
        </>
    );
}
