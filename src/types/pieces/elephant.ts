import { BasePiece, Position, BOARD_SIZE, ChessType, ChessPieceType, IChessPiece } from './base';

// 象的棋子类
export class Elephant extends BasePiece {

  constructor(
    type: ChessType,
    position: Position
  ) {
    super(type, ChessPieceType.ELEPHANT, position);
  }

  calculateMoves(pieces: IChessPiece[]): Position[] {
    const moves: Position[] = [];
    const offsets = [
      { x: -2, y: -2 }, { x: -2, y: 2 },
      { x: 2, y: -2 }, { x: 2, y: 2 }
    ];

    offsets.forEach(offset => {
      const newX = this.position.x + offset.x;
      const newY = this.position.y + offset.y;
      if (
        newX >= 0 && newX < BOARD_SIZE.width &&
        ((this.type === 'red' && newY >= 5 && newY < BOARD_SIZE.height) ||
         (this.type === 'black' && newY >= 0 && newY < 5))
      ) {
        const eyeX = this.position.x + offset.x / 2;
        const eyeY = this.position.y + offset.y / 2;
        const hasEyeObstacle = pieces.some(
          p => p.position.x === eyeX && p.position.y === eyeY
        );
        if (!hasEyeObstacle) {
          moves.push({ x: newX, y: newY });
        }
      }
    });

    return moves.filter(move => this.isValidMove(move, pieces));
  }
}