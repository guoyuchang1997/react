import { useMemo, useCallback, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Button } from 'antd'
// import { useEffect, useState } from 'react';
import store from '../reducers/store'
import { sedAciton, addfalse } from '../reducers/action/index'
import { useSelector } from 'react-redux'
import Main from './Main'
import Main2 from './Main2'
import Main3 from './Main3'
import Main4 from './Main34444'
const App = () => {
  return (
    <div className="demo">
     <Main />
     <Main2 />
     <Main3 />
     <Main4 />
    </div>
  );
};
export default App
