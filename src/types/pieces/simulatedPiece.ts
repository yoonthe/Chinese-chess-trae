import { IChessPiece, Position } from './base';

// 用于AI计算的模拟棋子类
export class SimulatedPiece implements IChessPiece {
  private simulatedPosition: Position;

  constructor(private realPiece: IChessPiece) {
    this.simulatedPosition = { ...realPiece.position };
  }

  get type() {
    return this.realPiece.type;
  }

  get name() {
    return this.realPiece.name;
  }

  get position() {
    return this.simulatedPosition;
  }

  get displayName() {
    return this.realPiece.displayName;
  }

  setPosition(position: Position): void {
    this.simulatedPosition = { ...position };
  }

  resetPosition(): void {
    this.simulatedPosition = { ...this.realPiece.position };
  }

  calculateMoves(pieces: IChessPiece[]): Position[] {
    // 将所有棋子转换为它们当前的模拟位置
    const simulatedPieces = pieces.map(p => {
      if (p instanceof SimulatedPiece) {
        return p;
      }
      return new SimulatedPiece(p);
    });
    return this.realPiece.calculateMoves(simulatedPieces);
  }
}