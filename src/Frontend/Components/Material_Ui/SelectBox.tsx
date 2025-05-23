import * as React from 'react';
import { Select, SelectProps, selectClasses } from '@mui/base/Select';
import { Option, optionClasses } from '@mui/base/Option';
import { Popper } from '@mui/base/Popper';
import styled from 'styled-components';
import { SelectBoxProps } from '../../Utils/type';

const StyledButton = styled('button')(
    ({ theme }) => `
    margin: -1.65vw 0 0 3vw; //haut droite bas gauche
    height: 3.5vw;
    width: 13vw;
    border-radius: 0.8vw;
    background: ${theme.darkTercary};
    font-size: 1.35vw;
    box-sizing: border-box;
    padding: 8px 12px;
    text-align: left;
    box-shadow: 0px 4px 6px ${theme.darkBackground};
  
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background-color: ${theme.selected};
      box-shadow: 0px 4px 6px ${theme.darkTercary};
    }
    &.${selectClasses.expanded} {
      &::after {
      content: '▴';
      }
    }
    &::after {
      content: '▾';
      float: right;
    }
`
);

const StyledListbox = styled('ul')(
    ({ theme }) => `
    font-size: 1.2vw;
    box-sizing: border-box;
    padding: 6px;
    margin-top: 0.7vw;
    overflow: auto;
    background: ${theme.darkTercary};
    color: ${theme.white};
    box-shadow: 0px 4px 6px ${theme.darkBackground};
    border-radius: 0.8vw;
    padding-bottom: 2.5vw;
    position: relative;
    width: 12vw;
    // Masquer la barre de défilement pour les navigateurs Webkit (Chrome, Safari, etc.)
    "&::-webkit-scrollbar": {
      width: "0px",
      background: "transparent",
    },
    // Masquer la barre de défilement pour Firefox
    scrollbarWidth: "none",
  `
);

const StyledOption = styled(Option)`
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: default;
    ${({ $AllPsw, theme }) =>
        $AllPsw
            ? `background-color: ${theme.lightPrimary}`
            : `
              &.${optionClasses.selected} {
                background-color: ${theme.lightPrimary};
                color: ${theme.white};
              }
            
              &:hover:not(.${optionClasses.disabled}) {
                background-color: ${theme.primary};
                color: ${theme.white};
              }`};
`;

const StyledPopper = styled(Popper)`
    z-index: 3;
` as typeof Popper;
const AddCategory = styled.button(
    ({ theme }) => `
    position: absolute;
    bottom: 0.3vw;
    left: 28%;
    opacity: 0.8;
    background: ${theme.selected};
    border-radius: 0.3vw;
    width: 3.9vw;
    height: 1.6vw;
    font-size: 1vw;
`
);

function generateHexKey(nbChar: number) {
    const history = [];
    let hexKey = '';
    const characters = '0123456789abcdef';
    const charactersLength = characters.length;

    for (let i = 0; i < nbChar; i += 1) {
        hexKey += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    history.push(hexKey);
    return hexKey;
}

function getValuCateg(defaultCateg: string | undefined, arrOfCateg: string[]) {
    if (defaultCateg) {
        const index = arrOfCateg.indexOf(defaultCateg);
        if (index === -1) return 0;
        return index * 10;
    }
    return 0;
}

const CustomSelect = React.forwardRef(function CustomSelect<
    TValue extends object,
    Multiple extends boolean,
>(
    props: SelectProps<TValue, Multiple>,
    ref: React.ForwardedRef<HTMLButtonElement>
) {
    const slots: SelectProps<TValue, Multiple>['slots'] = {
        root: StyledButton,
        listbox: StyledListbox,
        popper: StyledPopper,
        ...props.slots,
    };

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Select {...props} ref={ref} slots={slots} />;
}) as <TValue extends object, Multiple extends boolean>(
    props: SelectProps<TValue, Multiple> &
        React.RefAttributes<HTMLButtonElement>
) => JSX.Element;

export default function SelectBox({
    categArray,
    isCategPopup,
    defaultCateg,
    returnCateg,
    isCategMenu,
    getAnchor,
}: SelectBoxProps) {
    const [value, setValue] = React.useState<number>(
        getValuCateg(defaultCateg, categArray)
    );
    const [categMenu, setcategMenu] = React.useState(false);
    React.useEffect(() => {
        returnCateg(categArray[value / 10]);
    }, [value]);
    React.useEffect(() => {
        isCategMenu(categMenu);
    }, [categMenu]);
    React.useEffect(() => {
        if (isCategPopup && categMenu) {
            setcategMenu(false);
        }
    }, [isCategPopup]);

    return (
        <CustomSelect
            value={value}
            onChange={(_, newValue: number) => setValue(newValue)}
            name="selectCateg"
            disabled={categMenu}
        >
            {categArray.map((CategName, i) => (
                <StyledOption
                    key={generateHexKey(8)}
                    value={10 * i}
                    $AllPsw={i === 0}
                >
                    {CategName}
                </StyledOption>
            ))}
            <AddCategory
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    getAnchor(e.currentTarget);
                    setcategMenu(!categMenu);
                }}
            >
                add +
            </AddCategory>
        </CustomSelect>
    );
}
