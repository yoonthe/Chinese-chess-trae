import { IChessPiece, Position } from "./base";

// 检查路径上是否有棋子的工具函数
export function hasObstacle(
  from: Position,
  to: Position,
  pieces: IChessPiece[]
): number {
  if (from.x === to.x && from.y === to.y) return 0;

  const positions: Position[] = [];
  if (from.x === to.x) {
    // 垂直移动
    const start = Math.min(from.y, to.y);
    const end = Math.max(from.y, to.y);
    for (let y = start + 1; y < end; y++) {
      positions.push({ x: from.x, y });
    }
  } else if (from.y === to.y) {
    // 水平移动
    const start = Math.min(from.x, to.x);
    const end = Math.max(from.x, to.x);
    for (let x = start + 1; x < end; x++) {
      positions.push({ x, y: from.y });
    }
  }

  return positions.reduce((count, pos) => {
    const hasPiece = pieces.some(
      (p) => p.position.x === pos.x && p.position.y === pos.y
    );
    return count + (hasPiece ? 1 : 0);
  }, 0);
}
