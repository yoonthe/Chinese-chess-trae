import { create } from "zustand";
import {
  IChessPiece,
  ChessType,
  Position,
  INITIAL_PIECES,
  ChessPieceType,
} from "../types/chess";
import { AIPlayer } from "./useAIPlayer";

interface GameStore {
  // 游戏时间（秒）
  gameTime: number;
  // 当前移动方
  currentPlayer: ChessType;
  // 选中的棋子
  selectedPiece: IChessPiece | null;
  // 可移动位置列表
  availableMoves: Position[];
  // 棋子列表
  pieces: IChessPiece[];
  // 已死亡的棋子列表
  capturedPieces: {
    red: IChessPiece[];
    black: IChessPiece[];
  };
  // 游戏是否结束
  isGameOver: boolean;
  // 获胜方
  winner: ChessType | null;

  // Actions
  incrementTime: () => void;
  selectPiece: (piece: IChessPiece | null) => void;
  calculateAvailableMoves: (piece: IChessPiece) => void;
  movePiece: (from: Position, to: Position) => void;
  resetGame: () => void;
}

const aiPlayer = new AIPlayer(3);

const useGameStore = create<GameStore>((set, get) => ({
  gameTime: 0,
  currentPlayer: "red",
  selectedPiece: null,
  availableMoves: [],
  pieces: [...INITIAL_PIECES],
  capturedPieces: {
    red: [],
    black: [],
  },
  isGameOver: false,
  winner: null,

  incrementTime: () => set((state) => ({ gameTime: state.gameTime + 1 })),

  selectPiece: (piece) => {
    set({ selectedPiece: piece });
    if (piece) {
      get().calculateAvailableMoves(piece);
    } else {
      set({ availableMoves: [] });
    }
  },

  calculateAvailableMoves: (piece) => {
    const { pieces } = get();
    // 直接使用棋子实例的calculateMoves方法
    const validMoves = piece.calculateMoves(pieces);
    set({ availableMoves: validMoves });
  },

  movePiece: (from, to) => {
    const { pieces, currentPlayer, selectedPiece } = get();
    if (!selectedPiece) return;

    // 检查是否有棋子被吃掉
    const capturedPiece = pieces.find(
      (p) => p.position.x === to.x && p.position.y === to.y
    );

    // 更新棋子位置
    const movingPiece = pieces.find(
      (p) => p.position.x === from.x && p.position.y === from.y
    );
    if (movingPiece) {
      movingPiece.setPosition(to);
    }
    const newPieces = [...pieces];

    // 如果有棋子被吃掉，更新已死亡棋子列表
    if (capturedPiece) {
      const newCapturedPieces = { ...get().capturedPieces };
      // 根据被吃掉棋子的类型来决定添加到对方的已吃掉列表中
      const capturedBy = capturedPiece.type === "red" ? "black" : "red";
      newCapturedPieces[capturedBy].push(capturedPiece);
      set({ capturedPieces: newCapturedPieces });

      // 从棋盘上移除被吃掉的棋子
      const piecesAfterCapture = newPieces.filter(
        (p) =>
          !(
            p.position.x === to.x &&
            p.position.y === to.y &&
            p.type !== currentPlayer
          )
      );
      set({ pieces: piecesAfterCapture });

      // 检查游戏是否结束
      const remainingKings = piecesAfterCapture.filter(
        (p) => p.name === ChessPieceType.KING
      );
      if (remainingKings.length < 2) {
        set({
          isGameOver: true,
          winner: currentPlayer,
        });
      }
    } else {
      set({ pieces: newPieces });
    }

    // 切换当前玩家
    const nextPlayer = currentPlayer === "red" ? "black" : "red";
    set({
      currentPlayer: nextPlayer,
      selectedPiece: null,
      availableMoves: [],
    });

    // 如果切换到黑方（AI），执行AI移动
    if (nextPlayer === "black" && !get().isGameOver) {
      setTimeout(() => {
        const bestMove = aiPlayer.getBestMove(get().pieces);
        if (bestMove) {
          // 先找到要移动的棋子
          const pieceToMove = get().pieces.find(
            (p) =>
              p.position.x === bestMove.from.x &&
              p.position.y === bestMove.from.y
          );
          if (pieceToMove) {
            // 先选中棋子
            get().selectPiece(pieceToMove);
            // 添加短暂延迟后再移动，让玩家能看到选中效果
            setTimeout(() => {
              get().movePiece(bestMove.from, bestMove.to);
            }, 300);
          }
        }
      }, 500);
    }
  },

  resetGame: () =>
    set({
      gameTime: 0,
      currentPlayer: "red",
      selectedPiece: null,
      availableMoves: [],
      pieces: [...INITIAL_PIECES].map((piece) => {
        piece.resetPosition();
        return piece;
      }),
      capturedPieces: {
        red: [],
        black: [],
      },
      isGameOver: false,
      winner: null,
    }),
}));

export default useGameStore;
