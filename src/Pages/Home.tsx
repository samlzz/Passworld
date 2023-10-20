import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { LogoPW } from '../Utils/styles/globalStyle';
import { FolderOfTab } from '../Components/NavigationTab';
import { SearchBar } from '../Components/SearchBar';
import { PasswCard } from '../Components/PasswCard';
import { CreatePassw } from '../Components/Password';
import pp from '../assets/Icones/ProfilePic.png';
import logo from '../assets/logoPW/logoPassWorld.png';
import plusButt from '../assets/svgShape/plusButton.svg';
import defaultIco from '../assets/logoPW/defaultIcoDark.png';
import plus from '../assets/svgShape/+PlusIco.png';

import { APasswType, HomeProps } from '../Utils/type';
import { AddCategPopup } from '../Components/Material_Ui/PopUp';

// Début du style -------------->
const PageHome = styled.div`
    width: 100wh;
    height: 100vh;
    display: flex;
`;
const TabContainer = styled.div`
    background-color: ${({ theme }) => theme.darkBackground};
    height: 130vh;
    width: 23vw;
    z-index: 0;
    position: absolute;
    top: 0;
`;
const ProfilButton = styled.button`
    position: absolute;
    top: 3vh;
    right: 3vw;
    height: 6vh;
    width: 11vw;
    border-radius: 1vw;
    padding-right: 3vw;
    font-size: 1.2vw;
    color: ${({ theme }) => theme.white};
    background-color: ${({ theme }) => theme.primary};
    background-image: url(${pp});
    background-repeat: no-repeat;
    background-size: 25% 80%;
    background-position: 90% 50%;
`;

const CardContainer = styled.div`
    margin-top: 5vh;
    margin-left: 25vw;
    display: flex;
    flex-wrap: wrap;
`;
const AddPassw = styled.button`
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 0 6vw 5vw 0; //haut droite bas gauche
`;
const AddShape = styled.img`
    width: 6vw;
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
const AddCategButt = styled.button`
    display: flex;
    align-items: center;
    gap: 0.7vw;
    background: ${({ theme }) => theme.tercary};
    border-radius: 2vw;
    height: 2vw;
    padding-left: 1vw;
    margin-left: 12.7vw;
    font-size: 1.1vw;
`;
const AddCategImg = styled.img`
    width: 1.2vw;
