import React from 'react';
import { Position, BOARD_SIZE, IChessPiece } from '../types/chess';
import useGameStore from '../models/useGameStore';
import styles from './Board.module.css';
import CrossMark from './CrossMark';

interface BoardProps {
  onPieceClick: (piece: IChessPiece) => void;
  onPositionClick: (position: Position) => void;
}

const CROSS_MARKS = [
  // 炮位标记
  { left: 60, top: 420 },
  { left: 420, top: 420 },
  { left: 60, top: 120 },
  { left: 420, top: 120 },
  // 兵位标记
  { left: 0, top: 360 },
  { left: 120, top: 360 },
  { left: 240, top: 360 },
  { left: 360, top: 360 },
  { left: 480, top: 360 },
  // 卒位标记
  { left: 0, top: 180 },
  { left: 120, top: 180 },
  { left: 240, top: 180 },
  { left: 360, top: 180 },
  { left: 480, top: 180 }
];

const Board: React.FC<BoardProps> = ({ 
  onPieceClick, 
  onPositionClick 
}) => {
  const { pieces, selectedPiece, availableMoves, currentPlayer } = useGameStore();

  const renderPieces = () => {
    return pieces.map((piece, index) => {
      const isSelected = selectedPiece && selectedPiece.position.x === piece.position.x && selectedPiece.position.y === piece.position.y;
      const isCapturable = selectedPiece && piece.type !== selectedPiece.type && 
        availableMoves.some(move => move.x === piece.position.x && move.y === piece.position.y);
      const isDisabled = piece.type !== currentPlayer;

      const style = {
        left: piece.position.x * 60,
        top: piece.position.y * 60
      };

      return (
        <div
          key={index}
          className={`${styles.chess_piece} ${styles[piece.type]} 
            ${isSelected ? styles.selected : ''} 
            ${isCapturable ? styles.capturable : ''}
            ${isDisabled ? styles.disabled : ''}`}
          style={style}
          onClick={() => onPieceClick(piece)}
        >
          {piece.displayName}
        </div>
      );
    });
  };

  const renderAvailableMoves = () => {
    return availableMoves.map((move, index) => {
      const isOccupied = pieces.some(p => p.position.x === move.x && p.position.y === move.y);
      if (isOccupied) return null;

      const style = {
        left: move.x * 60,
        top: move.y * 60
      };

      return (
        <div
          key={`move-${index}`}
          className={`${styles.available_move} ${selectedPiece?.type === 'red' ? styles.red_move : styles.black_move}`}
          style={style}
          onClick={() => onPositionClick(move)}
        />
      );
    });
  };

  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / 60);
    const y = Math.round((e.clientY - rect.top) / 60);

    if (x >= 0 && x < BOARD_SIZE.width && y >= 0 && y < BOARD_SIZE.height) {
      onPositionClick({ x, y });
    }
  };

  return (
    <div className={styles.board}>
      <div className={styles.board_grid} onClick={handleBoardClick}>
        <div className={`${styles.river_text} ${styles.left}`}>楚河</div>
        <div className={`${styles.river_text} ${styles.right}`}>汉界</div>
        {CROSS_MARKS.map((position, index) => (
          <CrossMark
            key={`cross-${index}`}
            className={styles.cross_mark}
            style={position}
          />
        ))}
        <div className={styles.cross_line} />
        <div className={styles.board_lines_red} />
        <div className={styles.board_lines_black} />
        {renderAvailableMoves()}
        {renderPieces()}
      </div>
    </div>
  );
};

export default Board;