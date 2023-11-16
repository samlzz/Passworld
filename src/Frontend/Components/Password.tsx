import styled from 'styled-components';
import { useRef, useState } from 'react';

import { Types } from 'mongoose';
import cross from '../assets/Icones/crossWhite.svg';
import check from '../assets/Icones/Valid.svg';
import ico from '../assets/logoPW/defaultIcoDark.png';
import eysClose from '../assets/Icones/PasswCard/oeuil_fermer.svg';
import eysOpen from '../assets/Icones/PasswCard/eye-solid (1).svg';

import { IPassw, ContainerProps, CreatePswProps, ICateg } from '../Utils/type';
import SelectBox from './Material_Ui/SelectBox';
import { AddCategPopup, GenerPopup } from './Material_Ui/PopUp';
import { useData } from '../Utils/contexte';

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
const StyledShow = styled.button(
    ({ theme }) => `
    position: absolute;
    right: 14.1vw;
    padding: 0 0.6vw 0 -0.1vw;
    bottom: 6.3vw;
    background: ${theme.selected};
    box-shadow: -10px 0 6px -2px ${theme.selected};
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

function getInitPassw(passw?: IPassw): IPassw {
    if (passw && passw.titre) {
        return passw;
    }
    return {
        _id: new Types.ObjectId().toString(),
        categName: undefined,
        titre: '',
        siteAddress: '',
        identifier: '',
        mdp: '',
        icoLink: ico,
    };
}

export function CreatePassw({ newPassw, closed, aPassw }: CreatePswProps) {
    const [aPassword, setPassword] = useState<IPassw>(getInitPassw(aPassw));
    const [isHide, setIsHide] = useState(false);
    const [hidenMdpVal, setHidenMdpVal] = useState('');
    const [isCategMenu, setIsMenu] = useState(false);
    const [isValidCateg, setIsCategValid] = useState(false);
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const icoInputRef = useRef<HTMLInputElement | null>(null);
    const validRef = useRef<HTMLButtonElement | null>(null);
    const { addNewCateg, pswByCateg } = useData();

    function makeCategArr(
        listfolderList: ICateg[],
        withAllPsw: boolean = false
    ): Array<string> {
        const filteredCateg = listfolderList.filter(
            (categ, i) => i !== 0 && categ.passwords.length >= 0
        );

        const categList = filteredCateg.map((categ) => categ.name);

        if (withAllPsw) {
            categList.unshift('All passwords');
        }
        return categList;
    }

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
    };
    const handleShowMdp = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword((prevState) => ({
            ...prevState,
            mdp: e.target.value,
        }));
        const hidenVal = '*'.repeat(e.target.value.length);
        setHidenMdpVal(hidenVal);
    };
    const handleIsHide = () => {
        setIsHide((prev) => !prev);
        const hidenVal = '*'.repeat(aPassword.mdp.length);
        setHidenMdpVal(hidenVal);
    };
    const handleValid = () => {
        let isNull;
        // eslint-disable-next-line no-restricted-syntax
        for (const valus of Object.values(aPassword)) {
            if (valus === '') isNull = true;
        }
        if (isNull) {
            return;
        }
        newPassw(aPassword);
        closed(true);
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (validRef.current) {
                validRef.current.click();
            }
        }
    };

    const { titre, siteAddress, identifier, mdp, categName } = aPassword;

    // const fetchIco = (siteLink: string) => {
    //     const withoutPref = siteLink.replace(/https?:\/\/(www\.)?/i, ''); // ? Supprimer le préfixe (http, https, www)
    //     const domain = withoutPref.split('/')[0]; // ? Extraire nom de domaine (jusqu'au premier "/")

    //     const icoLink = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.${domain.toLowerCase()}&size=50`;

    //     return axios
    //         .get(icoLink, {
    //             responseType: 'arraybuffer', // pour obtenir l'image sous forme de Blob
    //             withCredentials: false,
    //         })
    //         .then((response) => {
    //             const base64 = btoa(
    //                 new Uint8Array(response.data).reduce(
    //                     (data, byte) => data + String.fromCharCode(byte),
    //                     ''
    //                 )
    //             );
    //             return `data:image/png;base64,${base64}`;
    //         });
    // };

    // useEffect(() => {
    //     fetchIco(siteAddress)
    //         .then((icoSrc) => {
    //             setPassword((prevState) => ({
    //                 ...prevState,
    //                 icoLink: icoSrc,
    //             }));
    //         })
    //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //         .catch((_error) => {
    //             console.error("Erreur lors de la récupération de l'image:");
    //         });
    // }, [isValided]);

    return (
        <PageContainer onKeyDown={handleKeyDown}>
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
                        categArray={makeCategArr(pswByCateg, true)}
                        returnCateg={(categChoosen) =>
                            setPassword((prevState) => ({
                                ...prevState,
                                categName: categChoosen,
                            }))
                        }
                        isCategMenu={(resp) => setIsMenu(resp)}
                        getAnchor={(anch) => setAnchor(anch)}
                        isCategPopup={isValidCateg}
                        defaultCateg={categName}
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
                    <StyledShow onClick={handleIsHide}>
                        <ShowImg src={isHide ? eysOpen : eysClose} alt="show" />
                    </StyledShow>
                    <GenerPopup
                        valuHash={(hash) =>
                            setPassword((prevState) => ({
                                ...prevState,
                                mdp: hash,
                            }))
                        }
                    />
                </MdpContainer>
                <ValidButton onClick={handleValid} ref={validRef}>
                    <ValidImg src={check} alt="valid" />
                </ValidButton>
            </PasswDiv>
            {isCategMenu ? (
                <AddCategPopup
                    anchor={anchor}
                    open={isCategMenu}
                    isPopup={(resp) => setIsCategValid(resp)}
                    getNewCateg={(NouvCateg) =>
                        addNewCateg(NouvCateg, makeCategArr(pswByCateg))
                    }
                />
            ) : (
                <></>
            )}
        </PageContainer>
    );
}
