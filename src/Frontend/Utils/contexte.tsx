import { createContext, useState, useMemo, useContext } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router';
import { Types } from 'mongoose';
import { IDefaultDataValu, ProviderProps, IData, IPassw } from './type';

const defaultDataCtxtValu: IDefaultDataValu = {
    allPsw: [],
    pswByCateg: [],
    addData: () => {},
    addPassw: () => {},
    delPassw: () => {},
    addNewCateg: () => {},
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
    const delPassw = (
        pswToDelID: Types.ObjectId,
        categOf: string | undefined
    ) => {
        axios
            .post(
                'http://localhost:3000/delPsw',
                { pswId: pswToDelID, categName: categOf },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((resp) => {
                console.log(resp);
                const pswLess = pswByCateg.map((categ) => {
                    const deletedPswId: Types.ObjectId =
                        resp.data.deletedPsw._id;

                    const filteredPsw = categ.passwords.filter((psw) => {
                        console.log(deletedPswId, '__', psw._id);
                        if (deletedPswId === psw._id) return false;
                        return true;
                    });

                    return {
                        ...categ,
                        passwords: filteredPsw,
                    };
                });
                addData({ pswByCateg: pswLess });
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
                            { name: newCategNm, passwords: [] },
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

    const authCtxtValu = useMemo(
        () => ({
            ...data,
            addData,
            addPassw,
            delPassw,
            addNewCateg,
        }),
        [data]
    );

    return (
        <DataContext.Provider value={authCtxtValu}>
            {children}
        </DataContext.Provider>
    );
}
