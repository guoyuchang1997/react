import { useState } from 'react';
import './Funcss.css'
function Func ({ value, onClick }) {
  return <>
    <span onClick={onClick}>{value}</span>
  </>
}
export default Func


