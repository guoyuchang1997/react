// src/types/store/index.ts
export interface IThemeState {
  // 模式：亮色、深色、跟随系统
  mode: 'light' | 'dark' | 'system';
  // 当前实际是否为深色 (计算后的结果)
  isDarkMode: boolean;
}

export interface IHome {
  IHead: {
    IStore: {
      title: string;
      name: string,
      num: number
    };
  };
  ITheme: IThemeState;
}
