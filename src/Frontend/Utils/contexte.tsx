import { createContext, useState, useMemo, useContext } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router';
import { IDefaultDataValu, ProviderProps, IData, IPassw, ICateg } from './type';
import {
    BadAlert,
    CatchErrorAlert,
    ErrorAlert,
    GoodAlert,
} from '../Components/SweetAlert';

const defaultDataCtxtValu: IDefaultDataValu = {
    allPsw: [],
    pswByCateg: [
        {
            _id: '0',
            name: 'SearchContent',
            passwords: [],
        },
    ],
    addData: () => {},
    resetData: () => {},
    addPassw: () => {},
    delPassw: () => {},
    editPassw: () => {},
    moveOfCateg: () => {},
    addNewCateg: () => {},
    delCateg: () => {},
    rmInCategNotAllPsw: () => {},
};
const DataContext = createContext(defaultDataCtxtValu);

export const useData = () => useContext(DataContext);

export function DataProvider({ children }: ProviderProps) {
    const [data, setData] = useState<IData>({ allPsw: [], pswByCateg: [] });
    const { pswByCateg, allPsw } = data;
    const navigate = useNavigate();

    // ? quand pswByCateg change allPsw change aussi et enlève les doublons
    // useEffect(() => {

    //     // prépare les données, et les MAJ avec une seule MAJ d'état
    //     const newAllPsw = removeDouble(allPsw);
    //     const newPswByCat = pswByCateg.map((categ) => {
    //         return {
    //             ...categ,
    //             passwords: removeDouble(categ.passwords),
    //         };
    //     });
    //     let PBCHasChanged = false;
    //     pswByCateg.forEach((categ) => {
    //         newPswByCat.forEach((newCateg) => {
    //             if (newCateg.passwords.length !== categ.passwords.length) {
    //                 PBCHasChanged = true;
    //             }
    //         });
    //     });
    //     // MAJ d'etat si le nb d'élém dans allPsw et pswByCateg change
    //     if (PBCHasChanged) {
    //         setData((prev) => ({
    //             ...prev,
    //             pswByCateg: newPswByCat,
    //         }));
    //         PBCHasChanged = false;
    //     }
    //     if (newAllPsw.length !== allPsw.length) {
    //         setData((prev) => ({
    //             ...prev,
    //             allPsw: newAllPsw,
    //         }));
    //     }
    // }, [pswByCateg, allPsw]);

    const removeDouble = (dataTo: IPassw[]) => {
        const uniqueIds = new Set();
        return dataTo.filter((psw) => {
            const isNew = !uniqueIds.has(psw._id);
            uniqueIds.add(psw._id);
            return isNew;
        });
    };
    const addData = (newData: Partial<IData>) => {
        setData((prevData) => {
            const updatedData: IData = { ...prevData };

            if (newData.allPsw) {
                updatedData.allPsw = removeDouble([
                    ...prevData.allPsw,
                    ...newData.allPsw,
                ]);
            }
            if (newData.pswByCateg) {
                updatedData.pswByCateg = newData.pswByCateg.map((categ) => ({
                    ...categ,
                    passwords: removeDouble([...categ.passwords]),
                }));
            }

            return updatedData;
        });
    };
    const resetData = () => {
        setData({ allPsw: [], pswByCateg: [] });
    };

    const addPassw = (newPssw: IPassw) => {
        axios
            .post(
                'http://localhost:3000/addPsw',
                { newPsw: newPssw },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((resp) => {
                if (resp.status === 200) {
                    GoodAlert(resp.data.msg);
                    const pswtoAdd = {
                        ...newPssw,
                        _id: resp.data.pswId,
                    };
                    const allPswWith = [...allPsw, pswtoAdd];
                    addData({ allPsw: allPswWith });
                    if (newPssw.categName) {
                        const withPsw = pswByCateg.map((categ) => {
                            if (categ.name === newPssw.categName) {
                                return {
                                    ...categ,
                                    passwords: [...categ.passwords, pswtoAdd],
                                };
                            }
                            return categ;
                        });
                        addData({ pswByCateg: withPsw });
                    }
                }
            })
            .catch((err) => {
                CatchErrorAlert(err);
                if (err.response && err.response.status === 401) {
                    navigate('/');
                }
            });
    };
    const delPassw = (pswToDelID: string, categOf?: string | undefined) => {
        axios
            .post(
                'http://localhost:3000/delPsw',
                { pswId: pswToDelID, categName: categOf },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((resp) => {
                GoodAlert(resp.data.msg);
                const deletedPswId: string = resp.data.deletedPsw._id;
                if (categOf) {
                    const pswLess = pswByCateg.map((categ) => {
                        if (categ?._id === categOf) {
                            const filteredPsw = categ.passwords.filter(
                                (psw) => !(deletedPswId === psw._id)
                            );
                            return { ...categ, passwords: filteredPsw };
                        }
                        return categ;
                    });
                    setData((prev) => ({
                        ...prev,
                        pswByCateg: pswLess,
                    }));
                }
                const allPswLess = allPsw.filter(
                    (psw) => !(deletedPswId === psw._id)
                );
                setData((prev) => ({
                    ...prev,
                    allPsw: allPswLess,
                }));
            })
            .catch((err) => {
                CatchErrorAlert(err);
                if (err.response && err.response.status === 401) {
                    navigate('/');
                }
            });
    };
    const isIdInPswArr = (editedPswId: string, categ: ICateg) => {
        let isIdIn;
        categ.passwords.forEach((mdp) => {
            if (mdp._id === editedPswId) {
                isIdIn = true;
            }
        });
        return isIdIn;
    };
    const editPassw = (editedPsw: IPassw) => {
        axios
            .put(
                'http://localhost:3000/editPsw',
                { editedPsw },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((resp) => {
                if (resp.status === 200) {
                    GoodAlert(resp.data.msg);
                    const allPswUpdated = allPsw.map((psw) => {
                        if (psw._id === editedPsw._id) {
                            return editedPsw;
                        }
                        return psw;
                    });
                    const pswByCategUpdated = pswByCateg.map((categ) => {
                        if (categ.name === editedPsw.categName) {
                            if (isIdInPswArr(editedPsw._id, categ)) {
                                const updatedPasswords = categ.passwords.map(
                                    (mdp) =>
                                        mdp._id === editedPsw._id
                                            ? editedPsw
                                            : mdp
                                );
                                return {
                                    ...categ,
                                    passwords: updatedPasswords,
                                };
                            }
                            return {
                                ...categ,
                                passwords: [...categ.passwords, editedPsw],
                            };
                        }
                        if (isIdInPswArr(editedPsw._id, categ)) {
                            return {
                                ...categ,
                                passwords: categ.passwords.filter(
                                    (psw) => !(editedPsw._id === psw._id)
                                ),
                            };
                        }
                        return categ;
                    });

                    setData((prev) => ({
                        ...prev,
                        allPsw: allPswUpdated,
                        pswByCateg: pswByCategUpdated,
                    }));
                }
            })
            .catch((err) => {
                CatchErrorAlert(err);
                if (err.response && err.response.status === 401) {
                    navigate('/');
                }
            });
    };
    const rmInCategNotAllPsw = (pswId: string) => {
        const categWithout = pswByCateg.map((categ, i) => {
            if (i !== 0) {
                const updatedPsws = categ.passwords.filter(
                    (psw) => psw._id !== pswId
                );
                return {
                    ...categ,
                    passwords: updatedPsws,
                };
            }
            return categ;
        });
        const removedPsw = allPsw.find((psw) => psw._id === pswId);
        const editedPsw = {
            ...removedPsw,
            categName: 'All passwords',
        };
        axios
            .put(
                'http://localhost:3000/editPsw',
                { editedPsw },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((resp) => {
                setData((prev) => ({
                    ...prev,
                    pswByCateg: categWithout,
                }));
                GoodAlert(resp.data.msg);
            })
            .catch((e) => {
                CatchErrorAlert(e);
                if (e.response && e.response.status === 401) {
                    navigate('/');
                }
            });
        return { categWithout, removedPsw };
    };
    const moveOfCateg = (categId: string, passwId: string) => {
        try {
            const categToUpdate = pswByCateg.find((categ) => {
                return categ.passwords.forEach((passw) => {
                    if (passw._id === passwId) return true;
                    return false;
                });
            });
            const categToMove = pswByCateg.find((categ) => {
                return categ._id === categId;
            });
            let pswChangedCateg: IPassw | undefined;
            if (categToUpdate) {
                pswChangedCateg = categToUpdate.passwords.find(
                    (passw) => passw._id === passwId
                ) as IPassw;
            } else {
                pswChangedCateg = allPsw.find(
                    (passw) => passw._id === passwId
                ) as IPassw;
            }
            if (categToMove) {
                pswChangedCateg = {
                    ...pswChangedCateg,
                    categName: categToMove.name,
                };
                editPassw(pswChangedCateg);
            } else {
                throw new Error();
            }
        } catch (error) {
            BadAlert(`Failed to move password of categ`);
        }
    };

    const addNewCateg = (newCategNm: string, categNameArr: string[]) => {
        if (categNameArr.includes(newCategNm)) {
            ErrorAlert('Category already exist');
            return;
        }
        axios
            .post(
                'http://localhost:3000/addCateg',
                { categName: newCategNm },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((resp) => {
                if (resp.status === 200) {
                    GoodAlert(resp.data.msg);
                    const { addedCateg } = resp.data;
                    const existingCateg = pswByCateg.find(
                        (categ) => categ._id === addedCateg._id
                    );
                    if (existingCateg) {
                        ErrorAlert('Category already exist');
                        return;
                    }
                    // ? Ajouter la nouvelle catégorie
                    const newPswByCateg = [
                        ...pswByCateg,
                        {
                            _id: resp.data.addedCateg,
                            name: newCategNm,
                            passwords: [],
                        },
                    ];
                    addData({ pswByCateg: newPswByCateg });
                } else if (resp.status === 401) {
                    navigate('/');
                }
            })
            .catch((err) => {
                CatchErrorAlert(err);
                if (err.response && err.response.status === 401) {
                    navigate('/');
                }
            });
    };
    const delCateg = (categIdToDel: string) => {
        axios
            .post(
                'http://localhost:3000/delCateg',
                { categId: categIdToDel },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((resp) => {
                if (resp.status === 200) {
                    GoodAlert(resp.data.msg);
                    setData((prev) => {
                        const filteredCateg = pswByCateg.filter(
                            (categ) => categ._id !== categIdToDel
                        );
                        return {
                            ...prev,
                            pswByCateg: filteredCateg,
                        };
                    });
                }
            })
            .catch((err) => {
                CatchErrorAlert(err);
                if (err.response && err.response.status === 401) {
                    navigate('/');
                }
            });
    };

    const authCtxtValu = useMemo(
        () => ({
            ...data,
            addData,
            resetData,
            addPassw,
            delPassw,
            editPassw,
            moveOfCateg,
            addNewCateg,
            delCateg,
            rmInCategNotAllPsw,
        }),
        [data]
    );

    return (
        <DataContext.Provider value={authCtxtValu}>
            {children}
        </DataContext.Provider>
    );
}
