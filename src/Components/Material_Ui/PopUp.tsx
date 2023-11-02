/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import styled from 'styled-components';
import {
    Unstable_Popup as Popup,
    PopupChildrenProps,
} from '@mui/base/Unstable_Popup';
import Slider from '@mui/material/Slider';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import Popper from '@mui/material/Popper';

import validIco from '../../assets/Icones/Valid.svg';

import { CategPopupProps, GenerPopupProps } from '../../Utils/type';

function Animated(
    props: React.PropsWithChildren<{
        className: string;
        requestOpen: boolean;
        onEnter: () => void;
        onExited: () => void;
    }>
) {
    const { requestOpen, onEnter, onExited, children, className } = props;

    React.useEffect(() => {
        if (requestOpen) {
            onEnter();
        }
    }, [onEnter, requestOpen]);

    const handleAnimationEnd = React.useCallback(() => {
        if (!requestOpen) {
            onExited();
        }
    }, [onExited, requestOpen]);

    return (
        <div
            onAnimationEnd={handleAnimationEnd}
            className={className + (requestOpen ? ' open' : ' close')}
        >
            {children}
        </div>
    );
}
const PopAnimation = styled(Animated)`
    @keyframes open-animation {
        0% {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
        }

        50% {
            opacity: 1;
            transform: translateY(4px) scale(1.05);
        }

        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes close-animation {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        50% {
            opacity: 1;
            transform: translateY(4px) scale(1.05);
        }

        100% {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
        }
    }

    &.open {
        animation: open-animation 0.4s ease-in forwards;
    }

    &.close {
        animation: close-animation 0.4s ease-in forwards;
    }
`;

const PopupBody = styled.div`
    width: 11.5vw;
    padding-left: 0.5vw;
    padding-right: 0.5vw;
    margin: 8px;
    background-color: ${({ theme }) => theme.darkTercary};
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgb(0 0 0 / 0.7);
    display: flex;
    align-items: center;
    gap: 0.8vw;
`;
const PopUpContainer = styled.div`
    margin-top: -3.6vw;
`;
const StyledGenerate = styled.button`
    background-color: ${({ theme }) => theme.selected};
    border-radius: 0.9vw;
    height: 2.7vw;
    padding-left: 0.5vw;
    font-size: 1.1vw;
`;
const StyledLegend = styled.span`
    font-size: 1.1vw;
`;
const StyledPopup = styled(Popup)`
    z-index: 2;
`;

export function GenerPopup({ valuStrong }: GenerPopupProps) {
    const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = React.useState(false);
    const [strongOfPsw, setStrongPsw] = React.useState(0);
    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <PopUpContainer>
                <StyledGenerate
                    ref={setAnchor}
                    onClick={() => setOpen((o) => !o)}
                    type="button"
                >
                    generate
                </StyledGenerate>

                <StyledPopup
                    anchor={anchor}
                    placement="top"
                    open={open}
                    withTransition
                >
                    {(props: PopupChildrenProps) => (
                        <PopAnimation {...props}>
                            <PopupBody>
                                <StyledLegend> strong:</StyledLegend>

                                <Slider
                                    size="small"
                                    defaultValue={70}
                                    aria-label="Small"
                                    valueLabelDisplay="auto"
                                    value={strongOfPsw}
                                    onChange={(e) => {
                                        setStrongPsw(e.target?.value);
                                        valuStrong(strongOfPsw);
                                    }}
                                    color="info"
                                />
                            </PopupBody>
                        </PopAnimation>
                    )}
                </StyledPopup>
            </PopUpContainer>
        </ClickAwayListener>
    );
}

const PopupContainerCateg = styled.div``;
const StyledInput = styled.input`
    background-color: ${({ theme }) => theme.selected};
    border-radius: 0.4vw;
    &::placeholder {
        opacity: 0.6;
    }
    height: 2vw;
    width: 13vw;
    font-size: 1.3vw;
    padding-left: 0.4vw;
`;
const StyledTitle = styled.span`
    background-color: ${({ theme }) => theme.selected};
    border-radius: 0.4vw;
    height: 2.3vw;
    width: 13vw;
    padding-left: 0.6vw;
    cursor: default;
    font-size: 1.3vw;
    display: flex;
    align-items: center;
    font-weight: 560;
`;
const MenuCategCont = styled.div<{ $forTab: boolean }>(
    ({ theme, $forTab }) => `
    ${
        $forTab ? `margin: 0 0 -2vw 1vw;` : `margin: 0 0 10vw 6.5vw;`
    } // haut doite bas gauche
    background-color: ${theme.darkTercary};
    height: 8vw;
    display: flex;
    flex-direction: column;
    gap: 1vw;
    padding: 1vw;
    border-radius: 1vw;
    position: relative;
    box-shadow: 0px 4px 6px ${theme.darkBackground};
`
);
const StyledValid = styled.img`
    width: 1.7vw;
    position: absolute;
    right: 1.3vw;
    top: 4.6vw;
    border-radius: 1vw;
`;
const StyledPopper = styled(Popper)`
    z-index: 2;
`;

export function AddCategPopup({
    anchor,
    open,
    isPopup,
    getNewCateg,
    forTab = false,
}: CategPopupProps) {
    const [popupIsValid, setPopupValid] = React.useState(false);
    const [newCateg, setNewCateg] = React.useState('');

    const handleValidClick = () => {
        setPopupValid(true);
        if (newCateg) {
            getNewCateg(newCateg);
        }
        isPopup(popupIsValid);
    };
    const handleCickAway = () => {
        setPopupValid(true);
        isPopup(popupIsValid);
    };

    const validRef = React.useRef(null);
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            validRef.current.click();
        }
    };

    return (
        <ClickAwayListener onClickAway={handleCickAway}>
            <PopupContainerCateg>
                <StyledPopper
                    id={open ? 'simple-popper' : undefined}
                    open={open}
                    anchorEl={anchor}
                    placement="right"
                >
                    <MenuCategCont $forTab={forTab}>
                        <StyledTitle>Add a category:</StyledTitle>
                        <StyledInput
                            placeholder="new category..."
                            value={newCateg}
                            onChange={(e) => setNewCateg(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            ref={validRef}
                            type="button"
                            onClick={handleValidClick}
                        >
                            <StyledValid src={validIco} alt="Submit" />
                        </button>
                    </MenuCategCont>
                </StyledPopper>
            </PopupContainerCateg>
        </ClickAwayListener>
    );
}
