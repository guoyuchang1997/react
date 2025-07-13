import React,{ useMemo, useCallback, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Store } from '../store/home'
const MyComponent = () => {
  useEffect(()=>{
     Store.Head.update('IStore.name','初始化 参数')
  },[])
  const change =()=>{
     Store.Head.update('IStore.name',`点击修改${new Date()}`)
  }
  return (
    <div className="demo">
   组件1 <button onClick={change}>点击</button>
    </div>
  );
};
export default MyComponent