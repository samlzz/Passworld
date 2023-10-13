import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { LogoPW } from '../Utils/styles/globalStyle';
import { FolderOfTab } from '../Components/NavigationTab';
import { SearchBar } from '../Components/SearchBar';
import { PasswCard } from '../Components/PasswCard';
import { CreatePassw } from '../Components/Password';
import pp from '../assets/Icones/ProfilePic.png';
import logo from '../assets/logoPW/logoPassWorld.png';
import plus from '../assets/svgShape/plusButton.svg';

import { APasswType, HomeProps } from '../Utils/type';

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
// Fin du style --------------//

// todo Value For test
const researchRes: APasswType[] = [];
const mdpExemples = [
    {
        categName: 'All passwords',
        id: 0,
        titre: 'Youtube',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'nliziard@icloud.com',
    },
    {
        categName: 'All passwords',
        id: 1,
        titre: 'Google',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
    },
    {
        categName: 'All passwords',
        id: 2,
        titre: 'GitHub',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
    },
    {
        categName: 'All passwords',
        id: 3,
        titre: 'Figma',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
    },
];
const mdpDevExemples = [
    {
        categName: 'Devops',
        id: 2,
        titre: 'GitHub',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
    },
    {
        categName: 'Devops',
        id: 3,
        titre: 'Figma',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
    },
];
const mdpLoisirsExemples = [
    {
        categName: 'Loisirs',
        id: 0,
        titre: 'Youtube',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
    },
    {
        categName: 'Loisirs',
        id: 1,
        titre: 'Google',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
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
    setIsCopy: React.Dispatch<React.SetStateAction<boolean>>
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
            if (categ[0].categName === categName) {
                return ArrayOfArray[i];
            }
        }
    }
    return [];
}
// * End Functions ===========//

export function Home({ isRendered }: HomeProps) {
    const [listfolderList, setFolderList] = useState(categExemple);
    const [folderOpen, setFolderOpen] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isCopy, setIsCopy] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
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
    return (
        <PageHome>
            <TabContainer>
                <LogoPW src={logo} alt="Logo of PassWorld" />
                {listfolderList.map((categorie, i) =>
                    i !== 0 ? (
                        <FolderOfTab
                            key={generateHexKey(8)}
                            title={categorie[0]?.categName}
                            allPassw={categorie}
                            whoIsClick={(folderName) =>
                                setFolderOpen(folderName)
                            }
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
                setIsCopy
            )}
            <AddPassw onClick={() => setIsCreate(true)}>
                <AddShape src={plus} alt="plus button" />
            </AddPassw>
            {isCopy ? <CopySucces>Copied to clipboard</CopySucces> : null}
            {isCreate ? (
                <CreatePassw
                    closed={(toClose) => setIsCreate(!toClose)}
                    arrOfArr={listfolderList}
                />
            ) : null}
        </PageHome>
    );
}
