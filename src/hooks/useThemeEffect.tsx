// hooks/useThemeEffect.tsx
import { useEffect } from 'react';
import { Store } from '../store/home';

export const useThemeEffect = () => {
  // 1. 获取当前设置的 mode (默认给个 'system')
  // 注意：Store.Theme.use 返回的是 [值, 本地setter]，我们只取值
  const [mode] = Store.Theme.use('mode', localStorage.getItem('theme_mode') || 'system');

  // 2. 核心逻辑：监听 mode 变化并应用样式
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      // 这里的 mode 是从 Zustand 中拿到的最新值
      const currentMode = Store.Theme.get('mode') || 'system';

      const shouldBeDark =
        currentMode === 'system'
          ? mediaQuery.matches
          : currentMode === 'dark';

      // A. 更新 DOM 属性 (供 CSS 变量使用)
      document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');

      // B. 同步计算结果 isDarkMode 到 Store 中 (方便其他组件使用)
      Store.Theme.update('isDarkMode', shouldBeDark);

      // C. 持久化存储
      localStorage.setItem('theme_mode', currentMode);
    };

    // 初始化执行
    applyTheme();

    // 监听系统变化 (只有 mode 为 system 时才需要响应)
    const handleSystemChange = () => {
      if (Store.Theme.get('mode') === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [mode]); // 当 mode 发生变化时重新执行
};