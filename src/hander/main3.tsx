import { useMemo, useCallback, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Store } from '../store/home'
const MyComponent = () => {
   const [name] =  Store.Head.use('IStore.name')
   useEffect(()=>{
    console.log('数据变化了',name);
    
   },[name])
  return (
    <div className="demo">
      组件3 {name}
    </div>
  );
};
export default MyComponent