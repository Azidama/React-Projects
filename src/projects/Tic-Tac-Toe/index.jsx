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
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ]

  const checkWin = (board) => 
    wins.some(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c])

  const handleClick = (index) => {
    if(playArea[index] !== '' || winner || isDraw) return

    const current = nextTurn
    const newBoard = [...playArea]
    newBoard[index] = current
    setPlayArea(newBoard)
    setNextTurn(current === turns.x ? turns.o : turns.x)

    if(checkWin(newBoard)) {
      setWinner(current)
    } else if(newBoard.every(cell => cell !== '')) {
      setIsDraw(true)
    }
  }

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
        {playArea.map((square, index) => (
          <button 
            className='square'
            onClick={() => handleClick(index)}
            disabled={winner || isDraw}
            key={index}
          >
            {square}
          </button>
        ))}
      </div>
      <div>
        {isDraw ? <h2>Draw</h2> : winner && <h2>Winner: {winner}</h2>}
        {!winner && !isDraw && <h2>Next Turn {nextTurn}</h2>}
        <button onClick={handleReset}>Reset Game</button>
      </div>
    </div>
  )
}
