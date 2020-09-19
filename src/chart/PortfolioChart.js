import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import dayjs from "dayjs";
import { withTheme } from "styled-components";
import {
  clearArea,
  drawSVG,
  drawLine,
  getBisectDate,
  getWidth,
  updateCurrencyInfo,
} from "./ChartFunctions";
import { height, height2, margin, margin2, timeFormat } from "./ChartConstants";
import {
  Btn,
  Canvas,
  CurrencyInfo,
  ChartContainer,
  InfoWrapper,
  BtnWrapper,
  Percents,
  CanvasWrapper,
} from "./Chart.styles";

const dataBtn = ["1d", "1w", "1m", "1y", "All time"];

const data = [
  {
    BTC: [],
  },
  {
    USDT: [],
  },
  {
    XRP: [],
  },
  {
    EOS: [
      {
        id: 15542049,
        created_at: "2020-08-21T10:46:58.791Z",
        updated_at: "2020-08-21T10:46:58.791Z",
        coin: "EOS",
        quote: "USD",
        lastUpdated: "2020-08-21T10:44:05.000Z",
        marketCap: "3257363644.18885000000000000",
        price: "3.48241107596000000",
        percentChange1h: "-1.08193000000000000",
        percentChange24h: "2.30957000000000000",
        percentChange7d: "10.29130000000000000",
        volume24h: "2982244476.13784000000000000",
        uniq_item_id: "d327e4dc-9786-5957-9736-6f8492ef7899",
        close: 745.23597025544,
        date: "2020-08-21T10:44:05.000Z",
      },
      {
        id: 15539390,
        created_at: "2020-08-21T10:41:59.197Z",
        updated_at: "2020-08-21T10:41:59.197Z",
        coin: "EOS",
        quote: "USD",
        lastUpdated: "2020-08-21T10:38:05.000Z",
        marketCap: "3262743179.22584600000000000",
        price: "3.48816227676000000",
        percentChange1h: "-1.11678000000000000",
        percentChange24h: "2.51732000000000000",
        percentChange7d: "10.48450000000000000",
        volume24h: "2970874321.05054000000000000",
        uniq_item_id: "3bcb6b9a-28c0-5527-aff1-466bb03d04b5",
        close: 746.4667272266399,
        date: "2020-08-21T10:38:05.000Z",
      },
      {
        id: 15536731,
        created_at: "2020-08-21T10:36:52.509Z",
        updated_at: "2020-08-21T10:36:52.509Z",
        coin: "EOS",
        quote: "USD",
        lastUpdated: "2020-08-21T10:34:04.000Z",
        marketCap: "3265954319.10009770000000000",
        price: "3.49159527052000000",
        percentChange1h: "-1.01946000000000000",
        percentChange24h: "2.63852000000000000",
        percentChange7d: "10.59320000000000000",
        volume24h: "2963208977.52188000000000000",
        uniq_item_id: "2e226c55-0951-5ae1-b6f4-450c1f86b9ee",
        close: 747.20138789128,
        date: "2020-08-21T10:34:04.000Z",
      },
    ],
  },
];

const rate = [
  {
    TICKER: "USD",
    DATE: "1998-01-01",
    OPEN: 0,
    HIGH: 0,
    LOW: 0,
    CLOSE: 5.96,
    VOL: 0,
    WAPRICE: 0,
    NOMINAL: 1,
  },
  {
    TICKER: "USD",
    DATE: "1998-01-06",
    OPEN: 0,
    HIGH: 0,
    LOW: 0,
    CLOSE: 5.963,
    VOL: 0,
    WAPRICE: 0,
    NOMINAL: 1,
  },
];

