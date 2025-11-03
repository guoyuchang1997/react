import { useMemo, useCallback, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Store } from '../store/home'
const MyComponent = () => {
  const [IStore] = Store.Head.use('IStore')
  return (
    <div className="demo">
      内容4 {JSON.stringify(IStore)}
    </div>
  );
};
export default MyComponent