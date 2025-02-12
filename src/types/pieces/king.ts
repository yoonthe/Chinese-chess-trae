import { BasePiece, Position, ChessType, ChessPieceType, IChessPiece } from './base';

// 将/帅的移动规则
export class King extends BasePiece {

  constructor(type: ChessType, position: Position) {
    super(type, ChessPieceType.KING, position);
  }

  calculateMoves(pieces: IChessPiece[]): Position[] {
    const moves: Position[] = [];
    const offsets = [
      { x: 0, y: -1 }, { x: 0, y: 1 },
      { x: -1, y: 0 }, { x: 1, y: 0 }
    ];

    const oppositeKing = pieces.find(
      p => p.name === ChessPieceType.KING && p.type !== this.type
    );

    offsets.forEach(offset => {
      const newX = this.position.x + offset.x;
      const newY = this.position.y + offset.y;
      if (
        newX >= 3 && newX <= 5 &&
        ((this.type === 'red' && newY >= 7 && newY <= 9) ||
         (this.type === 'black' && newY >= 0 && newY <= 2))
      ) {
        if (oppositeKing && newX === oppositeKing.position.x) {
          const start = Math.min(newY, oppositeKing.position.y);
          const end = Math.max(newY, oppositeKing.position.y);
          const hasPieceBetween = pieces.some(
            p => p.position.x === newX &&
                p.position.y > start &&
                p.position.y < end
          );
          if (hasPieceBetween) {
            moves.push({ x: newX, y: newY });
          }
        } else {
          moves.push({ x: newX, y: newY });
        }
      }
    });

    return moves.filter(move => this.isValidMove(move, pieces));
  }
}