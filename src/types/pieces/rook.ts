import { Position, ChessType, ChessPieceType, BOARD_SIZE, BasePiece } from './base';
import { hasObstacle } from './util';

export class Rook extends BasePiece {
  constructor(
    public type: ChessType,
    public position: Position
  ) {
    super(type, ChessPieceType.ROOK, position);
  }

  calculateMoves(pieces: BasePiece[]): Position[] {
    const moves: Position[] = [];
    
    // 横向移动
    for (let x = 0; x < BOARD_SIZE.width; x++) {
      if (x !== this.position.x) {
        const to = { x, y: this.position.y };
        if (!hasObstacle(this.position, to, pieces)) {
          moves.push(to);
        }
      }
    }
    
    // 纵向移动
    for (let y = 0; y < BOARD_SIZE.height; y++) {
      if (y !== this.position.y) {
        const to = { x: this.position.x, y };
        if (!hasObstacle(this.position, to, pieces)) {
          moves.push(to);
        }
      }
    }
    
    return moves.filter(move => this.isValidMove(move, pieces));
  }
}