import { Position, BOARD_SIZE, ChessType, ChessPieceType, BasePiece, IChessPiece } from './base';

// 兵/卒的棋子类
export class Pawn extends BasePiece {

  constructor(
    public type: ChessType,
    public position: Position
  ) {
    super(type, ChessPieceType.PAWN, position);
  }

  calculateMoves(pieces: IChessPiece[]): Position[] {
    const moves: Position[] = [];
    const direction = this.type === 'red' ? -1 : 1;
    const hasCrossedRiver = this.type === 'red' ? this.position.y < 5 : this.position.y > 4;

    // 向前走
    const forwardY = this.position.y + direction;
    if ((this.type === 'red' && forwardY >= 0) ||
        (this.type === 'black' && forwardY < BOARD_SIZE.height)) {
      moves.push({ x: this.position.x, y: forwardY });
    }

    // 过河后可以左右走
    if (hasCrossedRiver) {
      if (this.position.x > 0) {
        moves.push({ x: this.position.x - 1, y: this.position.y });
      }
      if (this.position.x < BOARD_SIZE.width - 1) {
        moves.push({ x: this.position.x + 1, y: this.position.y });
      }
    }

    return moves.filter(move => this.isValidMove(move, pieces));
  }
}