import { CHECKER_BOARD_NUMBER } from "../config";
export enum Piece {
  black = "#",
  white = "*"
}

// 创建棋盘数据数据
const setGobangDefaultValue = (number?: Number) => {
  const n = number ? number : CHECKER_BOARD_NUMBER;
  const rows: string[] = new Array<any>(n).fill("");
  const cols = [];
  for (let i = 0; i < n; i++) {
    cols.push([...rows]);
  }
  return cols;
};

export default {
  setGobangDefaultValue
};
