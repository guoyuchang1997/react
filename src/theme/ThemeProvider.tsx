/**
 * 主题 Provider 组件
 * 提供主题切换和状态管理
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import {
  ThemeMode,
  Theme,
  getSystemTheme,
  getEffectiveTheme,
  applyThemeToDOM,
  lightTheme,
  darkTheme,
} from './theme.config';

interface ThemeContextValue {
  mode: ThemeMode;
  theme: Theme;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme-mode';

/**
 * 从 localStorage 获取保存的主题模式
 */
const getStoredMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  return 'system';
};

/**
 * 保存主题模式到 localStorage
 */
const storeMode = (mode: ThemeMode): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * 主题 Provider 组件
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => getStoredMode());
  const [theme, setTheme] = useState<Theme>(() => getEffectiveTheme(getStoredMode()));

  // 更新主题
  const updateTheme = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    storeMode(newMode);
    const effectiveTheme = getEffectiveTheme(newMode);
    setTheme(effectiveTheme);
    applyThemeToDOM(effectiveTheme);
  }, []);

  // 切换主题（在 light/dark 之间）
  const toggleTheme = useCallback(() => {
    const newMode: ThemeMode = mode === 'light' ? 'dark' : 'light';
    updateTheme(newMode);
  }, [mode, updateTheme]);

  // 设置主题模式
  const setMode = useCallback((newMode: ThemeMode) => {
    updateTheme(newMode);
  }, [updateTheme]);

  // 监听系统主题变化
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = (e: MediaQueryListEvent) => {
      const systemTheme: Theme = e.matches ? 'dark' : 'light';
      setTheme(systemTheme);
      applyThemeToDOM(systemTheme);
    };

    // 现代浏览器使用 addEventListener
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, [mode]);

  // 初始化应用主题
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const value: ThemeContextValue = {
    mode,
    theme,
    isDark: theme === 'dark',
    setMode,
    toggleTheme,
  };

  const currentTokens = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        theme={{
          algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: currentTokens.primaryColor,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

/**
 * 使用主题 Context 的 Hook
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
