import { Position, ChessType, ChessPieceType, IChessPiece } from './base';
import { BasePiece } from './base';

// 士的棋子类
export class Advisor extends BasePiece {
  constructor(type: ChessType, position: Position) {
    super(type, ChessPieceType.ADVISOR, position);
  }

  calculateMoves(pieces: IChessPiece[]): Position[] {
    const moves: Position[] = [];
    const offsets = [
      { x: -1, y: -1 }, { x: -1, y: 1 },
      { x: 1, y: -1 }, { x: 1, y: 1 }
    ];

    offsets.forEach(offset => {
      const newX = this.position.x + offset.x;
      const newY = this.position.y + offset.y;
      if (
        newX >= 3 && newX <= 5 &&
        ((this.type === 'red' && newY >= 7 && newY <= 9) ||
         (this.type === 'black' && newY >= 0 && newY <= 2))
      ) {
        moves.push({ x: newX, y: newY });
      }
    });

    return moves.filter(move => this.isValidMove(move, pieces));
  }
}