import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router';

import { FolderOfTab } from '../Components/NavigationTab';
import { SearchBar } from '../Components/SearchBar';
import { PasswCard } from '../Components/PasswCard';
import { CreatePassw } from '../Components/Password';

import pp from '../assets/Icones/ProfilePic.png';
import logo from '../assets/logoPW/logoPassWorld.png';
import plusButt from '../assets/svgShape/plusButton.svg';
import plus from '../assets/svgShape/+PlusIco.png';

import { IPassw, HomeProps, IHomeServData, ICateg } from '../Utils/type';
import { AddCategPopup } from '../Components/Material_Ui/PopUp';
import { useData } from '../Utils/contexte';

// Début du style -------------->
const PageHome = styled.div`
    width: 100wh;
    height: 100vh;
    display: flex;
    margin: 0;
`;
const TabContainer = styled.div`
    background-color: ${({ theme }) => theme.darkBackground};
    width: 23vw;
    z-index: 0;
    position: absolute;
    top: 0;
    bottom: 0;
    height: 150%;
`;
const LogoPassWorld = styled.img`
    width: 18vw;
    margin-top: 3vh;
    margin-left: 2vh;
    z-index: 100;
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

export function Home({ isRendered }: HomeProps) {
    const {
        allPsw,
        pswByCateg,
        addData,
        addPassw,
        delPassw,
        addNewCateg,
        delCateg,
    } = useData();

    const [folderOpen, setFolderOpen] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isCopy, setIsCopy] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [isAddCateg, setIsAddCateg] = useState(false);
    const [plusAnchor, setPlusAnchor] = useState<HTMLElement | null>(null);
    const [selectFolder, setSelectFold] = useState<IPassw[] | null>(null);

    const navigate = useNavigate();

    // * Begin Functions ===========>
    function getCategByName(categName: string): ICateg | undefined {
        return pswByCateg.find((categ) => categ.name === categName);
    }
    function getPswListByName(categName: string): IPassw[] | undefined {
        if (categName === 'All passwords') {
            return allPsw;
        }
        const theCateg = getCategByName(categName);
        // console.log(theCateg);
        const pswList = theCateg?.passwords.filter(
            (psw) => psw.categName === categName
        );
        return pswList;
    }

    useEffect(() => {
        isRendered(true);
        axios
            .get('http://localhost:3000/home')
            .then((resp) => {
                console.log(resp);
                if (resp.status === 200) {
                    const { allPassw, categPassw }: IHomeServData = resp.data;
                    addData({ allPsw: allPassw, pswByCateg: categPassw });
                }
                if (resp.status === 401) {
                    navigate('/');
                }
            })
            .catch((err) => {
                console.warn(err);
                navigate('/');
            });
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

    const handleDelPsw = (categOf: string, id: string) => {
        const selectedCat = getCategByName(categOf);
        if (selectedCat) {
            delPassw(id, selectedCat._id);
        } else {
            delPassw(id);
        }
    };

    const handleIsAddCateg = () => {
        if (plusAnchor) {
            setIsAddCateg(!isAddCateg);
        }
    };

    useEffect(() => {
        const categSelect = getPswListByName(folderOpen);

        if (!categSelect) {
            setSelectFold(null);
        } else {
            setSelectFold(categSelect);
        }
    }, [folderOpen, allPsw, pswByCateg]);

    // * End Functions ===========//

    return (
        <PageHome>
            <TabContainer>
                <LogoPassWorld src={logo} alt="Logo of PassWorld" />
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
                        getNewCateg={(NouvCateg) => addNewCateg(NouvCateg)}
                        isPopup={(isValid) => setIsAddCateg(!isValid)}
                        forTab
                    />
                ) : null}
                <FolderOfTab
                    title="All passwords"
                    allPassw={allPsw}
                    whoIsClick={(categWho) => setFolderOpen(categWho)}
                    IsSelect={folderOpen === 'All passwords'}
                />
                {pswByCateg.map((categ, i) =>
                    i !== 0 && categ.passwords.length >= 0 ? (
                        <FolderOfTab
                            key={categ._id.toString()}
                            title={categ.name}
                            allPassw={categ.passwords}
                            whoIsClick={(folderName) => {
                                setFolderOpen(folderName);
                            }}
                            IsSelect={folderOpen === categ.name}
                            isDeleted={() => delCateg(categ._id)} // todo
                        />
                    ) : null
                )}
            </TabContainer>

            <ProfilButton>My account</ProfilButton>
            <SearchBar
                allPassw={getPswListByName(folderOpen)}
                openFolder={folderOpen}
                searchResult={(result, searchProceed) => {
                    setIsSearching(searchProceed);
                    const newPswByCateg = [...pswByCateg];
                    if (newPswByCateg[0]?.passwords) {
                        newPswByCateg[0].passwords = result;
                    }
                    addData({ pswByCateg: newPswByCateg });
                }}
            />
            {isSearching ? (
                <CardContainer>
                    {pswByCateg[0].passwords.map((passw) => (
                        <PasswCard
                            key={passw._id.toString()}
                            aPassw={passw}
                            copyIsSucces={(isCopied) => setIsCopy(isCopied)}
                            toDelete={handleDelPsw}
                        />
                    ))}
                </CardContainer>
            ) : selectFolder ? (
                <CardContainer>
                    {selectFolder.map((passw) => (
                        <PasswCard
                            key={passw._id.toString()}
                            aPassw={passw}
                            copyIsSucces={(isCopied) => setIsCopy(isCopied)}
                            toDelete={handleDelPsw}
                        />
                    ))}
                </CardContainer>
            ) : null}

            <AddPassw onClick={() => setIsCreate(true)}>
                <AddShape src={plusButt} alt="plus button" />
            </AddPassw>

            {isCopy ? <CopySucces>Copied to clipboard</CopySucces> : null}
            {isCreate ? (
                <CreatePassw
                    newPassw={(newPssw) => addPassw(newPssw)}
                    closed={(toClose) => setIsCreate(!toClose)}
                />
            ) : null}
        </PageHome>
    );
}
