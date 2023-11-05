import { Button } from 'antd'
import { useEffect, useState } from 'react';
import store from '../reducers/store'
import { sedAciton, addfalse } from '../reducers/action/index'
import { useSelector } from 'react-redux'

const Head = () => {
  // const [count, setcount] = useState()
  // useEffect(() => {
  //   // setcount(3)
  // })
  const todos = useSelector(state => state.todos);
  const hadeclick = (id) => {
    store.dispatch(addfalse(id))
  }
  return (
    <>
      {todos.map(item => {
        return <div key={item.id}>
          <li> {item.text}</li>
          <div onClick={() => { hadeclick(item.id) }}><Button type="primary">Button</Button></div >
        </div>
      })}
    </>
  );
};
export default Head;
