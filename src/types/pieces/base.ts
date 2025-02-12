export type Position = {
  x: number;
  y: number;
};

export const BOARD_SIZE = {
  width: 9,
  height: 10
};

export type ChessType = 'red' | 'black';

export enum ChessPieceType {
  ROOK = '车',     // 车 / 車
  KNIGHT = '马',   // 马 / 馬
  ELEPHANT = '象', // 象 / 相
  ADVISOR = '士',  // 士 / 仕
  KING = '将',     // 将 / 帅
  CANNON = '炮',   // 炮
  PAWN = '卒'      // 卒 / 兵
}

export interface IChessPiece {
  type: ChessType;
  name: ChessPieceType;
  position: Position;
  displayName: string;
  calculateMoves(pieces: IChessPiece[]): Position[];
  setPosition(position: Position): void;
  resetPosition(): void;
}

export abstract class BasePiece implements IChessPiece {
  public displayName: string;
  private initPosition: Position;

  constructor(
    public type: ChessType,
    public name: ChessPieceType,
    public position: Position
  ) {
    this.displayName = this.getDisplayName();
    this.initPosition = { ...position };
  }

  protected getDisplayName(): string {
    switch (this.name) {
      case ChessPieceType.ROOK:
        return this.type === 'red' ? '车' : '車';
      case ChessPieceType.KNIGHT:
        return this.type === 'red' ? '马' : '馬';
      case ChessPieceType.ELEPHANT:
        return this.type === 'red' ? '相' : '象';
      case ChessPieceType.ADVISOR:
        return this.type === 'red' ? '仕' : '士';
      case ChessPieceType.KING:
        return this.type === 'red' ? '帅' : '将';
      case ChessPieceType.CANNON:
        return this.type === 'red' ? '炮' : '砲';
      case ChessPieceType.PAWN:
        return this.type === 'red' ? '兵' : '卒';
      default:
        return '';
    }
  }

  abstract calculateMoves(pieces: IChessPiece[]): Position[];

  setPosition(position: Position): void {
    this.position = position;
  }

  resetPosition(): void {
    this.position = { ...this.initPosition };
  }

  protected isValidMove(move: Position, pieces: IChessPiece[]): boolean {
    const pieceAtPosition = pieces.find(
      p => p.position.x === move.x && p.position.y === move.y
    );
    return !pieceAtPosition || pieceAtPosition.type !== this.type;
  }
}