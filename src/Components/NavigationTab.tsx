import styled from 'styled-components';
import clickedFleche from '../assets/Polygon.svg';
import fleche from '../assets/Polygon _.svg';

interface LitleLogoProps {
    $isFlech?: boolean;
}
interface ElemProps {
    $isFolder?: boolean;
    $isClick?: boolean;
}
// Début du style -------------->
const ElemPassw = styled.button<ElemProps>`
    //? cancel buttun style
    border: none;
    width: 95%;
    //?
    background-color: ${({ theme, $isClick }) =>
        $isClick ? theme.selected : theme.tercary};
    border-radius: 1.5vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5%;
    margin-top: 1vh;
    margin-left: 1vw;
    height: 4vh;
    ${(props) =>
        props.$isFolder &&
        `margin-left: 0vw;
        height: 4.5vh;
        margin-bottom: 1.5vh;
        gap: 0%;
        margin-top: 2vh;
        width: 100%;
        `}
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
                height: 67%;`}
`;
const FolderName = styled.p`
    margin-left: 1vw;
`;
// Fin du style --------------//
interface APasswType {
    categName: string;
    id: number;
    site: string;
    ico: string;
    mdp?: string;
    userID?: string;
}
interface ElemOfTabProps {
    aPassw: APasswType;
}

export function ElemOfTab({ aPassw }: ElemOfTabProps) {
    return (
        <ElemPassw>
            <LitleLogo src={aPassw.ico} />
            <p> {aPassw.site} </p>
        </ElemPassw>
    );
}

interface FolderOfTabProps {
    title: string;
    allPassw: Array<APasswType>;
    whoIsClick: (isIt: string) => void;
    IsSelect: boolean;
}

export function FolderOfTab({
    title,
    allPassw,
    whoIsClick,
    IsSelect,
}: FolderOfTabProps) {
    // const [isClicked, setIsClicked] = useState(false);
    return (
        <>
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
                <LitleLogo src={IsSelect ? clickedFleche : fleche} $isFlech />
                <FolderName> {title} </FolderName>
            </ElemPassw>
            {IsSelect &&
                allPassw.map((mdp) => <ElemOfTab key={mdp.id} aPassw={mdp} />)}
        </>
    );
}
