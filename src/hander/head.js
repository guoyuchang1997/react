import { Button } from 'antd'
import { useEffect, useState } from 'react';
import store from '../reducers/store'
import { sedAciton } from '../reducers/action/index'

const Head = () => {
  // const [count, setcount] = useState()
  // useEffect(() => {
  //   // setcount(3)
  // })
  const hadeclick = () => {
    store.dispatch(sedAciton())
  }
  return (
    <>
      <div onClick={() => { hadeclick() }}>{store.getState().value}这是头部<Button type="primary">Button</Button></div>
    </>
  );
};
export default Head;
