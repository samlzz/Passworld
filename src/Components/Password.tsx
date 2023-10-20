import styled from 'styled-components';
import { useRef, useState } from 'react';

import cross from '../assets/Icones/crossWhite.svg';
import check from '../assets/Icones/Valid.svg';
import ico from '../assets/logoPW/defaultIcoDark.png';

import { APasswType, ContainerProps, CreatePswProps } from '../Utils/type';
import SelectBox from './Material_Ui/SelectBox';
import { AddCategPopup, GenerPopup } from './Material_Ui/PopUp';

// Début du style -------------->
const Backgrnd = styled.button`
    width: 100%;
    height: 130vh;
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${({ theme }) => theme.darkBackground};
    opacity: 0.8;
    cursor: default;
    z-index: 1;
`;
const PasswDiv = styled.div<{ $edit?: boolean }>(
    ({ theme, $edit }) => `
    background-color: ${theme.tercary};
    width: 38.4vw;
    height: 43vw;
    ${
        $edit ? `margin: -13vw 0 0 2.5vw;` : ` margin: -10vw 0 0 29.5vw;`
    }  //haut droite bas gauche
    border-radius: 5vw;
    overflow: hidden;
    display: grid;
    position: absolute;
    z-index: 1;
`
);
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
    width: 13.8vw;
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
    background: ${({ theme }) => theme.selected};
    border-radius: 0.8vw;
    height: 3vw;
    width: ${(props) => (props.$link ? `20vw` : `18vw`)};
    margin: ${(props) => (props.$link ? `-4.1vw 0 0 3.2vw` : `-4vw 0 0 5.2vw`)};
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
const ValidButton = styled.button`
    position: absolute;
    bottom: 1.8vw;
    right: 2vw;
`;
const ValidImg = styled.img`
    width: 4vw;
`;
const HiddenInput = styled.input`
    display: none;
`;
// Fin du style --------------//
function generateMdp(nbChar: number) {
    const history = [];
    let hexKey = '';
    const characters = '0123456789abcdefghijklmnopqrstuvwxyz#&@/:!?%*£${}';
    const charactersLength = characters.length;

    for (let i = 0; i < nbChar; i += 1) {
        hexKey += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    history.push(hexKey);
    return hexKey;
}

function getInitPassw(passw?: APasswType): APasswType {
    if (passw && passw.titre) {
        return passw;
    }
    return {
        categName: '',
        id: 0,
        titre: '',
        siteAddress: '',
        identifier: '',
        mdp: '',
        icoLink: './src/assets/logoPW/defaultIcoDark.png',
    };
}
export function CreatePassw({
    newPassw,
    closed,
    arrOfArr,
    aPassw,
    isEdit = false,
}: CreatePswProps) {
    const [aPassword, setPassword] = useState<APasswType>(getInitPassw(aPassw));
    const [isCategMenu, setIsMenu] = useState(false);
    const [isValidCateg, setIsCategValid] = useState(false);
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const icoInputRef = useRef<HTMLInputElement | null>(null);

    function makeCategArr(listfolderList: Array<APasswType[]>) {
        const CategArr: Array<string> = [];
        listfolderList.forEach((categ, i) => {
            if (i !== 0 && categ.length > 0) {
                CategArr.push(categ[0].categName);
            }
        });
        return CategArr;
    }
    const addNewCateg = (LatestCateg: string) => {
        const nexCateg = [
            {
                categName: LatestCateg,
                id: 0,
                titre: 'Test',
                siteAddress: 'www.test/unpeuplus/long.com',
                identifier: 'moyentest@icloud.com',
                icoLink: './src/assets/logoPW/SubmitLogo.png',
                mdp: 'motDePasseDeTest',
            },
        ];
        arrOfArr.push(nexCateg);
    };
    const setIcoByUser = () => {
        if (icoInputRef.current) {
            icoInputRef.current.click();
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();

            reader.onload = (event) => {
                setPassword((prevPass) => ({
                    ...prevPass,
                    icoLink: event.target?.result as string,
                }));
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const { titre, siteAddress, identifier, mdp, categName } = aPassword;
    return (
        <>
            <Backgrnd onClick={() => closed(true)} />
            <PasswDiv $edit={isEdit}>
                <CrossButton onClick={() => closed(true)}>
                    <CrossImg src={cross} alt="cross" />
                </CrossButton>
                <StyledLogo onClick={setIcoByUser}>
                    <IcoImg
                        src={aPassword.icoLink === '' ? ico : aPassword.icoLink}
                        alt="Icon"
                    />
                </StyledLogo>
                <HiddenInput
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    ref={icoInputRef}
                    onChange={handleFileChange}
                />
                <NameAndCateg>
                    <StyledTitle
                        placeholder="Set name..."
                        value={titre}
                        onChange={(e) =>
                            setPassword((prevState) => ({
                                ...prevState,
                                titre: e.target.value,
                            }))
                        }
                    />
                    <SelectBox
                        categArray={makeCategArr(arrOfArr)}
                        returnCateg={(categChoosen) =>
                            setPassword((prevState) => ({
                                ...prevState,
                                categName: categChoosen,
                            }))
                        }
                        isCategMenu={(resp) => setIsMenu(resp)}
                        getAnchor={(anch) => setAnchor(anch)}
                        isCategPopup={isValidCateg}
                    />
                </NameAndCateg>
                <StyledContainer
                    $link
                    placeholder="Set site adress..."
                    value={siteAddress}
                    onChange={(e) =>
                        setPassword((prevState) => ({
                            ...prevState,
                            siteAddress: e.target.value,
                        }))
                    }
                />
                <StyledContainer
                    $id
                    placeholder="Enter identifier..."
                    value={identifier}
                    onChange={(e) =>
                        setPassword((prevState) => ({
                            ...prevState,
                            identifier: e.target.value,
                        }))
                    }
                />
                <MdpContainer>
                    <StyledContainer
                        placeholder="Enter password..."
                        value={mdp}
                        onChange={(e) =>
                            setPassword((prevState) => ({
                                ...prevState,
                                mdp: e.target.value,
                            }))
                        }
                    />
                    <GenerPopup
                        valuStrong={(val: number) => {
                            const hash = generateMdp(val);
                            setPassword((prevState) => ({
                                ...prevState,
                                mdp: hash,
                            }));
                        }}
                    />
                </MdpContainer>
                <ValidButton
                    onClick={() => {
                        newPassw(aPassword, categName);
                        closed(true);
                    }}
                >
                    <ValidImg src={check} alt="valid" />
                </ValidButton>
            </PasswDiv>
            {isCategMenu ? (
                <AddCategPopup
                    anchor={anchor}
                    open={isCategMenu}
                    isPopup={(resp) => setIsCategValid(resp)}
                    getNewCateg={(NouvCateg) => addNewCateg(NouvCateg)}
                />
            ) : (
                <></>
            )}
        </>
    );
}

// export function EditPassw({ closed, passw, arrOfArr }: EditPswProps) {
//     const [aPassword, setPassword] = useState<APasswType>(passw);
//     const [isCategMenu, setIsMenu] = useState(false);
//     const [isValidCateg, setIsCategValid] = useState(false);
//     const [anchor, setAnchor] = useState<HTMLElement | null>(null);
//     const icoInputRef = useRef<HTMLInputElement | null>(null);

//     function makeCategArr(listfolderList: Array<APasswType[]>) {
//         const CategArr: Array<string> = [];
//         listfolderList.forEach((categ, i) => {
//             if (i !== 0 && categ.length > 0) {
//                 CategArr.push(categ[0].categName);
//             }
//         });
//         return CategArr;
//     }
//     const setIcoByUser = () => {
//         if (icoInputRef.current) {
//             icoInputRef.current.click();
//         }
//     };
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             const reader = new FileReader();

//             reader.onload = (event) => {
//                 setPassword((prevPass) => ({
//                     ...prevPass,
//                     icoLink: event.target?.result as string,
//                 }));
//             };

//             reader.readAsDataURL(e.target.files[0]);
//         }
//     };

//     const { titre, siteAddress, identifier, mdp } = aPassword;
//     return (
//         <>
//             <Backgrnd onClick={() => closed(true)} />
//             <PasswDiv>
//                 <CrossButton onClick={() => closed(true)}>
//                     <CrossImg src={cross} alt="cross" />
//                 </CrossButton>
//                 <StyledLogo onClick={setIcoByUser}>
//                     <IcoImg
//                         src={aPassword.icoLink === '' ? ico : aPassword.icoLink}
//                         alt="Icon"
//                     />
//                 </StyledLogo>
//                 <HiddenInput
//                     type="file"
//                     accept=".png, .jpg, .jpeg"
//                     ref={icoInputRef}
//                     onChange={handleFileChange}
//                 />
//                 <NameAndCateg>
//                     <StyledTitle
//                         value={titre}
//                         onChange={(e) =>
//                             setPassword((prevState) => ({
//                                 ...prevState,
//                                 titre: e.target.value,
//                             }))
//                         }
//                     />
//                     <SelectBox
//                         categArray={makeCategArr(arrOfArr)}
//                         returnCateg={(categChoosen) =>
//                             setPassword((prevState) => ({
//                                 ...prevState,
//                                 categName: categChoosen,
//                             }))
//                         }
//                         isCategMenu={(resp) => setIsMenu(resp)}
//                         getAnchor={(anch) => setAnchor(anch)}
//                         isCategPopup={isValidCateg}
//                     />
//                 </NameAndCateg>
//                 <StyledContainer
//                     $link
//                     placeholder="Set site adress..."
//                     value={siteAddress}
//                     onChange={(e) =>
//                         setPassword((prevState) => ({
//                             ...prevState,
//                             siteAddress: e.target.value,
//                         }))
//                     }
//                 />
//                 <StyledContainer
//                     $id
//                     placeholder="Enter identifier..."
//                     value={identifier}
//                     onChange={(e) =>
//                         setPassword((prevState) => ({
//                             ...prevState,
//                             identifier: e.target.value,
//                         }))
//                     }
//                 />
//                 <MdpContainer>
//                     <StyledContainer
//                         placeholder="Enter password..."
//                         value={mdp}
//                         onChange={(e) =>
//                             setPassword((prevState) => ({
//                                 ...prevState,
//                                 mdp: e.target.value,
//                             }))
//                         }
//                     />
//                     <GenerPopup
//                         valuStrong={(val: number) => {
//                             const hash = generateMdp(val);
//                             setPassword((prevState) => ({
//                                 ...prevState,
//                                 mdp: hash,
//                             }));
//                         }}
//                     />
//                 </MdpContainer>
//                 <ValidButton
//                     onClick={() => {
//                         closed(true);
//                     }}
//                 >
//                     <ValidImg src={check} alt="valid" />
//                 </ValidButton>
//             </PasswDiv>
//         </>
//     );
// }
