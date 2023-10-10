import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { FolderOfTab } from '../Components/NavigationTab';
import pp from '../assets/ProfilePic.png';
import searchIco from '../assets/Search.svg';
import { PasswCard } from '../Components/PasswCard';
import logo from '../assets/logoPW/logoPassWorld.png';
import { LogoPW } from '../Utils/styles/globalStyle';

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
const SearchBar = styled.input`
    position: absolute;
    top: 13vh;
    right: 4vw;
    height: 4vh;
    width: 68vw;
    border-radius: 10vw;
    padding-left: 1.2vw;
    background-color: ${({ theme }) => theme.secondary};
    background-image: url(${searchIco});
    background-repeat: no-repeat;
    background-size: 7% 70%;
    background-position: 100% 50%;
`;
const CardContainer = styled.div`
    margin-top: 5vh;
    margin-left: 25vw;
    display: flex;
    flex-wrap: wrap;
`;
// Fin du style --------------//

const mdpExemples = [
    {
        categName: 'All passwords',
        id: 0,
        site: 'Youtube',
        img: './src/assets/logoPW/SubmitLogo.png',
    },
    {
        categName: 'All passwords',
        id: 1,
        site: 'Google',
        img: './src/assets/logoPW/SubmitLogo.png',
    },
    {
        categName: 'All passwords',
        id: 2,
        site: 'GitHub',
        img: './src/assets/logoPW/SubmitLogo.png',
    },
    {
        categName: 'All passwords',
        id: 3,
        site: 'Figma',
        img: './src/assets/logoPW/SubmitLogo.png',
    },
];
const mdpDevExemples = [
    {
        categName: 'Devops',
        id: 0,
        site: 'GitHub',
        img: './src/assets/logoPW/SubmitLogo.png',
    },
    {
        categName: 'Devops',
        id: 1,
        site: 'Figma',
        img: './src/assets/logoPW/SubmitLogo.png',
    },
];
const mdpLoisirsExemples = [
    {
        categName: 'Loisirs',
        id: 0,
        site: 'Youtube',
        img: './src/assets/logoPW/SubmitLogo.png',
    },
    {
        categName: 'Loisirs',
        id: 1,
        site: 'Google',
        img: './src/assets/logoPW/SubmitLogo.png',
    },
];
const categExemple = [mdpDevExemples, mdpLoisirsExemples];

/* interface NavigationProps {
    allPassw: Array<object>;
    categ: Array<Array<object>>;
} */
interface HomeProps {
    isRendered: (isIt: boolean) => void;
}

export function Home({ isRendered }: HomeProps) {
    const [folderOpen, setFolderOpen] = useState('');
    useEffect(() => {
        isRendered(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const nbCateg = categExemple.length;
    //* Check si le dossier ouvert fait partie des categ
    let cardContent = <p />;
    for (let i = 0; i < nbCateg; i += 1) {
        if (folderOpen === categExemple[i][0].categName) {
            cardContent = (
                <CardContainer>
                    {categExemple[i].map((passw) => (
                        <PasswCard key={passw.id} aPassw={passw} />
                    ))}
                </CardContainer>
            );
        }
    }
    return (
        <PageHome>
            <TabContainer>
                <LogoPW src={logo} alt="Logo of PassWorld" />
                <FolderOfTab
                    title="All passwords"
                    allPassw={mdpExemples}
                    whoIsClick={(folderName) => {
                        setFolderOpen(folderName);
                    }}
                    IsSelect={folderOpen === 'All passwords'}
                />
                {categExemple.map((categorie, i) => (
                    <FolderOfTab
                        key={`${categorie[0].categName}-${i}`}
                        title={categorie[0].categName}
                        allPassw={categorie}
                        whoIsClick={(folderName) => {
                            setFolderOpen(folderName);
                        }}
                        IsSelect={folderOpen === categorie[0].categName}
                    />
                ))}
            </TabContainer>
            <ProfilButton>My account</ProfilButton>
            <SearchBar placeholder={`Search in ${folderOpen.toLowerCase()}`} />
            {folderOpen === 'All passwords' ? (
                <CardContainer>
                    {mdpExemples.map((passw) => (
                        <PasswCard key={passw.id} aPassw={passw} />
                    ))}
                </CardContainer>
            ) : (
                cardContent
            )}
        </PageHome>
    );
}
