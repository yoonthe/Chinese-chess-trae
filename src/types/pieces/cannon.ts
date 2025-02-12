import { BasePiece, Position, BOARD_SIZE, ChessType, ChessPieceType, IChessPiece } from './base';
import { hasObstacle } from './util';

// 炮的棋子类
export class Cannon extends BasePiece {

  constructor(
    type: ChessType,
    position: Position
  ) {
    super(type, ChessPieceType.CANNON, position);
  }

  calculateMoves(pieces: IChessPiece[]): Position[] {
    const moves: Position[] = [];
    
    // 横向移动
    for (let x = 0; x < BOARD_SIZE.width; x++) {
      if (x !== this.position.x) {
        const to = { x, y: this.position.y };
        const obstacles = hasObstacle(this.position, to, pieces);
        const targetPiece = pieces.find(
          p => p.position.x === to.x && p.position.y === to.y
        );

        if (!targetPiece && obstacles === 0) {
          moves.push(to);
        } else if (targetPiece && targetPiece.type !== this.type && obstacles === 1) {
          moves.push(to);
        }
      }
    }
    
    // 纵向移动
    for (let y = 0; y < BOARD_SIZE.height; y++) {
      if (y !== this.position.y) {
        const to = { x: this.position.x, y };
        const obstacles = hasObstacle(this.position, to, pieces);
        const targetPiece = pieces.find(
          p => p.position.x === to.x && p.position.y === to.y
        );

        if (!targetPiece && obstacles === 0) {
          moves.push(to);
        } else if (targetPiece && targetPiece.type !== this.type && obstacles === 1) {
          moves.push(to);
        }
      }
    }
    
    return moves;
  }
}