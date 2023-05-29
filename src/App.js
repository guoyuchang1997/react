import { useState } from 'react';
import './App.css';
import Sang from './Btn'
function Baochi (i, val) {
  let arr = []
  arr[val] = i
  console.log(arr);
  return <>
    <button>点击回溯</button>
  </>
}
function Fa () {
  const [fater, cahgefater] = useState(Array(9).fill(null))
  const [isshow, checkt] = useState(true)
  function change (val) {

    let i = [...fater]
    if (i[val]) return
    console.log(i);

    if (isshow) {
      i[val] = 'O'
    } else {
      i[val] = 'X'
    }
    Baochi(i, val)
    cahgefater(i)
    checkt(!isshow)

  }
  const winner = calculateWinner(fater);
  let statu = '';
  if (winner) {
    statu = 'Winner: ' + winner;
  } else {
    statu = 'Next player: ' + (isshow ? 'X' : 'O');
  }
  function calculateWinner (squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  return <>
    <span>{statu}</span>
    <div className='yihang'>
      <Sang value={fater[0]} onClick={() => change(0)} />
      <Sang value={fater[1]} onClick={() => change(1)} />
      <Sang value={fater[2]} onClick={() => change(2)} />
    </div>
    <div className='erhang yihang'>
      <Sang value={fater[3]} onClick={() => change(3)} />
      <Sang value={fater[4]} onClick={() => change(4)} />
      <Sang value={fater[5]} onClick={() => change(5)} />
    </div>
    <div className='sanghang yihang'>
      <Sang value={fater[6]} onClick={() => change(6)} />
      <Sang value={fater[7]} onClick={() => change(7)} />
      <Sang value={fater[8]} onClick={() => change(8)} />
    </div>
    <Baochi />
  </>
}
export default Fa;
