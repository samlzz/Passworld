import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import cross from '../assets/Icones/crossWhite.svg';
import check from '../assets/Icones/Valid.svg';
import ico from '../assets/logoPW/defaultIcoDark.png';
import eysClose from '../assets/Icones/PasswCard/oeuil_fermer.svg';
import eysOpen from '../assets/Icones/PasswCard/eye-solid (1).svg';

import {
    APasswType,
    ContainerProps,
    CreatePswProps,
    ShowPswProps,
} from '../Utils/type';
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
`;
const PasswDiv = styled.div(
    ({ theme }) => `
    background-color: ${theme.tercary};
    width: 38.4vw;
    height: 43vw;
    margin: -1vw 0 0 29.5vw;//haut droite bas gauche
    border-radius: 5vw;
    overflow: hidden;
    display: grid;
    position: absolute;
    top: 6vw;
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
    position: relative;
`;
const StyledShow = styled.button<ShowPswProps>(
    ({ $isEdit }) => `
    position: absolute;
    right: 14.7vw;
    bottom: ${$isEdit ? `5.6vw` : `6.3vw`};
`
);
const ShowImg = styled.img`
    width: 1.2vw;
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
const PageContainer = styled.div`
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
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
    isEdit,
}: CreatePswProps) {
    const [aPassword, setPassword] = useState<APasswType>(getInitPassw(aPassw));
    const [isHide, setIsHide] = useState(false);
    const [hidenMdpVal, setHidenMdpVal] = useState('');
    const [isCategMenu, setIsMenu] = useState(false);
    const [isValidCateg, setIsCategValid] = useState(false);
    const [isValided, setIsValided] = useState(false);
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const icoInputRef = useRef<HTMLInputElement | null>(null);

    const fetchIco = (siteLink: string) => {
        const withoutPref = siteLink.replace(/https?:\/\/(www\.)?/i, ''); // ? Supprimer le préfixe (http, https, www)
        const domain = withoutPref.split('/')[0]; // ? Extraire nom de domaine (jusqu'au premier "/")

        const icoLink = `https://logo.clearbit.com/${domain.toLowerCase()}?size=50*`;

        return axios
            .get(icoLink, {
                responseType: 'arraybuffer', // pour obtenir l'image sous forme de Blob
            })
            .then((response) => {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ''
                    )
                );
                return `data:image/png;base64,${base64}`;
            });
    };
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
    const handleGetLetter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword((prevState) => {
            if (e.target.value.length < prevState.mdp.length) {
                return {
                    ...prevState,
                    mdp: prevState.mdp.slice(0, -1),
                };
            }
            const lastLetter = e.target.value[e.target.value.length - 1];
            return {
                ...prevState,
                mdp: prevState.mdp + lastLetter,
            };
        });
        const hidenVal = '*'.repeat(e.target.value.length);
        setHidenMdpVal(hidenVal);
        console.log(aPassword.mdp);
    };
    const handleShowMdp = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword((prevState) => ({
            ...prevState,
            mdp: e.target.value,
        }));
        const hidenVal = '*'.repeat(e.target.value.length);
        setHidenMdpVal(hidenVal);
        console.log(aPassword.mdp);
    };
    const handleIsHide = () => {
        setIsHide((prev) => !prev);
        const hidenVal = '*'.repeat(aPassword.mdp.length);
        setHidenMdpVal(hidenVal);
    };
    const handleValid = () => {
        newPassw(aPassword, aPassword.categName);
        closed(true);
        setIsValided((prev) => !prev);
        console.log(aPassword.icoLink);
    };

    const { titre, siteAddress, identifier, mdp } = aPassword;

    useEffect(() => {
        fetchIco(siteAddress)
            .then((icoSrc) => {
                setPassword((prevState) => ({
                    ...prevState,
                    icoLink: icoSrc,
                }));
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de la récupération de l'image:",
                    error
                );
            });
    }, [isValided]);

    return (
        <PageContainer>
            <Backgrnd onClick={() => closed(true)} />
            <PasswDiv>
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
                        value={isHide ? hidenMdpVal : mdp}
                        onChange={isHide ? handleGetLetter : handleShowMdp}
                    />
                    <StyledShow onClick={handleIsHide} $isEdit={isEdit}>
                        <ShowImg src={isHide ? eysOpen : eysClose} alt="show" />
                    </StyledShow>
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
                <ValidButton onClick={handleValid}>
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
        </PageContainer>
    );
}
