/**
 * 主题配置
 * 统一管理深色/浅色模式的设计 Token
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type Theme = 'light' | 'dark';

export interface ThemeTokens {
  // 基础颜色
  bg: string;
  text: string;
  border: string;

  // 布局
  layoutBg: string;
  headerBg: string;
  headerBorder: string;

  // AI 消息
  aiMessageBg: string;
  messageText: string;
  nameColor: string;

  // 输入框
  inputBg: string;
  inputBorder: string;
  inputFocusBorder: string;
  placeholder: string;

  // 按钮
  sendBtnBg: string;
  sendBtnText: string;
  sendBtnActiveBg: string;
  sendBtnActiveText: string;
  sendBtnHoverBg: string;

  // 其他
  tipColor: string;
  tabText: string;
  tabHover: string;
  tabActive: string;
  tabInkBar: string;

  // Ant Design 主题色
  primaryColor: string;
}

export const lightTheme: ThemeTokens = {
  bg: '#ffffff',
  text: '#333333',
  border: 'rgba(0, 0, 0, 0.06)',

  layoutBg: '#ffffff',
  headerBg: 'rgba(255, 255, 255, 0.8)',
  headerBorder: 'rgba(0, 0, 0, 0.06)',

  aiMessageBg: '#f7f7f8',
  messageText: '#374151',
  nameColor: '#000000',

  inputBg: '#ffffff',
  inputBorder: '#e5e5e5',
  inputFocusBorder: '#d9d9d9',
  placeholder: '#999999',

  sendBtnBg: '#e5e5e5',
  sendBtnText: '#ffffff',
  sendBtnActiveBg: '#000000',
  sendBtnActiveText: '#ffffff',
  sendBtnHoverBg: '#333333',

  tipColor: '#999999',
  tabText: '#666666',
  tabHover: '#000000',
  tabActive: '#000000',
  tabInkBar: '#000000',

  primaryColor: '#1677ff',
};

export const darkTheme: ThemeTokens = {
  bg: '#121212',
  text: '#ececec',
  border: 'rgba(255, 255, 255, 0.1)',

  layoutBg: '#121212',
  headerBg: 'rgba(18, 18, 18, 0.8)',
  headerBorder: 'rgba(255, 255, 255, 0.1)',

  aiMessageBg: '#1a1a1a',
  messageText: '#ececec',
  nameColor: '#ececec',

  inputBg: '#1a1a1a',
  inputBorder: '#333333',
  inputFocusBorder: '#555555',
  placeholder: '#666666',

  sendBtnBg: '#333333',
  sendBtnText: '#999999',
  sendBtnActiveBg: '#ececec',
  sendBtnActiveText: '#000000',
  sendBtnHoverBg: '#ffffff',

  tipColor: '#666666',
  tabText: '#999999',
  tabHover: '#ececec',
  tabActive: '#ececec',
  tabInkBar: '#ececec',

  primaryColor: '#177ddc',
};

/**
 * 获取主题 Token
 */
export const getThemeTokens = (theme: Theme): ThemeTokens => {
  return theme === 'dark' ? darkTheme : lightTheme;
};

/**
 * 应用主题 CSS 变量到 document
 */
export const applyThemeToDOM = (theme: Theme): void => {
  const tokens = getThemeTokens(theme);
  const root = document.documentElement;
  // 设置 data-theme 属性
  root.setAttribute('data-theme', theme);

  // 移除旧的 CSS 变量
  const existingVars = Array.from(root.style).filter((key) =>
    key.startsWith('--theme-')
  );
  existingVars.forEach((varName) => root.style.removeProperty(varName));

  // 设置新的 CSS 变量
  Object.entries(tokens).forEach(([key, value]) => {
    const cssVarName = `--theme-${key}`;
    root.style.setProperty(cssVarName, value);
  });
};

/**
 * 检测系统主题偏好
 */
export const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * 根据模式和系统主题计算实际主题
 */
export const getEffectiveTheme = (mode: ThemeMode): Theme => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
};
