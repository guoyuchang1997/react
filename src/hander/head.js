import { useMemo, useCallback, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Button } from 'antd'
// import { useEffect, useState } from 'react';
import store from '../reducers/store'
import { sedAciton, addfalse } from '../reducers/action/index'
import { useSelector } from 'react-redux'
// const Child = forwardRef(function Child(props, ref) {
//   let [text, setText] = useState("child");
//   const submit = () => {
//     console.log("submit")
//   };

//   useImperativeHandle(ref, () => {
//     return {
//       text,
//       submit,
//     };
//   });

//   return (
//     <div className="child-box">
//       <span>Child</span>
//     </div>
//   );
// });
const Chidrin = (props) => {
  console.log('子组件被渲染了');
  return <>
    <div onClick={props.click}>222</div>
  </>
}
const App = () => {
  const [data, setdata] = useState([
    { name: '1', sex: '男' },
    { name: '2', sex: ' nv ' },
    { name: '3', sex: '男' },
  ])
  const [conten, setconten] = useState(1)
  useMemo(() => {
    console.log('重新触发了');
    return data
  }, [data])
  useEffect(() => {
    // console.log(x.current.text)
  }, []);
  const change = useCallback(() => {
    console.log('组件被重新触发');
  }, [conten])
  return (
    <div className="demo">
      {conten}
      <button onClick={() => setconten(Math.random())}>conten触发</button>
      <Chidrin />
    </div>
  );
};
export default App
