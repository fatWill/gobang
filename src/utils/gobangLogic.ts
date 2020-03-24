/**
 * 获取棋子详细的参数
 * @param piece 落子坐标点和棋子类型 '1-1-*'
 */
const getPieceParam = (piece: string) => {
  const pieces = piece.split("-");
  const row = +pieces[0];
  const col = +pieces[1];
  const pieceType = pieces[2];
  return {
    row,
    col,
    pieceType
  };
};

/**
 * 判断该点是否存在于棋盘上
 * @param gobangValue 棋盘值
 * @param piece 落子坐标点和棋子类型 '1-1-*'
 */
const hasEqualPiece = (
  gobangValue: Immutable.List<string[]>,
  piece: string
) => {
  const gobang: string[][] = gobangValue.toJS();
  const point = getPieceParam(piece);
  const rows = gobang[point.row];
  if (rows) {
    const value = rows[point.col];
    return value === point.pieceType;
  } else {
    return false;
  }
};

/**
 * 判断是否胜利
 * @param gobangValue 棋盘值
 * @param piece 落子坐标点和棋子类型 '1-1-*'
 */
const isVictory = (
  gobangValue: Immutable.List<string[]>,
  dropPiece: string
) => {
  // 先声明判断连珠类型
  enum ConnectType {
    row, // 竖排连珠
    col, // 横排连珠
    ltrb, // 左上右下连珠
    lbrt // 左下右上连珠
  }

  // 获取五子连珠的判断
  const getFiveConnect = (
    type: ConnectType,
    options?: { prev: string | null; next: string | null; count: number }
  ): boolean => {
    // 根据类型传入相对应的值并递归
    const _recursive = (
      prev: string | null,
      next: string | null,
      count: number
    ) => {
      const prevPoint = prev && getPieceParam(prev);
      const nextPoint = next && getPieceParam(next);
      switch (type) {
        case ConnectType.row:
          return getFiveConnect(type, {
            prev: prevPoint
              ? `${prevPoint.row - 1}-${prevPoint.col}-${prevPoint.pieceType}`
              : null,
            next: nextPoint
              ? `${nextPoint.row + 1}-${nextPoint.col}-${nextPoint.pieceType}`
              : null,
            count
          });
        case ConnectType.col:
          return getFiveConnect(type, {
            prev: prevPoint
              ? `${prevPoint.row}-${prevPoint.col - 1}-${prevPoint.pieceType}`
              : null,
            next: nextPoint
              ? `${nextPoint.row}-${nextPoint.col + 1}-${nextPoint.pieceType}`
              : null,
            count
          });
        case ConnectType.ltrb:
          return getFiveConnect(type, {
            prev: prevPoint
              ? `${prevPoint.row - 1}-${prevPoint.col - 1}-${
                  prevPoint.pieceType
                }`
              : null,
            next: nextPoint
              ? `${nextPoint.row + 1}-${nextPoint.col + 1}-${
                  nextPoint.pieceType
                }`
              : null,
            count
          });
        case ConnectType.lbrt:
          return getFiveConnect(type, {
            prev: prevPoint
              ? `${prevPoint.row + 1}-${prevPoint.col - 1}-${
                  prevPoint.pieceType
                }`
              : null,
            next: nextPoint
              ? `${nextPoint.row - 1}-${nextPoint.col + 1}-${
                  nextPoint.pieceType
                }`
              : null,
            count
          });
      }
    };

    if (!options) {
      return _recursive(dropPiece, dropPiece, 0);
    }

    let count = options.count;

    const hasPrev = options.prev
      ? hasEqualPiece(gobangValue, options.prev)
      : false;
    const hasNext = options.next
      ? hasEqualPiece(gobangValue, options.next)
      : false;

    // 如果两边都已经到瓶颈了，没有找到值了就返回 否则继续递归
    if (!hasPrev && !hasNext) {
      return count >= 4;
    } else {
      hasPrev && count++;
      hasNext && count++;
      return _recursive(options.prev, options.next, count);
    }
  };

  const result =
    getFiveConnect(ConnectType.row) ||
    getFiveConnect(ConnectType.col) ||
    getFiveConnect(ConnectType.ltrb) ||
    getFiveConnect(ConnectType.lbrt) ||
    false;

  return result;
};

export default {
  isVictory,
  getPieceParam
};
