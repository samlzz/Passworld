import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Types } from 'mongoose';
import Cookies from 'js-cookie';

import { DropZone, FolderOfTab } from '../Components/NavigationTab';
import { SearchBar } from '../Components/SearchBar';
import { PasswCard } from '../Components/PasswCard';
import { CreatePassw } from '../Components/Password';

import setting from '../assets/svgShape/Setting.svg';
import logo from '../assets/logoPW/logoPassWorld.png';
import plusButt from '../assets/svgShape/plusButton.svg';
import plus from '../assets/svgShape/+PlusIco.png';

import { IPassw, HomeProps, IHomeServData, ICateg } from '../Utils/type';
import { AddCategPopup } from '../Components/Material_Ui/PopUp';
import { useData } from '../Utils/contexte';
import { CatchErrorAlert, GoodAlert } from '../Components/SweetAlert';
import { ParamsWindow } from '../Components/Setting';

// Début du style -------------->
const PageHome = styled.div`
    width: 100wh;
    height: 100vh;
    display: flex;
    margin: 0;
`;
const TabContainer = styled.div`
    background-color: ${({ theme }) => theme.darkTercary};
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
    z-index: 1;
`;
const ABar = styled.div`
    position: fixed;
    bottom: 4.5vw;
    height: 0.15vw;
    width: 23vw;
    background-color: ${({ theme }) => theme.lightBackground};
`;
const SettingButton = styled.button`
    position: fixed;
    bottom: 0.65vw;
    height: 6vh;
    width: 11vw;
    border-radius: 1vw;
    font-size: 1.2vw;
    padding-left: 3vw;
    background-image: url(${setting});
    background-repeat: no-repeat;
    background-size: 25% 80%;
    background-position: 10% 50%;
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

const AddCategButt = styled.button`
    display: flex;
    align-items: center;
    gap: 0.7vw;
    background: ${({ theme }) => theme.tercary};
    border-radius: 2vw;
    height: 2.5vw;
    padding-left: 1vw;
    margin-left: 12.3vw;
    font-size: 1.1vw;
    margin-bottom: 1.2vw;
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
        resetData,
        addPassw,
        delPassw,
        addNewCateg,
        delCateg,
    } = useData();

    const [folderOpen, setFolderOpen] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [isAddCateg, setIsAddCateg] = useState(false);
    const [isSetting, setIsSetting] = useState(false);
    const [selectFolder, setSelectFold] = useState<IPassw[] | null>(null);

    const plusAnchor = useRef<HTMLButtonElement | null>(null);
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
    function makeCategArr(
        listfolderList: ICateg[],
        withAllPsw: boolean = false
    ): Array<string> {
        const filteredCateg = listfolderList.filter((_, i) => i !== 0);

        const categList = filteredCateg.map((categ) => categ.name);

        if (withAllPsw) {
            categList.unshift('All passwords');
        }
        return categList;
    }

    useEffect(() => {
        isRendered(true);
        axios
            .get('http://localhost:3000/home')
            .then((resp) => {
                if (resp.status === 200) {
                    const { allPassw, categPassw }: IHomeServData = resp.data;
                    const searchCateg: ICateg = {
                        _id: '',
                        name: 'SearchContent',
                        passwords: [],
                    };
                    if (categPassw[0]?.name !== searchCateg.name) {
                        categPassw[0] = {
                            ...searchCateg,
                            _id: new Types.ObjectId().toString(),
                        };
                    }
                    addData({ allPsw: allPassw, pswByCateg: categPassw });
                }
                if (resp.status === 401) {
                    navigate('/');
                }
            })
            .catch((err) => {
                CatchErrorAlert(err);
                navigate('/');
            });
    }, []);

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
            setIsAddCateg((prev) => !prev);
        }
    };

    const handleLogOut = () => {
        axios
            .delete('http://localhost:3000/resetCookies')
            .then((resp) => {
                GoodAlert('Succesfully log out');
                if (resp.status === 200) {
                    resetData();
                    Cookies.remove('token', { path: '/' });
                    Cookies.remove('userId', { path: '/' });
                    Cookies.remove('auth_token', { path: '/' });
                    navigate('/');
                }
            })
            .catch((e) => CatchErrorAlert(e));
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
                    ref={plusAnchor}
                    onClick={handleIsAddCateg}
                >
                    <p> Add Category </p>
                    <AddCategImg src={plus} alt="Add Category" />
                </AddCategButt>
                {isAddCateg && (
                    <AddCategPopup
                        anchor={plusAnchor.current}
                        open={isAddCateg}
                        getNewCateg={(NouvCateg) =>
                            addNewCateg(NouvCateg, makeCategArr(pswByCateg))
                        }
                        isPopup={(is) => setIsAddCateg(is)}
                        forTab
                    />
                )}
                <FolderOfTab
                    title="All passwords"
                    allPassw={allPsw}
                    whoIsClick={(categWho) => setFolderOpen(categWho)}
                    IsSelect={folderOpen === 'All passwords'}
                />
                <DropZone index={1} />
                {pswByCateg.map(
                    (categ, i) =>
                        i !== 0 && (
                            <div key={`div-${categ._id || i}`}>
                                <FolderOfTab
                                    key={categ._id || `${categ.name}-${i}`}
                                    title={categ.name}
                                    allPassw={categ.passwords}
                                    whoIsClick={(folderName) => {
                                        setFolderOpen(folderName);
                                    }}
                                    IsSelect={folderOpen === categ.name}
                                    isDeleted={() => delCateg(categ._id)}
                                    categId={categ._id}
                                />
                                <DropZone
                                    index={i + 1}
                                    key={`dropzone-${categ._id || i}`}
                                />
                            </div>
                        )
                )}
                <ABar />
                <SettingButton onClick={() => setIsSetting((prev) => !prev)}>
                    Settings
                </SettingButton>
            </TabContainer>

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
                            key={passw._id}
                            aPassw={passw}
                            toDelete={handleDelPsw}
                            nouvCateg={(nouvCateg) =>
                                addNewCateg(nouvCateg, makeCategArr(pswByCateg))
                            }
                        />
                    ))}
                </CardContainer>
            ) : selectFolder ? (
                <CardContainer>
                    {selectFolder.map((passw, i) => (
                        <PasswCard
                            key={`${passw._id}--${i}`}
                            aPassw={passw}
                            toDelete={handleDelPsw}
                            nouvCateg={(nouvCateg) =>
                                addNewCateg(nouvCateg, makeCategArr(pswByCateg))
                            }
                        />
                    ))}
                </CardContainer>
            ) : null}

            <AddPassw onClick={() => setIsCreate(true)}>
                <AddShape src={plusButt} alt="add password" />
            </AddPassw>

            {isSetting && (
                <ParamsWindow
                    toClosed={() => setIsSetting((prev) => !prev)}
                    onLogOut={handleLogOut}
                />
            )}
            {isCreate && (
                <CreatePassw
                    newPassw={(newPssw) => addPassw(newPssw)}
                    closed={(toClose) => setIsCreate(!toClose)}
                    newCateg={(newCtgNm) =>
                        addNewCateg(newCtgNm, makeCategArr(pswByCateg))
                    }
                />
            )}
        </PageHome>
    );
}
