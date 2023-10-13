/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import searchIco from '../assets/svgShape/Search.svg';

// Début du style -------------->
const StyledSearchBar = styled.input`
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
// Fin du style --------------//

/* const mdpExemples = [
    {
        categName: 'All passwords',
        id: 0,
        site: 'Youtube',
        ico: './src/assets/logoPW/SubmitLogo.png',
        userID: 'sliziard@icloud.com',
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
]; */

export function TestSearchBar({ allPassw, searchResult }: any) {
    const [searchContent, setSearch] = useState('');
    const firstRender = useRef(true);
    let searchProceed = false;
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const result: Array<object> = [];
        allPassw.forEach((passw: any) => {
            const siteName = passw.site.toLowerCase();
            const siteEmail = passw?.userID?.toLowerCase();
            const lowSearched = searchContent
                ? searchContent.toLowerCase()
                : null;
            if (siteName.includes(lowSearched)) {
                result.push(passw);
                searchProceed = true;
            } else if (siteEmail?.includes(lowSearched)) {
                result.push(passw);
                searchProceed = true;
            }
        });
        if (searchContent === '') {
            console.log('is none');
            searchProceed = false;
        }
        searchResult(result, searchProceed);
    }, [searchContent]);
    return (
        <StyledSearchBar
            value={searchContent}
            onChange={(e) => setSearch(e.target.value)}
        />
    );
}
