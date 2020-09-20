import styled from "styled-components";

const ChartContainer = styled.div`
  border-radius: 5px;
  max-width: max-content;
  margin-bottom: 30px;
  background: white;
`;

export const Percents = styled.span`
  color: #43b99c;
`;

const CurrencyInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

CurrencyInfo.Percents = styled.div`
  display: flex;
  flex-direction: row;
  font-family: Nunito;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;

  span:first-child {
    margin-right: 5px;
  }
`;

CurrencyInfo.Balance = styled.span`
  font-family: Nunito;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 41px;
  color: black;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  justify-content: space-between;
`;

const Btn = styled.div`
  width: 40px;
  user-select: none;
  cursor: pointer;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 3px;
  > span {
    font-family: Nunito;
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: white;
  }

  margin-right: 2px;
`;

const BtnWrapper = styled.div`
  > ${Btn}:last-child {
    width: 80px;
    margin-right: 0px;
  }

  .active {
    background: white;
  }
  .active > span {
    color: white;
  }
  margin-top: 7px;
  display: flex;
  flex-direction: row;
`;

const CanvasWrapper = styled.div`
  border-radius: 20px;
`;

const Canvas = styled.span`
  display: inline-block;
  position: relative;
  width: 100%;
  vertical-align: top;
  overflow: hidden;

  /* hide y-axis hover line */
  .y-hover-line {
    display: none;
  }

  .line {
    stroke: white;
    stroke-width: 1px;
    fill: none;
  }

  .area {
    fill: url(#mainGradient);
  }

  #infoPolygon {
    fill: white;
    stroke: white;
    transform: translate(-37px, -37px);
  }

  #infoPolygonLine {
    stroke: white;
  }

  .infoAxisY {
    fill: white;
  }

  .infoAxisX {
    fill: white;
  }

  .context {
  }

  .red-tes {
    color: white;
  }

  .tick {
    font-family: Nunito;
    font-style: normal;
    font-weight: 600;
    font-size: 10px;
    line-height: 14px;
    /* identical to box height */
    color: #757780;
  }

  .stop-left {
    stop-color: white;
  }

  .stop-right {
    stop-color: white;
  }

  .svg-content {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
  }

  .zoom {
    cursor: move;
    fill: none;
    pointer-events: all;
  }

  .tooltip {
    fill: white;
    stroke-width: 1px;
    stroke: white;
  }

  .zoom {
    fill: none;
    pointer-events: all;
  }

  .axis.axis--y > .domain {
    display: none;
  }

  .axis.axis--y > .tick line {
    display: none;
  }

  .axis.axis--y > .tick text {
    transform: translateX(-20px);
  }

  .axis.axis--x > .tick text {
    transform: translateY(14px) translateX(-7px) rotate(-45deg);
  }

  .axis.axis--x > .domain {
    stroke: #757780;
  }

  .axis.axis--y > .tick:first {
    display: none;
  }

  .focus circle {
    fill: #f1f3f3;
    stroke: white;
    stroke-width: 3px;
  }

  .focusPoints text {
    background: #f1f3f3;
    font-family: Nunito;
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
  }

  .hover-line {
    stroke: #63646a;
    stroke-width: 2px;
    stroke-dasharray: 8, 4;
  }

  .selection {
    stroke: Gray;
  }
`;

export {
  CurrencyInfo,
  InfoWrapper,
  ChartContainer,
  Btn,
  BtnWrapper,
  Canvas,
  CanvasWrapper,
};
