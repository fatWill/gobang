import "./index.scss";

import * as immutable from "immutable";

import { Piece } from "../../utils/models";
import React from "react";

const { memo } = React;

type PropsType = {
  gobangValue: Immutable.List<Immutable.List<string>>;
  onClick: (
    rowValue: Immutable.List<string>,
    rowIndex: number,
    colValue: string,
    colIndex: number
  ) => void;
};

const ModeFromDomUI: React.FC<PropsType> = memo(
  props => {
    const { gobangValue, onClick } = props;
    return (
      <div className="checkerboard-wrap">
        {gobangValue.map((rowValue, rowIndex) => {
          return (
            <div key={`row-${rowIndex}`} className="checkerboard-row">
              {rowValue!.map((colValue, colIndex) => {
                return (
                  <div
                    key={`col-${colIndex}`}
                    className="checkerboard-col"
                    onClick={() => {
                      onClick(rowValue!, rowIndex!, colValue!, colIndex!);
                    }}
                  >
                    <div
                      className={`${
                        colValue === Piece.black ? "checkerboard-col-black" : ""
                      } ${
                        colValue === Piece.white ? "checkerboard-col-white" : ""
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return immutable.is(prevProps.gobangValue, nextProps.gobangValue);
  }
);

export default ModeFromDomUI;
