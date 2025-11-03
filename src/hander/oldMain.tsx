import React, { useMemo, useCallback, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Store } from '../store/home'
import { getUserInfo } from '../api/user';
const MyComponent = () => {
  useEffect(() => {
    Store.Head.update('IStore.name', '初始化 参数')
  }, [])
  const change = () => {
    Store.Head.update('IStore.name', `点击修改${new Date()}`)
  }
  const getInfo = async () => {
    // const res = await getUserInfo()
    // console.log(res, '获取的数据');

  }
  return (
    <div className="demo">
      <div onClick={getInfo}>点击获取数据</div>
      组件1 <button onClick={change}>点击修改name</button>
      组件1 <button onClick={() => {
        Store.Head.update('IStore.num', `点击修改${+new Date()}`)
      }}>点击修改num</button>
    </div>
  );
};
export default MyComponent