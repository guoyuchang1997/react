# 主题系统架构文档

## 概述

本项目的主题系统采用现代、可扩展的架构设计，支持浅色/深色/跟随系统三种模式。

## 架构设计

```
src/theme/
├── theme.config.ts      # 主题配置（TypeScript 类型定义 + Token）
├── ThemeProvider.tsx    # React Context Provider + Hooks
├── theme.css           # 全局主题样式
├── index.ts            # 导出入口
└── README.md           # 本文档
```

## 核心特性

### 1. 类型安全
```typescript
type ThemeMode = 'light' | 'dark' | 'system';
type Theme = 'light' | 'dark';

interface ThemeTokens {
  bg: string;
  text: string;
  border: string;
  // ... 更多设计 Token
}
```

### 2. 统一的设计 Token
所有颜色、间距等设计元素都集中定义在 `theme.config.ts` 中：
- `lightTheme`: 浅色模式 Token
- `darkTheme`: 深色模式 Token

### 3. React Context API
使用 `ThemeProvider` 包裹应用，提供全局主题状态：
```typescript
const { mode, theme, isDark, setMode, toggleTheme } = useTheme();
```

### 4. CSS 变量注入
主题 Token 自动注入为 CSS 变量，格式为 `--theme-{key}`：
```css
background-color: var(--theme-bg, #fff);
color: var(--theme-text, #333);
```

### 5. Ant Design 集成
自动切换 Ant Design 的主题算法：
```typescript
<ConfigProvider
  theme={{
    algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
    token: { colorPrimary: theme.primaryColor }
  }}
>
```

## 使用方式

### 基础使用

```tsx
import { useTheme } from '@/theme';

function MyComponent() {
  const { mode, theme, isDark, setMode, toggleTheme } = useTheme();

  return (
    <div>
      <p>当前模式: {mode}</p>
      <p>是否深色: {isDark ? '是' : '否'}</p>
      <button onClick={toggleTheme}>切换主题</button>
      <button onClick={() => setMode('light')}>浅色</button>
      <button onClick={() => setMode('dark')}>深色</button>
      <button onClick={() => setMode('system')}>跟随系统</button>
    </div>
  );
}
```

### CSS 中使用

```css
.my-component {
  background-color: var(--theme-bg, #fff);
  color: var(--theme-text, #333);
  border: 1px solid var(--theme-border, rgba(0, 0, 0, 0.1));
  transition: var(--theme-transition);
}
```

### 添加新的主题 Token

1. 在 `theme.config.ts` 的 `ThemeTokens` 接口中添加新字段
2. 在 `lightTheme` 和 `darkTheme` 中定义对应的值
3. 在 CSS 中使用 `var(--theme-{fieldName}, defaultValue)`

```typescript
// 1. 定义接口
interface ThemeTokens {
  // ... 现有字段
  myNewColor: string;
}

// 2. 定义值
export const lightTheme: ThemeTokens = {
  // ... 现有值
  myNewColor: '#ff0000',
};

export const darkTheme: ThemeTokens = {
  // ... 现有值
  myNewColor: '#cc0000',
};

// 3. CSS 中使用
.my-element {
  color: var(--theme-myNewColor, #ff0000);
}
```

## 系统主题检测

当 `mode` 设置为 `'system'` 时，自动监听系统主题变化：

```typescript
// 自动监听系统主题变化
mediaQuery.addEventListener('change', handleSystemChange);
```

## 持久化存储

主题选择自动保存到 `localStorage`：
- Key: `theme-mode`
- Values: `'light'` | `'dark'` | `'system'`

## 向后兼容

为了兼容旧的 Zustand store，`useThemeEffect` hook 会自动同步主题状态：

```typescript
import { useThemeEffect } from '@/theme';

function App() {
  useThemeEffect(); // 同步到 Zustand store
  // ...
}
```

## 最佳实践

### ✅ 推荐

```tsx
// 使用 useTheme hook
const { setMode } = useTheme();
setMode('dark');
```

### ❌ 不推荐

```tsx
// 直接操作 localStorage
localStorage.setItem('theme-mode', 'dark');
// 这样不会触发组件更新！
```

## 性能优化

1. **CSS 变量**: 主题切换通过 CSS 变量实现，无需重新渲染组件
2. **防抖**: 系统主题监听使用原生事件，性能开销极小
3. **懒加载**: 主题 Token 只在初始化时计算一次

## 扩展性

### 添加新主题模式

未来可以轻松扩展支持更多主题模式，例如：

```typescript
type ThemeMode = 'light' | 'dark' | 'system' | 'high-contrast';

export const highContrastTheme: ThemeTokens = {
  bg: '#000000',
  text: '#ffffff',
  // ...
};
```

### 动态主题

支持运行时动态修改主题颜色：

```typescript
const updateThemeColor = (primary: string) => {
  document.documentElement.style.setProperty('--theme-primaryColor', primary);
};
```

## 常见问题

**Q: 为什么不用 CSS-in-JS？**
A: CSS 变量方案性能更好，主题切换无需重新渲染，且更易于调试。

**Q: 如何支持服务端渲染（SSR）？**
A: `getSystemTheme` 函数已处理 SSR 场景，默认返回 `'light'`。

**Q: 主题切换时页面闪烁怎么办？**
A: 确保在 `<head>` 中尽早注入主题 CSS，避免 FOUC (Flash of Unstyled Content)。

## 维护者

如有问题或建议，请联系团队架构师。
