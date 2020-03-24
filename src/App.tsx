import "./App.scss";

import { CHECKER_BOARD_NUMBER, CHECKER_BOARD_SIZE } from "./config";
import ModeFromDom, { RefType } from "./components/ModeFromDom";

import React from "react";
import models from "./utils/models";

const { useMemo, createRef, useState } = React;

function App() {
  // 因为渲染棋盘方块的时候实际上是少一个格子的，所以创建实际沾满格子棋盘-1
  const checkerboardValue = useMemo(
    () => models.setGobangDefaultValue(CHECKER_BOARD_NUMBER - 1),
    []
  );

  const [tip, setTip] = useState("请开始游戏");

  // 重新开始按钮状态
  const [reStartDisabled, setReStartDisabled] = useState(true);
  // 悔棋按钮状态
  const [regretGameDisabled, setRegretGameDisabled] = useState(true);
  // 撤销悔棋按钮状态
  const [
    revocationRegretGameDisabled,
    setRevocationRegretGameDisabled
  ] = useState(true);

  // 取出ModeFromDom的ref
  const ModeFromDomRef: React.Ref<RefType> = createRef();

  return (
    <div className="gobang-wrap">
      <div className="gobang-result">{tip}</div>
      <div
        className="gobang-checkerboard"
        style={{
          width: `${CHECKER_BOARD_SIZE}vh`,
          height: `${CHECKER_BOARD_SIZE}vh`,
          padding: `${CHECKER_BOARD_SIZE / CHECKER_BOARD_NUMBER / 2}vh`
        }}
      >
        {/* 棋盘底盘样式 */}
        <div className="gobang-checkerboard-style">
          {checkerboardValue.map((pValue, pIndex) => {
            return (
              <div key={`row-${pIndex}`} className="gobang-checkerboard-row">
                {pValue.map((cValue, cIndex) => {
                  return (
                    <div
                      key={`col-${cIndex}`}
                      className="gobang-checkerboard-col"
                    ></div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {/* 棋盘棋子逻辑处理 */}
        <div className="gobang-checkerboard-main">
          <ModeFromDom
						ref={ModeFromDomRef}
						setTip={setTip}
            setReStartDisabled={setReStartDisabled}
            setRegretGameDisabled={setRegretGameDisabled}
            setRevocationRegretGameDisabled={setRevocationRegretGameDisabled}
          />
        </div>
      </div>
      <div className="gobang-opreation">
        <button
          disabled={reStartDisabled}
          onClick={() => {
            ModeFromDomRef.current?.restart();
          }}
        >
          重新开始
        </button>
        <button
          disabled={regretGameDisabled}
          onClick={() => ModeFromDomRef.current?.regretGame()}
        >
          悔棋
        </button>
        <button
          disabled={revocationRegretGameDisabled}
          onClick={() => ModeFromDomRef.current?.revocationRegretGame()}
        >
          撤销悔棋
        </button>
        <button>切换渲染模式</button>
      </div>
    </div>
  );
}

export default App;