const PortfolioChart = (props) => {
  const canvas = React.createRef();
  const currencyInfoRef = React.createRef();
  const btnsRef = dataBtn.map(() => React.createRef());
  const currencyRef = React.createRef();
  const entirePercentRef = React.createRef();
  const lastPercentRef = React.createRef();
  const canvasWrapperRef = React.createRef();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // const data = rate.map(d => {
  //   return {
  //     x: new Date(d.DATE),
  //     y: d.CLOSE
  //   };
  // });

  // const data = props.data.map(d => {
  //   let x = new Date(d.date);
  //   let y = d.close;
  //   if (x && y)
  //     return {
  //       x,
  //       y
  //     };
  // });

  const isNumber = (value) =>
    typeof value === "number" &&
    value === value &&
    value !== Infinity &&
    value !== -Infinity;

  // const data = props.data.reduce(function (result, el) {
  //   let x = new Date(el.date);
  //   let y = el.close;
  //   if (x instanceof Date && isNumber(y)) result.push({ x, y });
  //   return result;
  // }, []);

  function getYs() {
    return data.map((d) => d.y);
  }

  function getMinY() {
    return Math.min(...getYs());
  }

  function getMaxY() {
    return Math.max(...getYs());
  }

  const [state, setState] = useState();
  function handleUpdate() {
    setState(window.innerWidth);
  }

  useEffect(() => {
    if (isMounted) {
      window.addEventListener("resize", handleUpdate);
      clearArea(canvas);

      const svg = drawSVG(canvas);

      const width = getWidth(canvasWrapperRef.current);

      const x = d3.scaleTime().range([0, width]);
      const x2 = d3.scaleTime().range([0, width]);
      const y = d3.scaleLinear().range([height, 0]);
      const y2 = d3.scaleLinear().range([height2, 0]);

      const xAxis = d3.axisBottom(x).tickFormat(timeFormat);
      const xAxis2 = d3.axisBottom(x2);
      const yAxis = d3.axisLeft(y);

      xAxis.tickSizeOuter(0);

      const lastValue = d3.select(currencyRef.current);
      const entirePercent = d3.select(entirePercentRef.current);
      const lastPercent = d3.select(lastPercentRef.current);

      const zoom = d3
        .zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([
          [0, 0],
          [width, height],
        ])
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("zoom", zoomed);

      const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [width, height2],
        ])
        .on("brush end", brushed);

      const area = d3
        .area()
        .x((d) => {
          return x(d.x);
        })
        .y0(height)
        .y1((d) => {
          return y(d.y);
        });

      const linePath = d3
        .line()
        .x((d) => {
          return x(d.x);
        })
        .y((d) => {
          return y(d.y);
        });

      const area2 = d3
        .area()
        .x((d) => {
          return x2(d.x);
        })
        .y0(height2)
        .y1((d) => {
          return y2(d.y);
        });

      svg
        .append("defs")
        .append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", 300)
        .attr("x", 0)
        .attr("y", 0)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} 300`);

      const svgDefs = svg.append("defs");
      const mainGradient = svgDefs
        .append("linearGradient")
        .attr("id", "mainGradient")
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "100%");
      mainGradient
        .append("stop")
        .attr("class", "stop-left")
        .attr("offset", "0");

      mainGradient
        .append("stop")
        .attr("class", "stop-right")
        .attr("offset", "1");

      const lineChart = svg
        .append("g")
        .attr("class", "chart")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr("clip-path", "url(#clip)");

      const focus = svg
        .append("g")
        .attr("class", "focus")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const zoomscale = svg
        .append("g")
        .attr("class", "context")
        .attr("transform", `translate(${margin2.left},${margin2.top})`);

      x.domain(
        d3.extent(data, (d) => {
          return d.x;
        })
      );
      y.domain([getMinY(), getMaxY()]);

      x2.domain(x.domain());
      y2.domain(y.domain());

      focus
        .append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

      focus.append("g").attr("class", "axis axis--y").call(yAxis);

      lineChart
        .append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

      lineChart
        .append("path")
        .datum(data)
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", linePath);

      zoomscale
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", area2);

      zoomscale
        .append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height2})`)
        .call(xAxis2);

      zoomscale
        .append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

      const focusPoints = focus
        .append("g")
        .attr("class", "focusPoints")
        .style("display", "none");

      focusPoints
        .append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

      focusPoints
        .append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", width);

      focusPoints.append("circle").attr("r", 5);

      focusPoints
        .append("polygon")
        .attr("id", "infoPolygon")
        .attr("points", "45 13,36 21,27 13")
        .attr("width", 85)
        .attr("height", 30);

      focusPoints
        .append("rect")
        .attr("class", "tooltip")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", 85)
        .attr("height", 30);

      focusPoints
        .append("line")
        .attr("id", "infoPolygonLine")
        .attr("x1", -4.5)
        .attr("y1", -20)
        .attr("x2", 2.5)
        .attr("y2", -20);

      focusPoints
        .append("text")
        .attr("class", "infoAxisY")
        .attr("id", "#infoAxisY")
        .attr("x", 15);

      focusPoints
        .append("text")
        .attr("class", "infoAxisX")
        .attr("id", "#infoAxisX")
        .attr("x", 15)
        .attr("dy", ".31em");

      svg
        .append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .on("mouseover", () => {
          focusPoints.style("display", null);
        })
        .on("mouseout", () => {
          focusPoints.style("display", "none");
        })
        .on("mousemove", mousemove)
        .call(zoom)
        .on("wheel.zoom", null);

      zoom
        .on("start", function () {
          focusPoints.style("display", "none");
        })
        .on("end", mousemove);

      // eslint-disable-next-line no-inner-declarations
      function mousemove() {
        // if (isNaN(d3.mouse(this)[0])) return;
        // focusPoints.style('display', null);
        const currentX = d3.mouse(this)[0];
        const x0 = x.invert(currentX);
        const iDate = getBisectDate(data, x0, 1);
        const i = data.length >= iDate ? iDate - 1 : iDate;
        const d0 = data[i - 1];
        const d1 = data[i];
        if (d0 && d1) {
          const d = d0 && d1 && x0 - d0.x > d1.x - x0 ? d1 : d0;
          let translateXAdjust = 0;
          const distanceToRightBorder = width - currentX;
          if (distanceToRightBorder < 50)
            translateXAdjust -= 50 - distanceToRightBorder;
          if (currentX < 50) translateXAdjust += 50 - currentX;
          const tooltipTranslateX = -60 + translateXAdjust;
          const tooltipTranslateY = -50;
          const infoTranslateY = tooltipTranslateY + 16;
          const spaceBetweenData = 5;
          const tooltipLeftRightPadding = 24 + spaceBetweenData;

          focusPoints
            .select(".tooltip")
            // Положение прямоугольника подсказски
            .attr(
              "transform",
              `translate(${tooltipTranslateX},${tooltipTranslateY})`
            );

          focusPoints.attr("transform", `translate(${x(d.x)},${y(d.y)})`);
          focusPoints
            .select(".infoAxisY")
            .text(() => {
              return `${d.y} `;
            })
            // Положение текста со значением в точке
            .attr(
              "transform",
              `translate(${tooltipTranslateX},${infoTranslateY})`
            );

          const infoYWidth = focusPoints
            .select(".infoAxisY")
            .node()
            .getComputedTextLength();

          focusPoints
            .select(".infoAxisX")
            .text(() => {
              return `${dayjs(d.x).format("ddd, D MMM")}`;
            })
            .attr(
              "transform",
              // Положение текста с доп информацией о точке
              `translate(${
                tooltipTranslateX + infoYWidth + spaceBetweenData
              },${infoTranslateY})`
            );

          const textWidth2 = focusPoints
            .select(".infoAxisX")
            .node()
            .getComputedTextLength();

          focusPoints.select("infoPolygonLine");

          const tooltipWidth =
            infoYWidth +
            textWidth2 +
            tooltipLeftRightPadding +
            spaceBetweenData;
          focusPoints.select(".tooltip").attr("width", tooltipWidth);

          focusPoints.select(".x-hover-line").attr("y2", height - y(d.y));
          focusPoints.select(".y-hover-line").attr("x2", -x(d.x));
        }
      }

      updateCurrencyInfo(lastValue, entirePercent, lastPercent, x, data, width);

      btnsRef.forEach((el) => d3.select(el.current).on("click", drawBrush));

      // Выделяем кнопку 'All time'
      btnsRef[btnsRef.length - 1].current.classList.add("active");

      function drawBrush() {
        let dateStart = x.invert(0);
        let dateEnd = x.invert(0);

        // Выделяем только кнопку, на которую нажали
        btnsRef.forEach((el) => el.current.classList.remove("active"));
        this.classList.add("active");

        switch (this.innerText) {
          case "All time":
            dateStart = data[0].x;
            dateEnd = data[data.length - 1].x;
            break;
          case "1y":
            dateEnd.setFullYear(dateStart.getFullYear() + 1);
            break;
          case "1m":
            dateEnd.setMonth(dateStart.getMonth() + 1);
            break;
          case "1w":
            dateEnd.setDate(dateStart.getDate() + 7);
            break;
          case "1d":
            dateEnd.setDate(dateStart.getDate() + 1);
            break;
          default:
            dateEnd.setDate(dateStart.getDate() + 1);
            break;
        }

        const start = x2(dateStart);
        const end = x2(dateEnd) > width ? width : x2(dateEnd);

        brush.move(d3.select(".brush").transition().duration(500), [
          start,
          end,
        ]);
      }

      function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush")
          return; // ignore zoom-by-brush
        const t = d3.event.transform;
        x.domain(t.rescaleX(x2).domain());
        lineChart.select(".line").attr("d", linePath);
        lineChart.select(".area").attr("d", area);
        focus.select(".axis--x").call(xAxis);
        brush.move(d3.select(".brush"), x.range().map(t.invertX, t));
        updateCurrencyInfo(
          lastValue,
          entirePercent,
          lastPercent,
          x,
          data,
          width
        );
      }

      function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") {
          return;
        } // ignore brush-by-zoom
        const s = d3.event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));
        lineChart.select(".line").attr("d", linePath);

        lineChart.select(".area").attr("d", area);
        focus.select(".axis--x").call(xAxis);

        svg
          .select(".zoom")
          .call(
            zoom.transform,
            d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0)
          );

        updateCurrencyInfo(
          lastValue,
          entirePercent,
          lastPercent,
          x,
          data,
          width
        );
      }
    }
  }, [state, isMounted, props.theme, props.data]);
  console.log(data);
  return (
    <ChartContainer>
      <InfoWrapper>
        {data.length === 0 ? (
          <CurrencyInfo>
            <CurrencyInfo.Balance>0</CurrencyInfo.Balance>
            <CurrencyInfo.Percents>
              <Percents>+0%</Percents>
              <Percents>+0%</Percents>
            </CurrencyInfo.Percents>
          </CurrencyInfo>
        ) : (
          <CurrencyInfo ref={currencyInfoRef}>
            <CurrencyInfo.Balance>{data[0].y}</CurrencyInfo.Balance>
            <CurrencyInfo.Percents>
              <span ref={entirePercentRef} />
              <span ref={lastPercentRef} />
            </CurrencyInfo.Percents>
          </CurrencyInfo>
        )}
        <BtnWrapper>
          {dataBtn.map((el, index) => (
            <Btn ref={btnsRef[index]} key={index}>
              <span>{el}</span>
            </Btn>
          ))}
        </BtnWrapper>
      </InfoWrapper>
      <CanvasWrapper ref={canvasWrapperRef}>
        <Canvas ref={canvas} />
      </CanvasWrapper>
    </ChartContainer>
  );
};

export default PortfolioChart;
