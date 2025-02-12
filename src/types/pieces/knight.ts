import { Position, BOARD_SIZE, ChessType, ChessPieceType, BasePiece, IChessPiece } from './base';

// 马的棋子类
export class Knight extends BasePiece {

  constructor(
    public type: ChessType,
    public position: Position
  ) {
    super(type, ChessPieceType.KNIGHT, position);
  }

  calculateMoves(pieces: IChessPiece[]): Position[] {
    const moves: Position[] = [];
    const offsets = [
      { x: -2, y: -1 }, { x: -2, y: 1 },
      { x: 2, y: -1 }, { x: 2, y: 1 },
      { x: -1, y: -2 }, { x: -1, y: 2 },
      { x: 1, y: -2 }, { x: 1, y: 2 }
    ];

    offsets.forEach(offset => {
      const newX = this.position.x + offset.x;
      const newY = this.position.y + offset.y;
      if (newX >= 0 && newX < BOARD_SIZE.width && newY >= 0 && newY < BOARD_SIZE.height) {
        const legX = this.position.x + (Math.abs(offset.x) === 2 ? Math.sign(offset.x) : 0);
        const legY = this.position.y + (Math.abs(offset.y) === 2 ? Math.sign(offset.y) : 0);
        const hasLegObstacle = pieces.some(
          p => p.position.x === legX && p.position.y === legY
        );
        if (!hasLegObstacle) {
          moves.push({ x: newX, y: newY });
        }
      }
    });

    return moves.filter(move => this.isValidMove(move, pieces));
  }
}