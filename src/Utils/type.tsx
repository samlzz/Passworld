import { ReactNode } from 'react';

//* Global Interfaces:

export interface APasswType {
    categName: string;
    id: number;
    titre: string;
    siteAddress: string;
    identifier: string;
    mdp: string;
    icoLink: string;
}
export interface ColorProviderProps {
    children: ReactNode;
    isHomeRendered?: boolean;
}

//* pages Interfaces:

export interface HomeProps {
    isRendered: (isIt: boolean) => void;
}

//* component Interfaces

// ? Forms login/register:
export interface FormsProps {
    title: string;
    noAccount: boolean;
}
export interface ForRegisterProps {
    forRegister?: boolean;
}
// ? Navigation Tab:
export interface LitleLogoProps {
    $isFlech?: boolean;
}
export interface ElemProps {
    $isFolder?: boolean;
    $isClick?: boolean;
}
export interface ElemOfTabProps {
    aPassw: APasswType;
}
export interface FolderOfTabProps {
    title: string;
    allPassw: Array<APasswType>;
    whoIsClick: (isIt: string) => void;
    IsSelect: boolean;
}
// ? Password Card:
export interface PasswCardProps {
    aPassw: APasswType;
    copyIsSucces: (isCopied: boolean) => void;
    toDelete?: (categName: string, id: number, titre: string) => void;
    listFolderList: APasswType[][];
}
// ? Search Bar:
export interface SearchBarProps {
    openFolder: string;
    allPassw: APasswType[];
    searchResult: (result: Array<APasswType>, searchProceed: boolean) => void;
}
// ? Password:
export interface ContainerProps {
    $id?: boolean;
    $link?: boolean;
}
export interface CreatePswProps {
    closed: (toDo: boolean) => void;
    newPassw: (newPsw: APasswType, categName: string) => void;
    arrOfArr: Array<APasswType[]>;
}
// ? Material UI:
export interface SelectBoxProps {
    categArray: Array<string>;
    isCategPopup: boolean;
    returnCateg: (categ: string) => void;
    isCategMenu: (isIt: boolean) => void;
    getAnchor: (anchor: HTMLElement) => void;
}
export interface GenerPopupProps {
    valuStrong: (val: number) => void;
}
export interface CategPopupProps {
    anchor: HTMLElement | null;
    open: boolean;
    isPopup: (isIt: boolean) => void;
    getNewCateg: (newCateg: string) => void;
}
export interface MenuContainProps {
    $isItClick: boolean;
}
