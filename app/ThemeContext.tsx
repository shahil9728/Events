import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

interface Theme {
    primaryColor: string;
    primaryColor1: string;
    primaryColor2: string;
    secondaryColor: string;
    headingColor: string;
    lightGray: string;
    lightGray1: string;
    lightGray2: string;
    blackColor: string;
    backgroundColor: string;
}

interface ThemeContextType {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const defaultTheme: Theme = {
    primaryColor: '#EBFF57',    // Green
    primaryColor1: '#B6BF48',   // pale green
    primaryColor2: "#D4E64E", // green + gray
    secondaryColor: '#FFFFFF',  // White
    lightGray: '#2C2B2B',       // Dark gray
    lightGray1: '#464648',      // Gray
    lightGray2: '#787975',      // Light gray
    headingColor: "#F1F0E6",    // Offwhite
    blackColor: "#000000",      // Black,
    backgroundColor: "#121212", // Dark background
};
const lightTheme: Theme = {
    primaryColor: '#EBFF57',      // Fresh green for buttons and highlights
    primaryColor1: '#81C784',     // Lighter green for subtle accents
    primaryColor2: '#C8E6C9',     // Very light green for backgrounds/borders
    secondaryColor: '#FFFFFF',    // White text/icons
    lightGray: '#8d8c8cff',         // Main background color
    lightGray1: '#E0E0E0',        // Card/background secondary
    lightGray2: '#BDBDBD',        // Borders and subtle dividers
    headingColor: '#212121',      // Dark text for headings
    blackColor: '#000000',        // Black for text where needed
    backgroundColor: '#FFFFFF',   // Overall screen background
};

const ThemeContext = createContext<ThemeContextType>({
    theme: defaultTheme,
    setTheme: () => { },
});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const colorScheme = useColorScheme(); // 'light' | 'dark'
    const [theme, setTheme] = useState<Theme>(
        defaultTheme
    );

    React.useEffect(() => {
        setTheme(defaultTheme);
    }, [colorScheme]);

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
