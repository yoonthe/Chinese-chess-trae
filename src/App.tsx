import { useEffect } from 'react';
import Board from './components/Board';
import useGameStore from './models/useGameStore';
import { IChessPiece, Position } from './types/chess';
import './App.css';

function App() {
  const {
    gameTime,
    currentPlayer,
    selectedPiece,
    availableMoves,
    capturedPieces,
    isGameOver,
    winner,
    selectPiece,
    movePiece,
    resetGame,
    incrementTime
  } = useGameStore();

  // 处理游戏时间
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isGameOver) {
        incrementTime();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, incrementTime]);

  // 处理棋子点击
  const handlePieceClick = (piece: IChessPiece | null) => {
    if (isGameOver) return;
    if (!piece) {
      selectPiece(null);
      return;
    }
    if (piece.type === currentPlayer) {
      selectPiece(piece);
    } else if (selectedPiece) {
      // 如果已选中己方棋子，且点击的是对方棋子，尝试吃子
      const isValidMove = availableMoves.some(
        move => move.x === piece.position.x && move.y === piece.position.y
      );
      if (isValidMove) {
        movePiece(selectedPiece.position, piece.position);
      }
    }
  };

  // 处理位置点击
  const handlePositionClick = (position: Position) => {
    if (isGameOver || !selectedPiece) return;

    const isValidMove = availableMoves.some(
      move => move.x === position.x && move.y === position.y
    );
    if (isValidMove) {
      movePiece(selectedPiece.position, position);
    }
  };

  // 格式化游戏时间
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app">
      <div className="game-info">
        <h1>中国象棋</h1>
        <p>游戏时间: {formatTime(gameTime)}</p>
        <p>当前回合: {currentPlayer === 'red' ? '红方' : '黑方'}</p>
        {isGameOver ? (
          <div>
            <p>游戏结束！{winner === 'red' ? '红方' : '黑方'}获胜！</p>
            <button onClick={resetGame}>重新开始</button>
          </div>
        ) :  <button onClick={resetGame}>重制游戏</button>}
      </div>

      <div className="game-board">
        <div className="captured-pieces">
          <div className="red-captured">
            已吃掉的红子：
            {capturedPieces.red.map((piece, index) => (
              <span key={index}>{piece.name}</span>
            ))}
          </div>
          <div className="black-captured">
            已吃掉的黑子：
            {capturedPieces.black.map((piece, index) => (
              <span key={index}>{piece.name}</span>
            ))}
          </div>
        </div>

        <Board
          onPieceClick={handlePieceClick}
          onPositionClick={handlePositionClick}
        />
      </div>
    </div>
  )
}

export default App
