import styled from 'styled-components';

import eysClose from '../assets/Icones/PasswCard/oeuil_fermer.svg';
import suprIco from '../assets/Icones/PasswCard/suppr.svg';
import editIco from '../assets/Icones/PasswCard/edit.svg';

// Début du style -------------->
const CardDiv = styled.div`
    background-color: ${({ theme }) => theme.tercary};
    display: grid;
    height: 33vh;
    width: 16vw;
    border-radius: 2vw;
    margin-left: 4vw;
    overflow: hidden;
`;
const StyledEdit = styled.button`
    justify-self: end;
    align-self: start;
    margin: 1vh 0.6vw 0 0; //haut droite bas gauche
`;
const StyledLogo = styled.button`
    justify-self: center;
    margin-top: -2vh;
`;
const LogoImg = styled.img`
    width: 6vw;
`;
const IcoImg = styled.img`
    width: 2.2vw;
`;
const StyledTitle = styled.button`
    justify-self: start;
    margin: 1vh 0 0 0.8vw; //haut droite bas gauche
    font-size: 1.4vw;
`;
const MdpContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: 1vh 0 0 2vw; //haut droite bas gauche
    gap: 0.3vw;
`;
const MdpWshow = styled.div`
    display: flex;
    flex-direction: row;
    background-color: ${({ theme }) => theme.selected};
    border-radius: 20vw;
    height: 3.2vh;
    align-items: center;
    padding-left: 0.8vw;
`;
const StyledMdp = styled.button`
    font-size: 1.3vw;
`;
const StyledShow = styled.button``;
const StyledGenerate = styled.button`
    background-color: ${({ theme }) => theme.selected};
    border-radius: 20vw;
    height: 3vh;
    align-items: center;
    padding-left: 0.5vw;
    font-size: 0.6vw;
`;
const StyledDelete = styled.button`
    justify-self: end;
    align-self: end;
    background-color: ${({ theme }) => theme.tercary};
    margin: 0 0.5vw 1.2vh 0; //haut droite bas gauche
`;
// Fin du style --------------//

interface APasswType {
    categName: string;
    id: number;
    site: string;
    img: string;
}
interface PasswCardProps {
    aPassw: APasswType;
}
export function PasswCard({ aPassw }: PasswCardProps) {
    const { site, img } = aPassw;
    return (
        <CardDiv>
            <StyledEdit>
                <IcoImg src={editIco} alt="edit" />
            </StyledEdit>
            <StyledLogo>
                <LogoImg src={img} alt={`Icon of ${site}`} />
            </StyledLogo>
            <StyledTitle> {site} </StyledTitle>
            <MdpContainer>
                <MdpWshow>
                    <StyledMdp> ******* </StyledMdp>
                    <StyledShow>
                        <img src={eysClose} alt="show button" />
                    </StyledShow>
                </MdpWshow>
                <StyledGenerate> generate </StyledGenerate>
            </MdpContainer>
            <StyledDelete>
                <IcoImg src={suprIco} alt="delete" />
            </StyledDelete>
        </CardDiv>
    );
}
