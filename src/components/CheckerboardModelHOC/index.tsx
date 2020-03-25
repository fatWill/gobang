import models, { Piece } from "../../utils/models";

import ModeFromCanvasUI from "../ModeFromCanvasUI";
import ModeFromDomUI from "../ModeFromDomUI";
import React from "react";
import gobangLogic from "../../utils/gobangLogic";

const { memo, useEffect, useState, forwardRef, useImperativeHandle } = React;

type PropsType = {
  setTip: React.Dispatch<React.SetStateAction<string>>;
  setModeTip: React.Dispatch<React.SetStateAction<string>>;
  setReStartDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setRegretGameDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setRevocationRegretGameDisabled: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export type RefType = {
  restart: () => void;
  regretGame: () => void;
  revocationRegretGame: () => void;
  triggerMode: () => void;
};

enum RenderMode {
  dom,
  canvas
}

const CheckerboardModelHOC = memo(
  forwardRef((props: PropsType, parentRef) => {
    const {
      setTip,
      setModeTip,
      setReStartDisabled,
      setRegretGameDisabled,
      setRevocationRegretGameDisabled
    } = props;
    /******* 初始化state值 *******/
    // 总棋盘的值
    const [gobangValue, setGobangValue] = useState(
      models.setGobangDefaultValue()
    );

    // 当前模式
    const [currentRenderMode, setCurrentRenderMode] = useState<RenderMode>(
      RenderMode.dom
    );

    // 当前执子
    const [currentPushPointer, setCurrentPushPointer] = useState<Piece>(
      Piece.black
    );

    // 记录棋盘对局的路径
    const [historyPath, setHistoryPath] = useState<string[]>([]);

    // 记录棋盘撤销位置的指针指向
    const [currentHistoryPoint, setCurrentHistoryPoint] = useState(0);

    // 是否终盘
    const [isGameOver, setIsGameOver] = useState(false);

    // 私有方法，传入row和col value，设置对应的值
    const _setGobangValue = (row: number, col: number, value: string) => {
      const rows = gobangValue.get(row);
      const newGobangValue = gobangValue.set(row, rows.set(col, value));
      setGobangValue(newGobangValue);
    };

    /******* 状态监听和游戏处理逻辑 *******/
    // 当前渲染模式提示
    useEffect(() => {
      if (currentRenderMode === RenderMode.dom) {
        setModeTip("dom渲染");
        return;
      }
      if (currentRenderMode === RenderMode.canvas) {
        setModeTip("canvas渲染");
        return;
      }
    }, [currentRenderMode, setModeTip]);

    // 执子提示
    useEffect(() => {
      if (historyPath.length === 0) return;
      setTip(
        `接下来${currentPushPointer === Piece.black ? "黑子" : "白子"}执棋`
      );
    }, [currentPushPointer, historyPath, setTip]);

    // 处理悔棋和撤销悔棋还有重新开始按钮的状态
    useEffect(() => {
      setReStartDisabled(historyPath.length === 0);
      setRegretGameDisabled(currentHistoryPoint === 0);
      setRevocationRegretGameDisabled(
        historyPath.length === currentHistoryPoint
      );
    }, [
      historyPath,
      currentHistoryPoint,
      setReStartDisabled,
      setRegretGameDisabled,
      setRevocationRegretGameDisabled
    ]);

    // 处理游戏结束逻辑
    useEffect(() => {
      // 9子以下必不可能有胜利者
      if (historyPath.length < 9) return;

      const dropPiece = historyPath.slice(-1)[0];
      if (gobangLogic.isVictory(gobangValue, dropPiece)) {
        setTip(
          `${
            dropPiece.includes(Piece.black) ? "黑子" : "白子"
          }胜利，请重新开始游戏`
        );
        setIsGameOver(true);
        setRegretGameDisabled(true);
        setRevocationRegretGameDisabled(true);
      }
    }, [
      historyPath,
      gobangValue,
      setTip,
      setRegretGameDisabled,
      setRevocationRegretGameDisabled
    ]);

    /******* 方法转发 *******/
    // 悔棋
    const regretGame = () => {
      // 防重
      if (currentHistoryPoint === 0) return;

      const nextHistoryPoint = currentHistoryPoint - 1;

      // 取出对应的数据
      const piece = gobangLogic.getPieceParam(
        historyPath.slice(nextHistoryPoint, currentHistoryPoint)[0]
      );

      // 再把相对应的剔除
      _setGobangValue(piece.row, piece.col, "");

      // 设置最新的指针指向的路径
      setCurrentHistoryPoint(nextHistoryPoint);

      // 设置下一执子
      setCurrentPushPointer(piece.pieceType as Piece);
    };

    // 撤销悔棋
    const revocationRegretGame = () => {
      // 防重
      if (currentHistoryPoint === historyPath.length) return;

      const nextHistoryPoint = currentHistoryPoint + 1;

      // 取出相对应的数据
      const piece = gobangLogic.getPieceParam(
        historyPath.slice(currentHistoryPoint, nextHistoryPoint)[0]
      );

      // 再把相对应的值加上
      _setGobangValue(piece.row, piece.col, piece.pieceType);

      // 设置最新的指针指向的路径
      setCurrentHistoryPoint(nextHistoryPoint);

      // 设置下一执子
      setCurrentPushPointer(
        piece.pieceType === Piece.black ? Piece.white : Piece.black
      );
    };

    // 重新开始 初始化数据
    const restart = () => {
      setIsGameOver(false);
      setTip("请开始游戏");
      setReStartDisabled(true);
      setRegretGameDisabled(true);
      setRevocationRegretGameDisabled(true);
      setGobangValue(models.setGobangDefaultValue());
      setHistoryPath([]);
      setCurrentPushPointer(Piece.black);
      setCurrentHistoryPoint(0);
    };

    // 更换渲染
    const triggerMode = () => {
      const mode: RenderMode =
        currentRenderMode === RenderMode.dom
          ? RenderMode.canvas
          : RenderMode.dom;
      setCurrentRenderMode(mode);
    };

    // 向父组件传递对应的方法
    useImperativeHandle(parentRef, () => {
      return {
        regretGame,
        revocationRegretGame,
        restart,
        triggerMode
      };
    });

    /******* 处理点击事件逻辑 *******/
    const onClick = (
      rowValue: Immutable.List<string>,
      rowIndex: number,
      colValue: string,
      colIndex: number
    ) => {
      // 如果已经置棋了或者游戏结束了则直接return
      if (
        isGameOver ||
        colValue.includes(Piece.black) ||
        colValue.includes(Piece.white)
      )
        return;

      // 设置新的棋盘渲染
      _setGobangValue(rowIndex, colIndex, currentPushPointer);

      // 设置当前记录指针指向
      setCurrentHistoryPoint(currentHistoryPoint + 1);

      // 设置棋盘对局的路径
      setHistoryPath([
        ...historyPath.slice(0, currentHistoryPoint),
        `${rowIndex}-${colIndex}-${currentPushPointer}`
      ]);

      // 换子执行
      setCurrentPushPointer(
        currentPushPointer === Piece.black ? Piece.white : Piece.black
      );
    };

    return (
      <>
        {currentRenderMode === RenderMode.dom ? (
          <ModeFromDomUI gobangValue={gobangValue} onClick={onClick} />
        ) : null}
        {currentRenderMode === RenderMode.canvas ? (
          <ModeFromCanvasUI gobangValue={gobangValue} onClick={onClick} />
        ) : null}
      </>
    );
  }),
  (prevProps, nextProps) => {
    return true;
  }
);

export default CheckerboardModelHOC;
