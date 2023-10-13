import * as React from 'react';
import { Select, SelectProps, selectClasses } from '@mui/base/Select';
import { Option, optionClasses } from '@mui/base/Option';
import { Popper } from '@mui/base/Popper';
import styled from 'styled-components';
import { SelectBoxProps } from '../Utils/type';

const StyledButton = styled('button')(
    ({ theme }) => `
    margin: -1.8vw 0 0 3vw; //haut droite bas gauche
    height: 4vw;
    width: 16vw;
    border-radius: 0.8vw;
    background-color: ${theme.darkTercary};
    padding-left: 1vw;
    font-size: 1vw;
  `
);

const StyledListbox = styled('ul')(
    ({ theme }) => `
  `
);

const StyledOption = styled(Option)(
    ({ theme }) => `
`
);

const StyledPopper = styled(Popper)`
    z-index: 1;
`;

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
}) as <TValue extends {}, Multiple extends boolean>(
    props: SelectProps<TValue, Multiple> &
        React.RefAttributes<HTMLButtonElement>
) => JSX.Element;

export default function SelectBox({ categArray }: SelectBoxProps) {
    return (
        <CustomSelect defaultValue={10}>
            {categArray}
            <StyledOption />
        </CustomSelect>
    );
}
