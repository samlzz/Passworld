import styled from 'styled-components';
import { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router';
import valid from '../assets/Icones/Valid.svg';
import { CatchErrorAlert, GoodAlert } from '../Components/SweetAlert';

const PageEditMdp = styled.div`
    background: ${({ theme }) => theme.darkBackground};
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vw;
    z-index: 4;
`;
const EditContainer = styled.div`
    background: ${({ theme }) => theme.background};
    width: 60vw;
    height: 38vw;
    margin: 8vw 0 0 20vw;
    border-radius: 2vw;
    padding: 1vw;
    position: relative;
`;
const StyledTitle = styled.h1`
    font-size: 2.3vw;
    margin: 1% 0 3% 21%;
`;
const ABar = styled.div`
    height: 0.15vw;
    width: 103.3%;
    background: ${({ theme }) => theme.fadeFieldTitle};
    z-index: 3;
    margin: 0 0 2.5vw -1vw;
`;
const FadeTitles = styled.h3`
    color: ${({ theme }) => theme.fadeFieldTitle};
    margin: 4.5vw 0 1.5vw 10vw;
    font-weight: 700;
`;
const FieldContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const MdpField = styled.input`
    height: 3.8vw;
    width: 22vw;
    margin: 0 0 0 18vw;
    border-radius: 1vw;
    background-color: ${({ theme }) => theme.fieldBckgrd};
    padding-left: 1vw;
`;
const ValidButt = styled.button(
    ({ theme }) => `
    background-color: ${theme.primary};
    background-image: url(${valid});
    background-repeat: no-repeat;
    background-position: 55% 45%;
    background-size: 100% 100%;
    margin-left: -4.3vw;
    width: 3.3vw;
    height: 2.75vw;
    border-radius: 0.6vw;
`
);
const ExitButt = styled.button``;

export function EditMdp() {
    const [oldMdp, setOldMdp] = useState('');
    const [newMdp, setNewMdp] = useState('');
    const [premMdpGood, setPremMdpGood] = useState(false);

    const navigate = useNavigate();

    const handleFirstValid = () => {
        axios
            .post('http://localhost:3000/verifMdp', { mdpToCheck: oldMdp })
            .then((resp) => {
                console.log(resp);
                if (resp.data.msg === 'Good') setPremMdpGood(true);
            })
            .catch((err) => {
                console.log(err);
                CatchErrorAlert(err);
            });
    };
    const handleChangeMdp = () => {
        axios
            .put('http://localhost:3000/editUser', { oldMdp, newMdp })
            .then((resp) => {
                console.log(resp);
                if (resp.status === 200) {
                    GoodAlert('Password succesfully edited');
                    navigate('/home');
                }
            })
            .catch((err) => {
                console.log(err);
                CatchErrorAlert(err);
            });
    };
    // const handleFirstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setOldMdp(e.target.value);
    // };
    // const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setNewMdp(e.target.value);
    // };

    return (
        <PageEditMdp>
            <EditContainer>
                <StyledTitle> Edit password of your account</StyledTitle>
                <ABar />
                <FadeTitles>Old Password:</FadeTitles>
                <FieldContainer>
                    <MdpField
                        value={oldMdp}
                        onChange={(e) => setOldMdp(e.target.value)}
                    />
                    <ValidButt onClick={handleFirstValid} />
                </FieldContainer>
                {premMdpGood && (
                    <>
                        <FadeTitles>New Password:</FadeTitles>
                        <FieldContainer>
                            <MdpField
                                value={newMdp}
                                onChange={(e) => setNewMdp(e.target.value)}
                            />
                            <ValidButt onClick={handleChangeMdp} />
                        </FieldContainer>
                    </>
                )}
                <ExitButt />
            </EditContainer>
        </PageEditMdp>
    );
}
