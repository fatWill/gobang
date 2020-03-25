import * as immutable from "immutable";

import { CHECKER_BOARD_NUMBER } from "../config";

export enum Piece {
  black = "#",
  white = "*"
}

// 创建棋盘数据数据
const setGobangDefaultValue = (number?: number) => {
  const n = number ? number : CHECKER_BOARD_NUMBER;
  const result: Immutable.List<Immutable.List<string>> = immutable.List(
    immutable.Repeat(immutable.List(immutable.Repeat("", n)), n)
  );
  return result;
};

export default {
  setGobangDefaultValue
};