`;
// Fin du style --------------//

// todo Value For test
const researchRes: APasswType[] = [];
const mdpExemples = [
    {
        categName: 'All Passwords',
        id: 0,
        titre: 'Youtube',
        siteAddress: 'www.Youtube.com',
        identifier: 'sliziard@icloud.com',
        icoLink: defaultIco,
        mdp: 'motdePasse',
    },
    {
        categName: 'All Passwords',
        id: 1,
        titre: 'Google',
        siteAddress: 'www.Google.com',
        identifier: 'sliziard@icloud.com',
        icoLink: defaultIco,
        mdp: 'motdePasse',
    },
    {
        categName: 'All Passwords',
        id: 2,
        titre: 'GitHub',
        siteAddress: 'www.GitHub.com',
        identifier: 'sliziard@icloud.com',
        icoLink: defaultIco,
        mdp: 'motdePasse',
    },
    {
        categName: 'All Passwords',
        id: 3,
        titre: 'Figma',
        siteAddress: 'www.Figma.com',
        identifier: 'sliziard@icloud.com',
        icoLink: defaultIco,
        mdp: 'motdePasse',
    },
];
const mdpDevExemples = [
    {
        categName: 'Devops',
        id: 2,
        titre: 'GitHub',
        siteAddress: 'www.GitHub.com',
        identifier: 'sliziard@icloud.com',
        icoLink: defaultIco,
        mdp: 'motdePasse',
    },
    {
        categName: 'Devops',
        id: 3,
        titre: 'Figma',
        siteAddress: 'www.Figma.com',
        identifier: 'sliziard@icloud.com',
        icoLink: defaultIco,
        mdp: 'motdePasse',
    },
];
const mdpLoisirsExemples = [
    {
        categName: 'Loisirs',
        id: 0,
        titre: 'Youtube',
        siteAddress: 'www.Youtube.com',
        identifier: 'sliziard@icloud.com',
        icoLink: defaultIco,
        mdp: 'motdePasse',
    },
    {
        categName: 'Loisirs',
        id: 1,
        titre: 'Google',
        siteAddress: 'www.Google.com',
        identifier: 'sliziard@icloud.com',
        icoLink: defaultIco,
        mdp: 'motdePasse',
    },
];
const categExemple = [
    researchRes,
    mdpExemples,
    mdpDevExemples,
    mdpLoisirsExemples,
];

// * Begin Functions ===========>
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
function renderOpFoldCard(
    folderOpen: string,
    folderList: Array<Array<APasswType>>,
    isSearch: boolean,
    setIsCopy: React.Dispatch<React.SetStateAction<boolean>>,
    setFolderList: React.Dispatch<React.SetStateAction<APasswType[][]>>
) {
    //* Check si le dossier ouvert fait partie des categ
    const nbCateg = folderList.length;
    let cardContent = <p />;
    if (isSearch) {
        cardContent = (
            <CardContainer>
                {folderList[0].map((passw) => (
                    <PasswCard
                        key={generateHexKey(8)}
                        aPassw={passw}
                        copyIsSucces={(isCopied) => setIsCopy(isCopied)}
                        listFolderList={folderList}
                    />
                ))}
            </CardContainer>
        );
    } else {
        for (let i = 0; i < nbCateg; i += 1) {
            if (i !== 0) {
                if (folderOpen === folderList[i][0]?.categName) {
                    cardContent = (
                        <CardContainer>
                            {folderList[i].map((passw) => (
                                <PasswCard
                                    key={generateHexKey(8)}
                                    aPassw={passw}
                                    copyIsSucces={(isCopied) =>
                                        setIsCopy(isCopied)
                                    }
                                    listFolderList={folderList}
                                    toDelete={(categOf, id, titre) =>
                                        setFolderList((prevState) => {
                                            const updatedState = [...prevState];

                                            prevState.forEach(
                                                (categ, index) => {
                                                    if (
                                                        categ[0]?.categName ===
                                                        categOf
                                                    ) {
                                                        const updatedCateg =
                                                            categ.filter(
                                                                (psw) =>
                                                                    !(
                                                                        psw.id ===
                                                                            id &&
                                                                        psw.titre ===
                                                                            titre
                                                                    )
                                                            );
                                                        updatedState[index] =
                                                            updatedCateg;
                                                    }
                                                }
                                            );

                                            return updatedState;
                                        })
                                    }
                                />
                            ))}
                        </CardContainer>
                    );
                }
            }
        }
    }
    return cardContent;
}
function getCategByName(categName: string, ArrayOfArray: Array<APasswType[]>) {
    for (let i = 0; i < ArrayOfArray.length; i += 1) {
        const categ = ArrayOfArray[i];
        if (i !== 0) {
            if (categ[0]?.categName === categName) {
                return ArrayOfArray[i];
            }
        }
    }
    return [];
}
function addPassw(
    newPssw: APasswType,
    categName: string,
    setFolderList: React.Dispatch<React.SetStateAction<APasswType[][]>>
) {
    setFolderList((prevState) => {
        return prevState.map((categ) => {
            if (categ[0]?.categName === categName) {
                let newId = categ.length;
                const passWid = {
                    ...newPssw,
                    id: (newId += 1),
                };
                return [...categ, passWid];
            }
            return categ;
        });
    });
}
const addNewCateg = (LatestCateg: string, arrOfArr: APasswType[][]) => {
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
    return arrOfArr;
};
// * End Functions ===========//

export function Home({ isRendered }: HomeProps) {
    const [listfolderList, setFolderList] = useState(categExemple);
    const [folderOpen, setFolderOpen] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isCopy, setIsCopy] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [isAddCateg, setIsAddCateg] = useState(false);
    const [plusAnchor, setPlusAnchor] = useState<HTMLElement | null>(null);

    useEffect(() => {
        isRendered(true);
    }, []);
    useEffect(() => {
        if (isCopy) {
            const timer = setTimeout(() => {
                setIsCopy(false);
            }, 1500); // 1.5 secondes
            return () => clearTimeout(timer);
        }
        return () => null;
    }, [isCopy]);
    useEffect(() => {
        const categSelect = getCategByName(folderOpen, listfolderList);
        if (!categSelect || categSelect.length === 0) {
            setFolderOpen('');
        }
    }, [listfolderList]);

    const handleIsAddCateg = () => {
        if (plusAnchor) {
            setIsAddCateg(!isAddCateg);
        }
    };
    return (
        <PageHome>
            <TabContainer>
                <LogoPW src={logo} alt="Logo of PassWorld" />
                <AddCategButt
                    type="button"
                    onClick={(e) => setPlusAnchor(e.currentTarget)}
                    onMouseDown={handleIsAddCateg}
                >
                    <p> Add Category </p>
                    <AddCategImg src={plus} alt="Add Category" />
                </AddCategButt>
                {isAddCateg ? (
                    <AddCategPopup
                        anchor={plusAnchor}
                        open={isAddCateg}
                        getNewCateg={(NouvCateg) =>
                            setFolderList(
                                addNewCateg(NouvCateg, listfolderList)
                            )
                        }
                        isPopup={(isValid) => setIsAddCateg(!isValid)}
                        forTab
                    />
                ) : (
                    <></>
                )}

                {listfolderList.map((categorie, i) =>
                    i !== 0 && categorie.length > 0 ? (
                        <FolderOfTab
                            key={generateHexKey(8)}
                            title={categorie[0]?.categName}
                            allPassw={categorie}
                            whoIsClick={(folderName) => {
                                setFolderOpen(folderName);
                            }}
                            IsSelect={folderOpen === categorie[0]?.categName}
                        />
                    ) : (
                        <></>
                    )
                )}
            </TabContainer>

            <ProfilButton>My account</ProfilButton>
            <SearchBar
                allPassw={getCategByName(folderOpen, listfolderList)} // todo
                openFolder={folderOpen}
                searchResult={(result, searchProceed) => {
                    if (searchProceed) {
                        setIsSearching(true);
                    } else {
                        setIsSearching(false);
                    }
                    setFolderList((prevArray) => {
                        const updatedArray = [...prevArray];
                        updatedArray[0] = result;
                        return updatedArray;
                    });
                }}
            />
            {renderOpFoldCard(
                folderOpen,
                listfolderList,
                isSearching,
                setIsCopy,
                setFolderList
            )}

            <AddPassw onClick={() => setIsCreate(true)}>
                <AddShape src={plusButt} alt="plus button" />
            </AddPassw>

            {isCopy ? <CopySucces>Copied to clipboard</CopySucces> : null}
            {isCreate ? (
                <CreatePassw
                    newPassw={(newPssw, categName) =>
                        addPassw(newPssw, categName, setFolderList)
                    }
                    closed={(toClose) => setIsCreate(!toClose)}
                    arrOfArr={listfolderList}
                />
            ) : null}
        </PageHome>
    );
}
