/* eslint-disable react-hooks/rules-of-hooks */
import { IHome } from '../types/store';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { create } from 'zustand';
import { eventBus } from './eventBus';


// 辅助类型，用于递归地键入嵌套对象路径
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
  ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
  : `${Key}`;
}[keyof ObjectType & (string | number)];

// 获取路径对应的类型
type PathType<T, Path extends string> =
  Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
  ? Rest extends keyof (T[Key])
  ? PathType<T[Key], Rest>
  : T[Key] extends object
  ? PathType<T[Key], Rest>
  : never
  : never
  : Path extends keyof T
  ? T[Path]
  : never;

// 定义 store 类型接口
interface StoreState {
  [key: string]: any;
  update: <T>(path: string, data: T) => void;
  get: <T>(path: string) => T | undefined;
}

// Zustand store
const useStore = create<StoreState>((set, get) => ({
  update: (path, data) => {
    set(state => {
      const keys = path.split('.');
      const newState = { ...state };
      let currentState = newState;

      keys.slice(0, -1).forEach(key => {
        currentState[key] = currentState[key] ? { ...currentState[key] } : {};
        currentState = currentState[key];
      });

      currentState[keys[keys.length - 1]] = data;

      return newState;
    });
  },
get: <T,>(path: string): T | undefined =>{
    const keys = path.split('.');
    let currentState = get();
    for (const key of keys) {
      if (currentState[key] === undefined) return undefined;
      currentState = currentState[key];
    }
    return currentState as unknown as T;
  }
}));

// 添加 E 受限于对象类型
function getModuleStore<E extends object>(moduleName: string) {
  return {
    /** 更新数据 */
    update: function update<T extends NestedKeyOf<E> & string>(path: T, data: any): void {
      useStore.getState().update(`${moduleName}.${path}`, data);
    },
    /** 获取数据 */
    get: function get<T extends NestedKeyOf<E> & string>(path: T): PathType<E, T> | undefined {
      return useStore.getState().get<PathType<E, T>>(`${moduleName}.${path}`);
    },
    /** hook 获取数据 */
    use: function use<T extends NestedKeyOf<E> & string>(path: T, defaultData?: any): [PathType<E, T>, Dispatch<SetStateAction<any>>] {
      const [state, setState] = useState<PathType<E, T>>(() => {
        return useStore.getState().get(`${moduleName}.${path}`) ?? defaultData!;
      })

      useEffect(() => {
        let oldValue:any;
        const unsubscribe = useStore.subscribe((newState) => {
          const newValue = useStore.getState().get<PathType<E, T>>(`${moduleName}.${path}`);
          if (newValue !== undefined && newValue !== oldValue) {
            setState(newValue);
          }
          oldValue = newValue;
        });
        return () => unsubscribe();
      }, [moduleName, path]);
      return [state, setState];
    },
    emit: function emit(event: string, ...args: any[]) {
      eventBus.emit(`${moduleName}.${event}`, ...args);
    }
  };
}

/** 数据存储 */
export const Store = {
  /** 页头 */
  Head:  getModuleStore<IHome['IHead']>('IHead.IStore')
}
{/* //@ts-ignore
window._Store = Store; */}