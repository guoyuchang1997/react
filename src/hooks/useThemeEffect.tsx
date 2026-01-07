/**
 * 主题 Effect Hook
 * 用于在 Zustand store 和新主题系统之间同步
 *
 * @deprecated 推荐直接使用 useTheme hook
 * 此 hook 仅用于向后兼容 Zustand store
 */

import { useEffect } from 'react';
import { Store } from '../store/home';
import { useTheme } from '../theme';

export const useThemeEffect = () => {
  const { mode, theme } = useTheme();

  // 同步主题模式到 Zustand store（保持向后兼容）
  useEffect(() => {
    Store.Theme.update('mode', mode);
    Store.Theme.update('isDarkMode', theme === 'dark');
  }, [mode, theme]);
};
