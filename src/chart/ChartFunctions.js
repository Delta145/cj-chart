import * as d3 from 'd3';
import {height, margin, width} from './ChartConstants';

export const clearArea = canvasRef => {
  d3.select(canvasRef.current)
    .selectAll('*')
    .remove();
};

export const drawSVG = canvasRef => {
  return d3
    .select(canvasRef.current)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
};

export const drawLine = (multiData, z, linePath, lineChart, area) => {
  const mData = lineChart.selectAll('.multiData').data(multiData);

  mData.exit().remove();

  mData
    .enter()
    .insert('g', '.somePath')
    .append('path')
    .attr('class', 'line multiData')
    .style('stroke', 'red')
    .merge(mData)
    .attr('d', d => linePath(d));

  if (multiData.length === 1) {
    lineChart
      .append('path')
      .datum(multiData[0])
      .attr('class', 'area multiData')
      .attr('d', area);
    d3.select('.stop-left').style('stop-color', z.get(multiData[0].id));
  }
};

export const getBisectDate = d3.bisector(d => {
  return d.x;
}).left;

export const getWidth = currentRef => {
  return parseInt(d3.select(currentRef).style('width'), 10) - margin.left - margin.right;
};

export const updateCurrencyInfo = (
  lastValue,
  entirePercent,
  lastPercent,
  x,
  data,
  currentWidth
) => {
  const x0 = x.invert(currentWidth);
  const i0 = getBisectDate(data, x.invert(0), 1);
  const iDate = getBisectDate(data, x0, 1);
  const i = data.length >= iDate ? iDate - 1 : iDate;
  if (data[i0] && data[i] && data[i - 1]) {
    const first = data[i0].y;
    const current = data[i].y;
    const prev = data[i - 1].y;

    const style = current > prev ? '#43B99C' : '#E25955';
    const sign = current > prev ? '+' : '-';
    const diff = current > prev ? ((current - prev) * 100) / prev : ((prev - current) * 100) / prev;

    const styleFirst = current > first ? '#43B99C' : '#E25955';
    const signFisrt = current > first ? '+' : '-';
    const diffFirst =
      current > first ? ((current - first) * 100) / first : ((first - current) * 100) / first;

    lastValue.html(`$${current.toFixed(2)}`);
    entirePercent.style('color', styleFirst).html(`${signFisrt}${diffFirst.toFixed(2)}%`);

    lastPercent.style('color', style).html(` ${sign}${diff.toFixed(2)}%`);
  }
};
