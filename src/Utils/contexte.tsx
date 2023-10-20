import { createContext, useState, useMemo, ReactNode } from 'react';

interface ThemeContextType {
    selectWBut: boolean;
    setIsButtun: (isIt: boolean) => void;
}
interface ThemeFurnisherProps {
    children: ReactNode;
}
const defaultContextValue: ThemeContextType = {
    selectWBut: true,
    setIsButtun: () => {},
};

export const StyleContext = createContext(defaultContextValue);

export function ThemeFurnisher({ children }: ThemeFurnisherProps) {
    const [selectWBut, setSelectWBut] = useState(true);
    const contextValu = useMemo(() => {
        const setIsButtun = (isIt: boolean) => {
            setSelectWBut(isIt);
        };
        return { selectWBut, setIsButtun };
    }, [selectWBut]);

    return (
        <StyleContext.Provider value={contextValu}>
            {children}
        </StyleContext.Provider>
    );
}
