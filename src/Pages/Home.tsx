import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { FolderOfTab } from '../Components/NavigationTab';
import pp from '../assets/ProfilePic.png';
import { PasswCard } from '../Components/PasswCard';
import logo from '../assets/logoPW/logoPassWorld.png';
import { LogoPW } from '../Utils/styles/globalStyle';
import { SearchBar } from '../Components/SearchBar';

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
// Fin du style --------------//

const researchRes: APasswType[] = [];
const mdpExemples = [
    {
        categName: 'All passwords',
        id: 0,
        site: 'Youtube',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'nliziard@icloud.com',
    },
    {
        categName: 'All passwords',
        id: 1,
        site: 'Google',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
    },
    {
        categName: 'All passwords',
        id: 2,
        site: 'GitHub',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
    },
    {
        categName: 'All passwords',
        id: 3,
        site: 'Figma',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
    },
];
const mdpDevExemples = [
    {
        categName: 'Devops',
        id: 2,
        site: 'GitHub',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
    },
    {
        categName: 'Devops',
        id: 3,
        site: 'Figma',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
    },
];
const mdpLoisirsExemples = [
    {
        categName: 'Loisirs',
        id: 0,
        site: 'Youtube',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
    },
    {
        categName: 'Loisirs',
        id: 1,
        site: 'Google',
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
    isSearch: boolean
) {
    //* Check si le dossier ouvert fait partie des categ
    const nbCateg = folderList.length;
    let cardContent = <p />;
    if (isSearch) {
        cardContent = (
            <CardContainer>
                {folderList[0].map((passw) => (
                    <PasswCard key={generateHexKey(8)} aPassw={passw} />
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

export function Home({ isRendered }: HomeProps) {
    const [isSearching, setIsSearching] = useState(false);
    const [folderOpen, setFolderOpen] = useState('');
    const [listfolderList, setFolderList] = useState(categExemple);
    useEffect(() => {
        isRendered(true);
    }, []);
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
            {renderOpFoldCard(folderOpen, listfolderList, isSearching)}
        </PageHome>
    );
}
