import { IChessPiece, Position, ChessType, ChessPieceType } from '../types/chess';
import { SimulatedPiece } from '../types/pieces/simulatedPiece';

// 棋子基础价值
const PIECE_VALUES: Record<ChessPieceType, number> = {
  [ChessPieceType.KING]: 10000,
  [ChessPieceType.ADVISOR]: 200,
  [ChessPieceType.ELEPHANT]: 200,
  [ChessPieceType.KNIGHT]: 400,
  [ChessPieceType.ROOK]: 900,
  [ChessPieceType.CANNON]: 450,
  [ChessPieceType.PAWN]: 100
};

// 位置加成系数（简化版）
const POSITION_BONUS = 0.1;

// AI玩家类
export class AIPlayer {
  private maxDepth: number;

  constructor(maxDepth: number = 3) {
    this.maxDepth = maxDepth;
  }

  // 获取AI的最佳移动
  getBestMove(pieces: IChessPiece[]): { from: Position; to: Position } | null {
    let bestScore = -Infinity;
    let bestMove = null;

    // 获取所有黑方棋子
    const blackPieces = pieces.filter(piece => piece.type === 'black');

    // 遍历所有可能的移动
    for (const piece of blackPieces) {
      const moves = piece.calculateMoves(pieces);
      for (const move of moves) {
        // 模拟移动
        const simulatedPieces = this.simulateMove(pieces, piece.position, move);
        // 计算分数
        const score = this.minimax(simulatedPieces, this.maxDepth - 1, false, -Infinity, Infinity);

        if (score > bestScore) {
          bestScore = score;
          bestMove = { from: piece.position, to: move };
        }
      }
    }

    return bestMove;
  }

  // Minimax算法实现（带Alpha-Beta剪枝）
  private minimax(
    pieces: IChessPiece[],
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number
  ): number {
    // 达到搜索深度或游戏结束
    if (depth === 0 || this.isGameOver(pieces)) {
      return this.evaluatePosition(pieces);
    }

    if (isMaximizing) {
      let maxScore = -Infinity;
      const blackPieces = pieces.filter(piece => piece.type === 'black');

      for (const piece of blackPieces) {
        const moves = piece.calculateMoves(pieces);
        for (const move of moves) {
          const simulatedPieces = this.simulateMove(pieces, piece.position, move);
          const score = this.minimax(simulatedPieces, depth - 1, false, alpha, beta);
          maxScore = Math.max(maxScore, score);
          alpha = Math.max(alpha, score);
          if (beta <= alpha) break;
        }
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      const redPieces = pieces.filter(piece => piece.type === 'red');

      for (const piece of redPieces) {
        const moves = piece.calculateMoves(pieces);
        for (const move of moves) {
          const simulatedPieces = this.simulateMove(pieces, piece.position, move);
          const score = this.minimax(simulatedPieces, depth - 1, true, alpha, beta);
          minScore = Math.min(minScore, score);
          beta = Math.min(beta, score);
          if (beta <= alpha) break;
        }
      }
      return minScore;
    }
  }

  // 模拟移动并返回新的棋局状态
  private simulateMove(pieces: IChessPiece[], from: Position, to: Position): IChessPiece[] {
    // 将所有棋子转换为模拟棋子
    const simulatedPieces = pieces.map(p => new SimulatedPiece(p));

    const movingPiece = simulatedPieces.find(
      p => p.position.x === from.x && p.position.y === from.y
    );

    if (movingPiece) {
      // 移除被吃掉的棋子
      const index = simulatedPieces.findIndex(
        p => p.position.x === to.x && p.position.y === to.y
      );
      if (index !== -1) {
        simulatedPieces.splice(index, 1);
      }

      // 更新移动棋子的位置
      movingPiece.setPosition(to);
    }

    return simulatedPieces;
  }

  // 评估当前局面分数
  private evaluatePosition(pieces: IChessPiece[]): number {
    let score = 0;

    for (const piece of pieces) {
      const baseValue = PIECE_VALUES[piece.name];
      const positionValue = this.evaluatePositionBonus(piece);
      const value = baseValue + positionValue;

      if (piece.type === 'black') {
        score += value;
      } else {
        score -= value;
      }
    }

    return score;
  }

  // 评估位置加成
  private evaluatePositionBonus(piece: IChessPiece): number {
    let bonus = 0;

    // 根据不同棋子类型计算位置加成
    switch (piece.name) {
      case ChessPieceType.PAWN:
        // 过河的兵价值提升
        if ((piece.type === 'red' && piece.position.y < 5) ||
            (piece.type === 'black' && piece.position.y > 4)) {
          bonus += 50;
        }
        break;
      case ChessPieceType.CANNON:
        // 炮在中路价值较高
        if (piece.position.x >= 3 && piece.position.x <= 5) {
          bonus += 30;
        }
        break;
      case ChessPieceType.KNIGHT:
        // 马在中心位置价值较高
        if (piece.position.x >= 2 && piece.position.x <= 6 &&
            piece.position.y >= 2 && piece.position.y <= 7) {
          bonus += 30;
        }
        break;
    }

    return bonus * POSITION_BONUS;
  }

  // 判断游戏是否结束
  private isGameOver(pieces: IChessPiece[]): boolean {
    const kings = pieces.filter(p => p.name === ChessPieceType.KING);
    return kings.length < 2;
  }
}