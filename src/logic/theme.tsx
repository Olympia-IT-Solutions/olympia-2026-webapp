import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const THEME_STORAGE_KEY = 'theme';
const CHAKRA_COLOR_MODE_KEY = 'chakra-ui-color-mode';

const lightThemeVariables: Record<string, string> = {
  '--chakra-colors-bg': '#ffffff',
  '--chakra-colors-surface': '#ffffff',
  '--chakra-colors-surface-muted': '#f7f7f7',
  '--chakra-colors-text': '#003049',
  '--chakra-colors-text-muted': 'rgba(0, 48, 73, 0.72)',
  '--chakra-colors-border': '#eeeeee',
  '--chakra-colors-border-hover': '#cccccc',
  '--chakra-colors-accent': '#007f80',
  '--chakra-colors-accent-strong': '#006666',
  '--chakra-colors-nav-bg': 'rgba(255, 255, 255, 0.9)',
  '--chakra-colors-hover-bg': '#f0f0f0',
  '--chakra-colors-button-bg': '#ffffff',
  '--chakra-colors-button-text': '#003049',
  '--chakra-colors-input-bg': '#ffffff',
  '--chakra-colors-scrollbar-thumb': 'rgba(0, 0, 0, 0.22)',
  '--chakra-colors-scrollbar-thumb-hover': 'rgba(0, 0, 0, 0.36)',
  '--chakra-colors-medal-gold': '#FFD700',
  '--chakra-colors-medal-silver': '#C0C0C0',
  '--chakra-colors-medal-bronze': '#CD7F32',
}

const darkThemeVariables: Record<string, string> = {
  '--chakra-colors-bg': '#070707',
  '--chakra-colors-surface': '#1b1b1b',
  '--chakra-colors-surface-muted': '#161616',
  '--chakra-colors-text': '#ffffff',
  '--chakra-colors-text-muted': 'rgba(255, 255, 255, 0.76)',
  '--chakra-colors-border': '#444444',
  '--chakra-colors-border-hover': '#666666',
  '--chakra-colors-accent': '#007f80',
  '--chakra-colors-accent-strong': '#006666',
  '--chakra-colors-nav-bg': '#1b1b1b',
  '--chakra-colors-hover-bg': 'rgba(255, 255, 255, 0.04)',
  '--chakra-colors-button-bg': 'rgba(255, 255, 255, 0.08)',
  '--chakra-colors-button-text': '#ffffff',
  '--chakra-colors-input-bg': '#1b1b1b',
  '--chakra-colors-scrollbar-thumb': 'rgba(255, 255, 255, 0.12)',
  '--chakra-colors-scrollbar-thumb-hover': 'rgba(255, 255, 255, 0.22)',
  '--chakra-colors-medal-gold': '#FFD700',
  '--chakra-colors-medal-silver': '#C0C0C0',
  '--chakra-colors-medal-bronze': '#CD7F32',
}

const olympiaThemeConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        neutral: {
          0: { value: '#ffffff' },
          50: { value: '#f7f7f7' },
          200: { value: '#eeeeee' },
          300: { value: '#cccccc' },
          700: { value: '#444444' },
          900: { value: '#1b1b1b' },
          925: { value: '#161616' },
          950: { value: '#070707' },
        },
        brand: {
          300: { value: '#33a9aa' },
          500: { value: '#007f80' },
          600: { value: '#006666' },
        },
        ice: {
          700: { value: '#003049' },
        },
        medal: {
          gold: { value: '#FFD700' },
          silver: { value: '#C0C0C0' },
          bronze: { value: '#CD7F32' },
        },
      },
      fonts: {
        heading: {
          value: "'MilanoCortina2026-Bold', 'Trebuchet MS', 'Segoe UI', sans-serif",
        },
        body: {
          value: "'Avenir Next', 'Segoe UI', 'Helvetica Neue', sans-serif",
        },
      },
      fontSizes: {
        xs: { value: '0.75rem' },
        sm: { value: '0.875rem' },
        md: { value: '1rem' },
        lg: { value: '1.125rem' },
        xl: { value: '1.25rem' },
        '2xl': { value: '1.5rem' },
        '3xl': { value: '1.875rem' },
        '4xl': { value: '2.25rem' },
        '5xl': { value: '3rem' },
      },
      radii: {
        sm: { value: '0.375rem' },
        md: { value: '0.625rem' },
        lg: { value: '0.875rem' },
        xl: { value: '1.125rem' },
        '2xl': { value: '1.5rem' },
        '3xl': { value: '2rem' },
        full: { value: '9999px' },
      },
      spacing: {
        gutter: { value: '1rem' },
        section: { value: '3rem' },
      },
      shadows: {
        'ring-soft': {
          value: '0 0 0 1px rgba(0, 127, 128, 0.18), 0 16px 32px rgba(0, 48, 73, 0.08)',
        },
      },
      durations: {
        fast: { value: '180ms' },
        base: { value: '320ms' },
        slow: { value: '560ms' },
        ornament: { value: '7s' },
        'ornament-slow': { value: '10s' },
        ambient: { value: '18s' },
        'ambient-alt': { value: '22s' },
      },
      easings: {
        emphasized: { value: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        gentle: { value: 'cubic-bezier(0.42, 0, 0.58, 1)' },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          value: { _light: '{colors.neutral.0}', _dark: '{colors.neutral.950}' },
        },
        surface: {
          value: { _light: '{colors.neutral.0}', _dark: '{colors.neutral.900}' },
        },
        'surface-muted': {
          value: { _light: '{colors.neutral.50}', _dark: '{colors.neutral.925}' },
        },
        text: {
          value: { _light: '{colors.ice.700}', _dark: '{colors.neutral.0}' },
        },
        'text-muted': {
          value: {
            _light: 'rgba(0, 48, 73, 0.72)',
            _dark: 'rgba(255, 255, 255, 0.76)',
          },
        },
        border: {
          value: { _light: '{colors.neutral.200}', _dark: '{colors.neutral.700}' },
        },
        'border-hover': {
          value: { _light: '{colors.neutral.300}', _dark: '#666666' },
        },
        accent: {
          value: '{colors.brand.500}',
        },
        'accent-strong': {
          value: '{colors.brand.600}',
        },
        'nav-bg': {
          value: {
            _light: 'rgba(255, 255, 255, 0.9)',
            _dark: '{colors.neutral.900}',
          },
        },
        'hover-bg': {
          value: {
            _light: '#f0f0f0',
            _dark: 'rgba(255, 255, 255, 0.04)',
          },
        },
        'button-bg': {
          value: {
            _light: '{colors.neutral.0}',
            _dark: 'rgba(255, 255, 255, 0.08)',
          },
        },
        'button-text': {
          value: { _light: '{colors.ice.700}', _dark: '{colors.neutral.0}' },
        },
        'input-bg': {
          value: { _light: '{colors.neutral.0}', _dark: '{colors.neutral.900}' },
        },
        'scrollbar-thumb': {
          value: {
            _light: 'rgba(0, 0, 0, 0.22)',
            _dark: 'rgba(255, 255, 255, 0.12)',
          },
        },
        'scrollbar-thumb-hover': {
          value: {
            _light: 'rgba(0, 0, 0, 0.36)',
            _dark: 'rgba(255, 255, 255, 0.22)',
          },
        },
        'medal-gold': {
          value: '{colors.medal.gold}',
        },
        'medal-silver': {
          value: '{colors.medal.silver}',
        },
        'medal-bronze': {
          value: '{colors.medal.bronze}',
        },
      },
    },
  },
  globalCss: {
    'html, body': {
      backgroundColor: 'bg',
      color: 'text',
      transitionProperty: 'background-color, color',
      transitionDuration: 'var(--chakra-durations-base)',
      transitionTimingFunction: 'var(--chakra-easings-emphasized)',
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components -- Consumed by ChakraProvider at app bootstrap.
export const olympiaSystem = createSystem(defaultConfig, olympiaThemeConfig);

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components -- Shared hook consumed by app components.
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  const savedChakraMode = localStorage.getItem(CHAKRA_COLOR_MODE_KEY);
  if (savedChakraMode === 'light' || savedChakraMode === 'dark') {
    return savedChakraMode;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const resolvedVariables = theme === 'dark' ? darkThemeVariables : lightThemeVariables;

    Object.entries(resolvedVariables).forEach(([variableName, variableValue]) => {
      document.documentElement.style.setProperty(variableName, variableValue);
    });
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    // Keep Chakra color mode storage aligned with the app-level source of truth.
    try {
      localStorage.setItem(CHAKRA_COLOR_MODE_KEY, theme);
    } catch {
      // Ignore private-mode storage restrictions.
    }
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};