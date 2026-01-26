import { useState, useEffect, useRef } from "react"
import "./styles.css"

export function TicTacToe() {
  const turns = { x: 'X', o: 'O' }
  const initialState = new Array(9).fill('')
  const [playArea, setPlayArea] = useState(initialState)
  const [nextTurn, setNextTurn] = useState(turns.x)
  const [winner, setWinner] = useState('')
  const [isDraw, setIsDraw] = useState(false)
  
  const wins = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]         // diagonals
]
const checkWin = (board) =>{
  return wins.some(([a,b,c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c]
  )
}

  const handleClick = (index) => {
    if(checkWin(playArea)) return
    if(playArea[index] !== '' || winner || isDraw) return
    if(nextTurn === turns.x) {
      playArea[index] = turns.x
      setNextTurn(turns.o)
    } else {
      playArea[index] = turns.o
      setNextTurn(turns.x)
    }
    setPlayArea([...playArea])
  }
  
useEffect(() => {
  if(checkWin(playArea) && !winner) {
    const lastTurn = nextTurn === turns.o ? turns.x : turns.o
    setWinner(lastTurn)
  } else if (playArea.every(cell => cell !== '') && !winner) {
    setIsDraw(true)
  }
}, [playArea])

  const handleReset = () => {
    setPlayArea(initialState)
    setWinner('')
    setNextTurn(turns.x)
    setIsDraw(false)
  }

  return (
    <div className='container'>
      <h1>Tic-Tac-Toe</h1>
      <div className='play-area'>
        {playArea.map((square, index) => {
          return (
            <button 
              className='square'
              id='square'
              onClick={() => handleClick(index)}
              disabled={winner || isDraw}
              key={index}
            >
              {square}
            </button>)
        })}
      </div>
      <div>
        {isDraw ? <h2>Draw</h2> : winner && <h2>Winner: {winner}</h2>}
        {!winner && !isDraw && <h2>Next Turn {nextTurn}</h2>}
        <button id='reset' type='reset' onClick={handleReset}>Reset Game</button>
      </div>
    </div>
  )
}