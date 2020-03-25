import "./index.scss";

import * as immutable from "immutable";

import { CHECKER_BOARD_NUMBER, CHECKER_BOARD_SIZE } from "../../config";

import { List } from "immutable";
import { Piece } from "../../utils/models";
import React from "react";

const { memo, useEffect, useMemo, useState, createRef } = React;

type PropsType = {
  gobangValue: Immutable.List<Immutable.List<string>>;
  onClick: (
    rowValue: Immutable.List<string>,
    rowIndex: number,
    colValue: string,
    colIndex: number
  ) => void;
};

const ModeFromCanvas: React.FC<PropsType> = memo(
  props => {
    const { gobangValue, onClick } = props;

    const CanvasRef: React.Ref<HTMLCanvasElement> = createRef();
    // 设置canvas的宽高
    const { width, height, pieceSize } = useMemo(() => {
      const windowsHeight = window.innerHeight;
      const height = (windowsHeight * CHECKER_BOARD_SIZE) / 100;

      const pieceSize = height / CHECKER_BOARD_NUMBER;

      return {
        width: height * 2,
        height: height * 2,
        pieceSize: pieceSize * 2
      };
    }, []);

    // 设置棋盘值的缓存值，后期用作判断渲染
    let [gobangValueCache, setGobangValueCache] = useState(gobangValue);

    // 画圆
    const renderCir = (
      ctx: CanvasRenderingContext2D,
      pieceSize: number,
      colIndex: number,
      rowIndex: number,
      colValue: String
    ) => {
      if (colValue) {
        const r = (pieceSize * 0.85) / 2;
        const x = colIndex * pieceSize + pieceSize / 2;
        const y = rowIndex * pieceSize + pieceSize / 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        if (colValue === Piece.black) {
          ctx.fillStyle = "#000";
        } else {
          ctx.fillStyle = "#eee";
        }
        ctx.fill();
        ctx.closePath();
      } else {
        const x = colIndex * pieceSize;
        const y = rowIndex * pieceSize;
        ctx.clearRect(x, y, pieceSize, pieceSize);
      }
    };

    // 初始化渲染
    useEffect(() => {
      const ctx = CanvasRef.current?.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      // 先全局设置阴影
      // 阴影的x偏移
      ctx.shadowOffsetX = 0;
      // 阴影的y偏移
      ctx.shadowOffsetY = 0;
      // 阴影颜色
      ctx.shadowColor = "#999";
      // 阴影的模糊半径
      ctx.shadowBlur = 4;

      gobangValue.forEach((rowValue, rowIndex) => {
        rowValue?.forEach((colValue, colIndex) => {
          if (colValue) {
            // 渲染
            renderCir(ctx, pieceSize, colIndex!, rowIndex!, colValue);
          }
        });
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 增减子渲染
    useEffect(() => {
      // 如果没变动，则不渲染
      if (immutable.is(gobangValueCache, gobangValue)) return;

      const ctx = CanvasRef.current?.getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      // 如果有变动 找出更新的值，并渲染
      const len = gobangValue.size;
      // 遍历行
      for (let rowIndex = 0; rowIndex < len; rowIndex++) {
        const rowValue = gobangValue.get(rowIndex);
        const rowValueCache = gobangValueCache.get(rowIndex);
        // 判断是否有不同的行，如果有，跳出循环，否则继续
        if (!immutable.is(rowValue, rowValueCache)) {
          const len = rowValue.size;
          // 遍历列
          for (let colIndex = 0; colIndex < len; colIndex++) {
            const colValue = rowValue.get(colIndex);
            const colValueCache = rowValueCache.get(colIndex);
            // 判断是否有不同的列，如果有，跳出循环，否则继续
            if (!immutable.is(colValue, colValueCache)) {
              // 渲染
              console.log(1);
              renderCir(ctx, pieceSize, colIndex, rowIndex, colValue);
              break;
            }
          }
          break;
        }
      }

      setGobangValueCache(gobangValue);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gobangValue]);

    return (
      <canvas
        width={width}
        height={height}
        style={{
          width: width / 2,
          height: height / 2
        }}
        ref={CanvasRef}
        onClick={e => {
          const target = e.nativeEvent;
          const x = target.offsetX;
          const y = target.offsetY;
          const rowIndex = Math.floor(y / (pieceSize / 2));
          const colIndex = Math.floor(x / (pieceSize / 2));
          const rowValue = gobangValue.get(rowIndex);
          const colValue = rowValue.get(colIndex);
          onClick(rowValue, rowIndex, colValue, colIndex);
        }}
      />
    );
  },
  (prevProps, nextProps) => {
    return immutable.is(prevProps.gobangValue, nextProps.gobangValue);
  }
);

export default ModeFromCanvas;
