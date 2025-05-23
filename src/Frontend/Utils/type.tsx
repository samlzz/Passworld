import { AxiosError } from 'axios';
import { ReactNode } from 'react';

//* Global Interfaces:

export interface IPassw {
    _id: string;
    categName?: string;
    titre: string;
    siteAddress: string;
    identifier: string;
    mdp: string;
    icoLink?: string;
}
export interface ColorProviderProps {
    children: ReactNode;
    isHomeRendered?: boolean;
}
type ThemeValues = {
    background: '#1E2938';
    darkBackground: '#111727';
    primary: '#453AE4';
    lightPrimary: '#747FEE';
    secondary: '#81858D';
    darkSecondary: '#282F3D';
    white: '#FFFFFFCC';
    black: '#000000';
    placeHolder: '#C3C3C3';
    tercary: '#182035';
    darkTercary: '#141B2F';
    selected: '#293556';
};
export interface GlobStyleProps {
    theme: ThemeValues;
}

//* Contexte Interfaces:

export interface ProviderProps {
    children: ReactNode;
}
export interface ICateg {
    _id: string;
    name: string;
    passwords: IPassw[];
}
export interface IData {
    allPsw: IPassw[];
    pswByCateg: ICateg[];
}
export interface IDefaultDataValu {
    allPsw: IPassw[];
    pswByCateg: ICateg[];
    addData: (newData: Partial<IData>) => void;
    resetData: () => void;
    addPassw: (newPsw: IPassw) => void;
    delPassw: (pswToDelID: string, categOf?: string | undefined) => void;
    editPassw: (editedPsw: IPassw) => void;
    addNewCateg: (newCategNm: string, categNameArr: string[]) => void;
    delCateg: (categIdToDel: string) => void;
    moveACateg: (categId: string, newIndex: number) => void;
    moveOfCateg: (categId: string, passwId: string) => void;
    rmInCategNotAllPsw: (passwId: string) => void;
}

//* pages Interfaces:

export interface HomeProps {
    isRendered: (isIt: boolean) => void;
}
export interface IHomeServData {
    allPassw: IPassw[];
    categPassw: ICateg[];
}

//* component Interfaces

// ? Setting:
export interface ISettServData {
    identifier: string;
    nbOfPassw: number;
}
// ? Forms login/register:
export interface FormsProps {
    title: string;
    noAccount: boolean;
}
export interface ForRegisterProps {
    $forRegister?: boolean;
}
export interface EyesProps {
    $isHide: boolean;
    $isEdit: boolean;
    $isConfirm?: boolean;
}
// ? Navigation Tab:
export interface LitleLogoProps {
    $isFlech?: boolean;
}
export interface FoldDivProps {
    $isClick?: boolean;
    $isAll?: boolean;
}
export interface ElemProps {
    $isFolder?: boolean;
    $isClick?: boolean;
}
export interface ElemOfTabProps {
    aPassw: IPassw;
}
export interface FolderOfTabProps {
    title: string;
    allPassw: IPassw[];
    IsSelect: boolean;
    categId?: string;
    whoIsClick: (isIt: string) => void;
    isDeleted?: () => void;
}
export interface Iitem {
    id: string;
    type: string;
}
export interface DropZonProps {
    index: number;
}
// ? Password Card:
export interface PasswCardProps {
    aPassw: IPassw;
    toDelete: (categName: string, id: string) => void;
    nouvCateg: (nouvCategName: string) => void;
}
// ? Search Bar:
export interface SearchBarProps {
    openFolder: string;
    allPassw: IPassw[] | undefined;
    searchResult: (result: Array<IPassw>, searchProceed: boolean) => void;
}
// ? Password:
export interface ContainerProps {
    $id?: boolean;
    $link?: boolean;
}
export interface CreatePswProps {
    closed: (toDo: boolean) => void;
    newPassw: (newPsw: IPassw) => void;
    newCateg: (newCategName: string) => void;
    aPassw?: IPassw | undefined;
    isEdit?: boolean;
}
// ? Material UI:
export interface SelectBoxProps {
    categArray: Array<string>;
    isCategPopup: boolean;
    defaultCateg: string | undefined;
    returnCateg: (categ: string) => void;
    isCategMenu: (isIt: boolean) => void;
    getAnchor: (anchor: HTMLElement) => void;
}
export interface GenerPopupProps {
    valuHash: (hash: string) => void;
}
export interface CategPopupProps {
    anchor: HTMLElement | null;
    open: boolean;
    isPopup: (isIt: boolean) => void;
    getNewCateg: (newCateg: string) => void;
    forTab?: boolean;
}
export interface MenuContainProps {
    $isItClick: boolean;
}
// ? SweetAlert:
export interface ErrOfPW extends AxiosError {
    data: { err: string };
}
// ? Settings:
export interface ParamProps {
    toClosed: () => void;
    onLogOut: () => void;
}
