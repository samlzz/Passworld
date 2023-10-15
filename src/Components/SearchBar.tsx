import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import searchIco from '../assets/svgShape/Search.svg';

import { SearchBarProps, APasswType } from '../Utils/type';

// Début du style -------------->
const StyledSearchBar = styled.input(
    ({ theme }) => `
    position: absolute;
    top: 13vh;
    right: 4vw;
    height: 4vh;
    width: 68vw;
    border-radius: 10vw;
    padding-left: 1.2vw;
    background-color: ${theme.secondary};
    background-image: url(${searchIco});
    background-repeat: no-repeat;
    background-size: 7% 70%;
    background-position: 100% 50%;
`
);
// Fin du style --------------//

export function SearchBar({
    openFolder,
    allPassw,
    searchResult,
}: SearchBarProps) {
    const [searchContent, setSearch] = useState('');
    const firstRender = useRef(true);
    let searchProceed = false;
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const result: APasswType[] = [];
        // const splitContent = searchContent.match(/\$L: (\w+)/); // ? ve
        // const contentToCheck = splitContent ? splitContent[1] : searchContent;
        allPassw.forEach((passw) => {
            const siteName = passw.titre.toLowerCase();
            const siteEmail = passw?.identifier?.toLowerCase();
            const lowSearched = searchContent
                ? searchContent.toLowerCase()
                : '';
            if (siteName.includes(lowSearched)) {
                result.push(passw);
                searchProceed = true;
            } else if (siteEmail?.includes(lowSearched)) {
                result.push(passw);
                searchProceed = true;
            }
        });
        if (searchContent === '') {
            searchProceed = false;
        }
        searchResult(result, searchProceed);
    }, [searchContent]);
    if (openFolder === '') {
        return (
            <StyledSearchBar
                value=""
                readOnly
                placeholder={`Search in ${openFolder.toLowerCase()}`}
            />
        );
    }
    return (
        <StyledSearchBar
            value={searchContent}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search in ${openFolder.toLowerCase()}`}
        />
    );
}
