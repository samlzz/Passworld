import { createContext, useState, useMemo, useContext } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router';
import { IDefaultDataValu, ProviderProps, IData, IPassw } from './type';

const defaultDataCtxtValu: IDefaultDataValu = {
    allPsw: [],
    pswByCateg: [],
    addData: () => {},
    addPassw: () => {},
    delPassw: () => {},
    editPassw: () => {},
    addNewCateg: () => {},
    delCateg: () => {},
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

    const addPassw = (newPssw: IPassw) => {
        axios
            .post(
                'http://localhost:3000/addPsw',
                { newPsw: newPssw },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((resp) => {
                console.log(resp);
                if (resp.status === 200) {
                    const pswtoAdd = {
                        ...newPssw,
                        _id: resp.data.pswId,
                    };
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
                    const allPswWith = [...allPsw, pswtoAdd];
                    addData({ allPsw: allPswWith });
                }
            })
            .catch((err) => {
                console.warn(err);
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
                console.log(resp);
                const deletedPswId: string = resp.data.deletedPsw._id;
                if (categOf) {
                    const pswLess = pswByCateg.map((categ) => {
                        if (categ._id === categOf) {
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
                console.warn(err);
                if (err.response && err.response.status === 401) {
                    navigate('/');
                }
            });
    };
    const editPassw = (editedPsw: IPassw) => {
        axios
            .put(
                'http://localhost:3000/editPsw',
                { editedPsw },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((resp) => {
                console.log(resp);
                if (resp.status === 200) {
                    const allPswUpdated = allPsw.map((psw) => {
                        if (psw._id === editedPsw._id) {
                            return editedPsw;
                        }
                        return psw;
                    });
                    const pswByCategUpdated = pswByCateg.map((categ) => {
                        if (categ.name === editedPsw.categName) {
                            const updatedPasswords = categ.passwords.map(
                                (mdp) =>
                                    mdp._id === editedPsw._id ? editedPsw : mdp
                            );
                            return {
                                ...categ,
                                passwords: updatedPasswords,
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
                console.warn(err);
                if (err.response && err.response.status === 401) {
                    navigate('/');
                }
            });
    };

    const addNewCateg = (newCategNm: string) => {
        axios
            .post(
                'http://localhost:3000/addCateg',
                { categName: newCategNm },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((resp) => {
                console.log(resp);
                if (resp.status === 200) {
                    const existingCateg = pswByCateg.find(
                        (categ) => categ.name === newCategNm
                    );
                    let newPswByCateg;
                    if (existingCateg) {
                        // ? Mise à jour de la catégorie existante...
                        newPswByCateg = pswByCateg.map((categ) =>
                            categ.name === newCategNm ? { ...categ } : categ
                        );
                    } else {
                        // ? Ajouter la nouvelle catégorie
                        newPswByCateg = [
                            ...pswByCateg,
                            {
                                _id: resp.data.addedCateg,
                                name: newCategNm,
                                passwords: [],
                            },
                        ];
                    }
                    addData({ pswByCateg: newPswByCateg });
                } else if (resp.status === 401) {
                    navigate('/');
                }
            })
            .catch((err) => {
                console.warn(err);
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
                console.log(resp);
                if (resp.status === 200) {
                    setData((prev) => {
                        const filteredCateg = pswByCateg.filter(
                            (categ) => !(categ._id === categIdToDel)
                        );
                        return {
                            ...prev,
                            pswByCateg: filteredCateg,
                        };
                    });
                }
            })
            .catch((err) => {
                console.warn(err);
                if (err.response && err.response.status === 401) {
                    navigate('/');
                }
            });
    };

    const authCtxtValu = useMemo(
        () => ({
            ...data,
            addData,
            addPassw,
            delPassw,
            editPassw,
            addNewCateg,
            delCateg,
        }),
        [data]
    );

    return (
        <DataContext.Provider value={authCtxtValu}>
            {children}
        </DataContext.Provider>
    );
}
