import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Theme {
    primaryColor: string;
    primaryColor1: string;
    secondaryColor: string;
    headingColor: string;
    lightGray: string;
    lightGray1: string;
    lightGray2: string;
    blackColor: string;
}

interface ThemeContextType {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const defaultTheme: Theme = {
    primaryColor: '#EBFF57',    // Green
    primaryColor1: '#B6BF48',   // pale green
    secondaryColor: '#FFFFFF',  // White
    lightGray: '#2C2B2B',       // Dark gray
    lightGray1: '#464648',      // Gray
    lightGray2: '#787975',      // Light gray
    headingColor: "#F1F0E6",    // Offwhite
    blackColor: "#000000",      // <Black></Black>
};

const ThemeContext = createContext<ThemeContextType>({
    theme: defaultTheme,
    setTheme: () => { },
});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
