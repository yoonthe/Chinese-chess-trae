import { Rook, Knight, Elephant, Advisor, King, Cannon, Pawn, IChessPiece, ChessType, Position, BOARD_SIZE, ChessPieceType } from './pieces';

export type GameState = {
  pieces: IChessPiece[];
  currentPlayer: ChessType;
  selectedPiece: IChessPiece | null;
  isGameOver: boolean;
  winner: ChessType | null;
};

export const INITIAL_PIECES: IChessPiece[] = [
  // 红方棋子
  new Rook('red', { x: 0, y: 9 }),
  new Knight('red', { x: 1, y: 9 }),
  new Elephant('red', { x: 2, y: 9 }),
  new Advisor('red', { x: 3, y: 9 }),
  new King('red', { x: 4, y: 9 }),
  new Advisor('red', { x: 5, y: 9 }),
  new Elephant('red', { x: 6, y: 9 }),
  new Knight('red', { x: 7, y: 9 }),
  new Rook('red', { x: 8, y: 9 }),
  new Cannon('red', { x: 1, y: 7 }),
  new Cannon('red', { x: 7, y: 7 }),
  new Pawn('red', { x: 0, y: 6 }),
  new Pawn('red', { x: 2, y: 6 }),
  new Pawn('red', { x: 4, y: 6 }),
  new Pawn('red', { x: 6, y: 6 }),
  new Pawn('red', { x: 8, y: 6 }),

  // 黑方棋子
  new Rook('black', { x: 0, y: 0 }),
  new Knight('black', { x: 1, y: 0 }),
  new Elephant('black', { x: 2, y: 0 }),
  new Advisor('black', { x: 3, y: 0 }),
  new King('black', { x: 4, y: 0 }),
  new Advisor('black', { x: 5, y: 0 }),
  new Elephant('black', { x: 6, y: 0 }),
  new Knight('black', { x: 7, y: 0 }),
  new Rook('black', { x: 8, y: 0 }),
  new Cannon('black', { x: 1, y: 2 }),
  new Cannon('black', { x: 7, y: 2 }),
  new Pawn('black', { x: 0, y: 3 }),
  new Pawn('black', { x: 2, y: 3 }),
  new Pawn('black', { x: 4, y: 3 }),
  new Pawn('black', { x: 6, y: 3 }),
  new Pawn('black', { x: 8, y: 3 })
];

export { BOARD_SIZE, ChessPieceType };
export type { IChessPiece, Position, ChessType };