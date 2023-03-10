/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import './EupTimeseriesPlot.scss';

// Import subcomponent

// Import utility libraries
import { CircularProgress, Typography, useTheme } from '@mui/material';
import * as d3 from 'd3';
import * as fc from 'd3fc';
import { abs, isArray, isBoolean, isNumber, isObject, isString } from 'mathjs';
import init, { checkApprox, main } from '../wasm';
import { config, data } from './demo/mock-data';
import {
  _get,
  formatNumber,
  formatSi,
  getNumberIsNotZero,
  hideTooltip,
  onChangePointsSize,
  onChangeValueRangeMode,
  onDrawLines,
  onFillColor,
  onShowLimitHightlight,
  showTooltip,
} from './functions';

/**
 * - A chart type which displays data so that 'y=value' and 'x=index of the value in the array'
 * - Copy to clipboard, v.v
 *
 * @export
 *
 * @param {number} offsetHeight - Default offset height
 * @param {object} config - Default config
 * @param {object} data - Default data
 * @param {string} id - id plot to select render and update
 * @param {object} resizeIndex - Value from resize [React-grid-layout]
 * @param {function} onConfigUpdated - function to update config
 *
 */
const TimeseriesPlot = () => {
  const id = 1;

  const [domain, setDomain] = useState([
    [0, 0],
    [0, 0],
  ]);
  const [groups, setGroups] = useState([]);
  const [valuesList, setValuesList] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [shouldShowLimit, setShouldShowLimit] = useState([]);

  function wasmFunc() {
    const result = main(data, config);
    // console.log('result.filterGroups ', result.filterGroups);
    setDomain(result.domain);
    setGroups(result.filterGroups);
    setValuesList(result.groupsValues);
    setProcessedData(result.preprocessGroups);
    setShouldShowLimit(result.shouldShowLimit);
  }

  useEffect(() => {
    const initialize = async () => {
      await init();
      wasmFunc();
    };
    initialize();
  }, []);

  const width = 800;
  const height = 600;

  // Declared zoom element size
  const brushSizeChange = 41;
  let initBrushPosition;

  // Declared event double click
  let idleTimeout;
  const idleDelay = 350;

  // Color theme
  const theme = useTheme().palette;
  const themeType = theme.mode;

  // x-axis bottom & y-axis color
  const axisColor = theme.text.primary;

  // Font color
  const fontColor = theme.text.primary;

  // Background color
  const backgroundColor = theme.background.paper;

  // Get groups from data
  let initGroups = _get(data, 'groups', []);
  initGroups = isArray(initGroups) ? initGroups : [];

  // Get info from data
  let dataInfo = _get(data, 'info', {});
  dataInfo = isObject(dataInfo) ? dataInfo : {};

  // Get hight low limit from data
  let hiLimit = _get(dataInfo, 'HI_LIMIT', null);
  hiLimit = isNumber(hiLimit) ? hiLimit : null;

  // Get low limit from data
  let loLimit = _get(dataInfo, 'LO_LIMIT', null);
  loLimit = isNumber(loLimit) ? loLimit : null;

  // Get units from data
  const units = _get(dataInfo, 'UNITS', 'V');

  // Get hiddenGroups from config
  let hiddenGroups = _get(config, 'hiddenGroups', []);
  hiddenGroups = isArray(hiddenGroups) ? hiddenGroups : [];

  // Get valueRangeMode config from config and validate it
  let valueRangeMode = _get(config, 'valueRangeMode', 'minMax');
  valueRangeMode = isString(valueRangeMode) ? valueRangeMode : 'minMax';

  // Get drawLines config from config and validate it
  let configLines = _get(config, 'drawLines', false);
  configLines = isBoolean(configLines) ? configLines : false;

  // Get marker config from config and validate it
  let filledCircle = _get(config, 'marker', false);
  filledCircle = isBoolean(filledCircle) ? filledCircle : false;

  // Get markerSize config from config and validate it
  let circleSize = _get(config, 'markerSize', 20);
  circleSize = isNumber(circleSize) ? circleSize * 20 : 20;

  // Get markerSize config from config and validate it
  let limitHighlight = _get(config, 'limitHighlight', false);
  limitHighlight = isBoolean(limitHighlight) ? limitHighlight : false;

  // /** ----- Component state -----  */

  // State for copy plot to clipboard
  const [loading, setLoading] = useState(false);

  // State for display limit from config
  const [displayLimitHightLight, setDisplayLimitHightLight] =
    useState(limitHighlight);

  // State for value range mode from config
  const [yValueRangeMode, setYValueRangeMode] = useState(valueRangeMode);

  // State for fill marker from config
  const [fillPoint, setFillePoint] = useState(filledCircle);

  // State for draw lines from config
  const [lineBetweenPoints, setLineBetweenPoints] = useState(configLines);

  // State for marker size from config
  const [pointsSize, setPoinsSize] = useState(circleSize);

  /** ----- State for brush & zoom functions -----  */

  // State for brushed
  const [isBrush, setIsBrush] = useState(false);

  // State for x-domain after brush
  const [xDomainUpdate, setXDomainUpdate] = useState(domain[0]);

  // Declare for domain x-axis when scroll
  const [xDomainScroll, setXDomainScroll] = useState(null);

  // State for y-domain after brush
  const [yDomainUpdate, setYDomainUpdate] = useState(domain[1]);

  // Declare for domain y-axis when scroll
  const [yDomainScroll, setYDomainScroll] = useState(null);

  const [indexNotZero, setIndexNotZero] = useState();

  useEffect(() => {
    if (yDomainUpdate) {
      setIndexNotZero(
        getNumberIsNotZero(abs(yDomainUpdate[1] - yDomainUpdate[0])) + 1,
      );
    }
  }, [yDomainUpdate]);

  // Caching the return the config
  const newConfig = useMemo(() => {
    return { ...config };
  }, []);

  /** ----- D3 variables declaration -----  */

  // Define x-axis
  const xDomain = domain[0];
  const xScale = d3.scaleLinear().domain(xDomain);

  // Define y-axis
  const yDomain = domain[1];
  const yScale = d3.scaleLinear().domain(yDomain);

  /** ----- Another data for component -----  */

  // Get limit values
  const limitValues = {
    lowLimit: shouldShowLimit[0],
    hightLimit: shouldShowLimit[1],
  };

  // Define limit
  const limitData = [
    [limitValues.hightLimit / 1000, limitValues.hightLimit],
    [limitValues.lowLimit, limitValues.lowLimit * 1000],
  ];

  useEffect(() => {
    setXDomainUpdate(xDomain);

    setYDomainUpdate(yDomain);
  }, [xDomain, yDomain]);

  /** ----- Main program -----  */

  // Define grid lines
  const gridlines = fc
    .annotationCanvasGridline()
    .xDecorate((selection) => {
      selection.strokeStyle = axisColor;
    })
    .yDecorate((selection) => {
      selection.strokeStyle = axisColor;
    });

  /**
   * Create a d3-zoom that handles the mouse interactions
   *
   * @method onScrollX
   * @param {*} transform event from d3.js
   * @param {number[]} xDomainUpdate [x0, x1]
   * @param {number[]} _yScale [y0, y1]
   * @param {boolean} isBrush  true | false
   */

  function onScrollX(transform, xDomainUpdate, _yScale, isBrush) {
    // Update the scales based on current zoom if brushed
    if (isBrush) {
      xScale.domain(xDomainUpdate);
      redraw(transform.rescaleX(xScale).domain(), _yScale);
      return xScale.domain();
    }
  }

  /**
   * Create a d3-zoom that handles the mouse interactions
   *
   * @method onScrollY
   * @param {*} transform event from d3.js
   * @param {number[]} yDomainUpdate [y0, y1]
   * @param {number[]} _xScale [x0, x1]
   * @param {boolean} isBrush  true | false
   */
  function onScrollY(transform, yDomainUpdate, _xScale, isBrush) {
    // Update the scales based on current zoom if brushed
    if (isBrush) {
      yScale.domain(yDomainUpdate);
      redraw(_xScale, transform.rescaleY(yScale).domain());
      return yScale.domain();
    }
  }

  /**
   * Show and hide tooltip when hover point
   *
   * @method onPointer
   * @param {object} coord
   * @param {number[]} currentXDomain
   * @param {number[]} currentYDomain
   * @returns
   */
  function onPointer(coord, currentXDomain, currentYDomain) {
    if (!coord) {
      return;
    }

    function getXScale(xNumber) {
      xScale.domain(currentXDomain);
      return xScale.invert(xNumber);
    }

    function getYScale(yNumber) {
      yScale.domain(currentYDomain);
      return yScale.invert(yNumber);
    }

    const coordX = Math.abs(getXScale(coord.x));
    const coordY = getYScale(coord.y);

    // find the closes datapoint to the pointer
    let dataPoint;
    for (let i = 0; i < processedData.length; i++) {
      const element = processedData[i];

      const eleX = element.x;
      const eleY = element.y;

      if (checkApprox(eleX, coordX, 0.2) && checkApprox(eleY, coordY, 0.0001)) {
        dataPoint = element;
      }
    }

    // if dataPoint, show the tooltip
    if (dataPoint) {
      const tooltipData = {
        tooltipId: `#timeseries_tooltip-${id}`,
        data: dataPoint,
        backgroundColor,
        fontColor,
        coordX: coord.x,
        coordY: coord.y,
      };
      showTooltip(tooltipData);
    } else {
      hideTooltip(`#timeseries_tooltip-${id}`);
    }
  }

  //  Set the brushable extent to the specified array of points
  const brush = fc
    .brush()
    .on('start', onBrushStart)
    .on('brush', onBrush)
    .on('end', onBrushEnd);

  /**
   * @method onBrushStart
   * @param {object} event
   * @returns
   */
  function onBrushStart(event) {
    if (!event.selection) {
      return;
    }
    initBrushPosition = event.selection;
  }

  /**
   * @method onBrush
   * @param {object} event
   * @returns
   */
  function onBrush(event) {
    const brushArea = event.selection;

    const size = d3
      .select(`#timeseries-plot-${id}`)
      .select('d3fc-svg.svg-plot-area')
      .select('svg')
      .attr('viewBox')
      .split(' ');

    const plotWidth = Number(size[2]);
    const plotHeight = Number(size[3]);

    if (!brushArea) return;

    const x0 = brushArea[0][0] * plotWidth;
    const y0 = brushArea[0][1] * plotHeight;

    const x1 = brushArea[1][0] * plotWidth;
    const y1 = brushArea[1][1] * plotHeight;

    // Get first position when click to plot
    const initX = initBrushPosition[0][0] * plotWidth;
    const initY = initBrushPosition[0][1] * plotHeight;

    const zoomLayer = d3
      .select(`#timeseries-plot-${id}`)
      .select('.zoom-controllers');

    // Select icon brush controllers
    const zoomboxCorners = d3.select(zoomLayer.node().lastChild);

    // Select layer brush
    const zoombox = d3.select(zoomLayer.node().firstChild);

    // Brush in vertically
    if (x1 - x0 > brushSizeChange / 2 && y1 - y0 <= brushSizeChange / 2) {
      zoomboxCorners
        .attr(
          'd',
          `M${x0},${initY} h-3v${brushSizeChange} h3 Z M${x1},${initY}  h3v${brushSizeChange} h-3 Z`,
        )
        .attr('transform', `translate(${0},${-brushSizeChange / 2})`);

      // Set postion brush layer
      zoombox.attr(
        'd',
        `M0,0 H${width} V${height} H0 V0 M${x0},0 v${height} h${
          x1 - x0
        } v${-height} h${-(x1 - x0)} Z`,
      );
    }
    // Brush in horizontally
    else if (y1 - y0 > brushSizeChange / 2 && x1 - x0 <= brushSizeChange / 2) {
      zoomboxCorners
        .attr(
          'd',
          `M${initX},${y0} v-3h${brushSizeChange} v3 Z M${initX},${y1}  v3h${brushSizeChange} v-3 Z`,
        )
        .attr('transform', `translate(${-brushSizeChange / 2},${0})`);

      // Set postion brush layer
      zoombox.attr(
        'd',
        `M0,0 H${width} V${height} H0 V0 M0,${y0} v${y1 - y0} h${width} v${-(
          y1 - y0
        )} h${-width} Z`,
      );
    }
    // Brush in two dimensions
    else if (x1 - x0 > brushSizeChange / 2 && y1 - y0 > brushSizeChange / 2) {
      // Set postion icon controllers
      zoomboxCorners
        .attr(
          'd',
          `M${x0},${y0} h3v-10 h10v-3 h-13 Z M${
            x1 + 3
          },${y0} h-3v-10 h-10v-3 h13 Z M${x1 + 3},${
            y1 - 24
          } h-3v10 h-10v3 h13 Z M${x0},${y1 - 24} h3v10 h10v3 h-13 Z`,
        )
        .attr('transform', `translate(${-2},${12})`);

      // Set postion brush layer
      zoombox.attr(
        'd',
        `M0,0 H${width} V${height} H0 V0 M${x0},${y0} v${y1 - y0} h${
          x1 - x0
        } v${-(y1 - y0)} h${-(x1 - x0)} Z`,
      );
    }
  }

  /**
   * Zoom event
   *
   * @method onBrushEnd
   * @param {object} event
   */
  function onBrushEnd(event) {
    const extent = event.selection;

    if (!extent) {
      if (!idleTimeout) {
        // Detect double clicks
        idleTimeout = setTimeout(() => (idleTimeout = null), idleDelay);
      } else {
        redraw(xDomain, yDomain);
      }
    } else {
      setIsBrush(true);

      const size = d3
        .select(`#timeseries-plot-${id}`)
        .select('d3fc-svg.svg-plot-area')
        .select('svg')
        .attr('viewBox')
        .split(' ');

      const plotWidth = Number(size[2]);
      const plotHeight = Number(size[3]);

      const x0 = extent[0][0] * plotWidth;
      const y0 = extent[0][1] * plotHeight;

      const x1 = extent[1][0] * plotWidth;
      const y1 = extent[1][1] * plotHeight;

      // Brush in vertically
      if (x1 - x0 > brushSizeChange / 2 && y1 - y0 <= brushSizeChange / 2) {
        xScale.domain(event.xDomain);
        setXDomainUpdate(event.xDomain);
        setXDomainScroll(null);
      }
      // Brush in horizontally
      else if (
        y1 - y0 > brushSizeChange / 2 &&
        x1 - x0 <= brushSizeChange / 2
      ) {
        yScale.domain(event.yDomain);
        setYDomainUpdate(event.yDomain);
        setYDomainScroll(null);
      }
      // Brush in two dimensions
      else if (x1 - x0 > brushSizeChange / 2 && y1 - y0 > brushSizeChange / 2) {
        xScale.domain(event.xDomain);
        setXDomainUpdate(event.xDomain);
        setXDomainScroll(null);

        yScale.domain(event.yDomain);
        setYDomainUpdate(event.yDomain);
        setYDomainScroll(null);
      }

      const zoomLayer = d3
        .select(`#timeseries-plot-${id}`)
        .select('.zoom-controllers');

      // Select icon brush controllers
      const zoomboxCorners = d3.select(zoomLayer.node().lastChild);

      // Select layer brush
      const zoombox = d3.select(zoomLayer.node().firstChild);

      // Reset positon icon controllers
      zoomboxCorners
        .attr('d', 'M0,0 V0 H0 V0 Z')
        .attr('transform', 'translate(0,0)');

      // Reset postion brush layer
      zoombox.attr('d', 'M0,0 V0 H0 V0 Z');
    }
  }

  /**
   * Create custom brush icon
   * @param {node} selection
   */
  function renderCustomBrush(selection) {
    const zoomControllers = selection
      .select('svg')
      .append('g')
      .attr('class', 'zoom-controllers');

    zoomControllers
      .append('path')
      .attr('d', 'M0,0 V0 H0 V0 Z')
      .attr('className', 'zoombox')
      .style('fill', 'rgba(0, 0, 0, 0.4)')
      .style('stroke-width', 0);

    zoomControllers
      .append('path')
      .attr('d', 'M0,0 V0 H0 V0 Z')
      .attr('className', 'zoombox-corners')
      .style('fill', 'rgb(255, 255, 255)')
      .style('stroke', 'rgb(68, 68, 68)')
      .style('stroke-width', 1)
      .style('opacity', 1);
  }

  /**
   * @method renderLimitArea
   * @returns canvas element
   */
  function renderLimitArea() {
    const limitArea = document.createElement('canvas');
    limitArea.width = 16;
    limitArea.height = 26;
    const ctx = limitArea.getContext('2d');

    const x0 = 36;
    const y0 = -4;
    const x1 = -0.5;
    const y1 = 26;
    const offset = 16;

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.moveTo(x0 - offset, y0);
    ctx.lineTo(x1 - offset, y1);
    ctx.moveTo(x0 + offset, y0);
    ctx.lineTo(x1 + offset, y1);
    ctx.stroke();

    return limitArea;
  }

  // Define canvas limits line
  const limitsSeries = fc
    .annotationCanvasBand()
    .fromValue((d) => d[0])
    .toValue((d) => d[1])
    .decorate((context) => {
      context.fillStyle = 'transparent';
    });

  // Define canvas points line
  const pointsLine = fc
    .seriesCanvasLine()
    .crossValue((_, i) => i)
    .mainValue((d) => d)
    .curve(d3.curveMonotoneX)
    .defined(() => true);

  // Create canvas points line
  const pointsLineSeries = fc
    .seriesCanvasRepeat()
    .series(pointsLine)
    .decorate((context) => {
      context.strokeStyle = 'transparent';
    });

  // Create webgl points
  const pointsSeries = fc
    .seriesCanvasPoint()
    .crossValue((d) => d.x)
    .mainValue((d) => d.y)
    .size(pointsSize);

  // Create plot with x-axis, y-axis, grid and webgl chart
  const chart = fc
    .chartCartesian(xScale, yScale)
    .yOrient('left')
    .yTickFormat((d) => `${formatSi(d, indexNotZero)}${units}`)
    .xTickFormat((d) => `${formatNumber(d)}`)
    .canvasPlotArea(
      // Only render the annotations series on the Canvas layer
      fc
        .seriesCanvasMulti()
        .series([gridlines, pointsLineSeries, limitsSeries, pointsSeries])
        .mapping((d, index, series) => {
          // eslint-disable-next-line default-case
          switch (series[index]) {
            case gridlines:
              return null;
            case pointsLineSeries:
              return d.valuesList;
            case limitsSeries:
              return d.limitData;
            case pointsSeries:
              return d.data;
          }
        }),
    )
    .svgPlotArea(
      // Only render the annotations series on the SVG layer
      fc
        .seriesSvgMulti()
        .series([brush])
        .mapping(() => null),
    )
    .decorate((selection) => {
      // Call render custom brush
      selection
        .enter()
        .select('d3fc-svg.svg-plot-area')
        .call(renderCustomBrush)
        .on('mouseout', () => {
          hideTooltip(`#timeseries_tooltip-${id}`);
        })
        .raise();
    })
    .yDecorate((selection) => {
      // Select svg wrapper
      const svg = selection.node().parentNode;

      // Remove domain line
      d3.select(svg).select('.domain').remove();

      // Change cursor style
      d3.select(svg)
        .style('cursor', 'ns-resize')
        .style('user-select', 'none')
        .style('pointer-events', 'unset');

      // Change color y-axis by theme
      selection.select('path').attr('stroke', axisColor);
      selection.select('text').attr('fill', axisColor);
    })
    .xDecorate((selection) => {
      // Select svg wrapper
      const svg = selection.node().parentNode;

      // Remove domain line
      d3.select(svg).select('.domain').remove();

      // Change cursor style
      d3.select(svg)
        .style('cursor', 'ew-resize')
        .style('user-select', 'none')
        .style('pointer-events', 'unset');

      // Change color x-axis by theme
      selection.select('path').attr('stroke', axisColor);
      selection.select('text').attr('fill', axisColor);
    });

  /**
   * @method redraw
   * @param {number[]} _xDomain
   * @param {number[]} _yDomain
   * Render  plot
   */
  function redraw(_xDomain, _yDomain) {
    _xDomain = _xDomain ? _xDomain : xDomainUpdate;
    _yDomain = _yDomain ? _yDomain : yDomainUpdate;

    xScale.domain(_xDomain);
    yScale.domain(_yDomain);

    pointsSeries.size(pointsSize);

    if (fillPoint) {
      pointsSeries.decorate((program, { color }) => {
        program.strokeStyle = color;
        program.fillStyle = color;
      });
    }
    if (lineBetweenPoints) {
      pointsLineSeries.decorate((context, _, index) => {
        context.strokeStyle = groups[index].color;
      });
    }
    if (displayLimitHightLight) {
      limitsSeries.decorate((context) => {
        const limitArea = renderLimitArea();
        context.fillStyle = context.createPattern(limitArea, 'repeat');
      });
    }

    const data = processedData;

    d3.select(`#timeseries-plot-${id}`)
      .datum({ data, valuesList, limitData })
      .call(chart);
  }

  /**
   * @method handleRescale
   */
  function handleRescale() {
    setIsBrush(false);

    xScale.domain(xDomain);
    yScale.domain(yDomain);

    setXDomainUpdate(xDomain);
    setYDomainUpdate(
      yValueRangeMode !== 'minMax' ? [loLimit, hiLimit] : yDomain,
    );

    setXDomainScroll(null);
    setYDomainScroll(null);

    const plotContainer = d3.select(`#timeseries-plot-${id}`);

    plotContainer
      .selectAll('.x-axis')
      .call(
        d3.zoom().scaleExtent([1, 1]).on('zoom', null).on('end', null)
          .transform,
        d3.zoomIdentity,
      );

    plotContainer
      .selectAll('.y-axis')
      .call(
        d3.zoom().scaleExtent([1, 1]).on('zoom', null).on('end', null)
          .transform,
        d3.zoomIdentity,
      );

    redraw(xDomain, yDomain);
  }

  /**
   * @method handleShowLimitHightLight
   */
  function handleShowLimitHightLight() {
    const { updatedDisplayLimitHightLight, updatedConfig } =
      onShowLimitHightlight(displayLimitHightLight, newConfig);

    setDisplayLimitHightLight(updatedDisplayLimitHightLight);
  }

  /**
   * @method handleChangeValueRangeMode
   * @param {string} value
   */
  function handleChangeValueRangeMode(value) {
    const { updatedValueRangeMode, updatedConfig } = onChangeValueRangeMode(
      value,
      newConfig,
    );

    setYValueRangeMode(updatedValueRangeMode);
  }

  /**
   * @method handleFillColor
   */
  function handleFillColor(value) {
    const { updatedFillColor, updatedConfig } = onFillColor(value, newConfig);

    setFillePoint(updatedFillColor);
  }

  /**
   * @method handleChangeDrawLines
   */
  function handleChangeDrawLines(value) {
    const { updatedDrawLines, updatedConfig } = onDrawLines(value, newConfig);

    setLineBetweenPoints(updatedDrawLines);
  }

  /**
   * @method handleMarkerSize
   */
  function handleMarkerSize(value) {
    const { updatedPointsSize, updatedConfig } = onChangePointsSize(
      value,
      newConfig,
    );

    setPoinsSize(updatedPointsSize);
  }

  // Update state by config
  useEffect(() => {
    setFillePoint(filledCircle);
  }, [filledCircle]);

  // Update state by config
  useEffect(() => {
    setLineBetweenPoints(configLines);
  }, [configLines]);

  // Update state by config
  useEffect(() => {
    setPoinsSize(circleSize);
  }, [circleSize]);

  // Update state by config
  useEffect(() => {
    setDisplayLimitHightLight(limitHighlight);
  }, [limitHighlight]);

  useEffect(() => {
    if (!isBrush) {
      if (yValueRangeMode !== 'minMax') {
        setYDomainUpdate([loLimit, hiLimit]);
      } else {
        if (domain) {
          setYDomainUpdate(domain[1]);
        }
      }
    }
  }, [domain, hiLimit, isBrush, loLimit, yValueRangeMode]);

  // Draw tooltip when component initialization
  useEffect(() => {
    d3.select('body')
      .append('div')
      .attr('class', 'eup_tooltip timeseries_tooltip')
      .attr('id', `timeseries_tooltip-${id}`)
      .style('opacity', 0);

    return () => {
      d3.select(`#timeseries_tooltip-${id}`).remove();
    };
  }, []);

  // Render/Update plot when depend change
  useEffect(() => {
    const xDomain = xDomainScroll ? xDomainScroll : xDomainUpdate;
    const yDomain = yDomainScroll ? yDomainScroll : yDomainUpdate;

    redraw(xDomain, yDomain);

    // Re-call on-point
    d3.select(`#timeseries-plot-${id}`)
      .select('d3fc-svg.svg-plot-area')
      .call(
        fc
          .pointer()
          .on('point', ([coord]) => onPointer(coord, xDomain, yDomain)),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    themeType,
    fillPoint,
    pointsSize,
    lineBetweenPoints,
    displayLimitHightLight,
    xDomainUpdate,
    yDomainUpdate,
    xDomainScroll,
    yDomainScroll,
  ]);

  // Render/Update zoom when depend change
  useEffect(() => {
    let _xDomain = null;
    let _yDomain = null;

    const currentXDomain = xDomainScroll ? xDomainScroll : xDomainUpdate;
    const currentYDomain = yDomainScroll ? yDomainScroll : yDomainUpdate;

    const plotContainer = d3.select(`#timeseries-plot-${id}`);

    xScale.domain(currentXDomain);
    yScale.domain(currentYDomain);

    plotContainer
      .selectAll('.x-axis')
      .call(
        d3
          .zoom()
          .scaleExtent([1, 1])
          .on('zoom', ({ transform }) => {
            _xDomain = onScrollX(transform, currentXDomain, _yDomain, isBrush);

            setXDomainScroll(_xDomain);
            setYDomainScroll(_yDomain);
          }),
      )
      .on('dblclick.zoom', null)
      .call(d3.zoom().transform, d3.zoomIdentity);

    plotContainer
      .selectAll('.y-axis')
      .call(
        d3
          .zoom()
          .scaleExtent([1, 1])
          .on('zoom', ({ transform }) => {
            _yDomain = onScrollY(transform, currentYDomain, _xDomain, isBrush);

            setYDomainScroll(_yDomain);
            setXDomainScroll(_xDomain);
          }),
      )
      .on('dblclick.zoom', null)
      .call(d3.zoom().transform, d3.zoomIdentity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    xDomainUpdate,
    yDomainUpdate,
    isBrush,
    xDomainScroll,
    yDomainScroll,
    xScale,
    yScale,
  ]);

  if (groups.length === 0) {
    return (
      <Typography
        variant="h6"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          height: '100%',
        }}
      >
        No Data
      </Typography>
    );
  }

  /**
   * Please define TimeseriesPlot component render structure
   */
  return (
    <Fragment>
      {loading && (
        <CircularProgress
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            zIndex: '1',
          }}
        />
      )}
      <div
        className="timeseries-plot-wrapper"
        id={`timeseries-plot-container-${id}`}
        style={{
          width: width,
          height: height,
          position: 'relative',
        }}
      >
        <div
          className="timeseries-plot"
          id={`timeseries-plot-${id}`}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        />
        {/* <TimeseriesPlotToolbar
          setLoading={setLoading}
          copyClipboardHandle={() =>
            copyClipboardHandle(`timeseries-plot-${id}`, setLoading)
          }
          displayLimitHightLight={displayLimitHightLight}
          onChangeShowHightLight={handleShowLimitHightLight}
          valueRangeMode={yValueRangeMode}
          onChangeValueRangeMode={handleChangeValueRangeMode}
          handleRescale={handleRescale}
          fillColor={fillPoint}
          setFillColor={handleFillColor}
          drawLines={lineBetweenPoints}
          handleChangeDrawLines={handleChangeDrawLines}
          markerSize={pointsSize}
          handleMarkerSize={handleMarkerSize}
        /> */}
      </div>
    </Fragment>
  );
};

/**
 * The type of TimeseriesPlot component properties.
 */
TimeseriesPlot.propTypes = {
  offsetHeight: PropTypes.number,
  resizeIndex: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  config: PropTypes.shape({
    // common config
    valueRangeMode: PropTypes.oneOf(['minMax', 'limit']), // minMax ,limit, (default minMax)
    hiddenGroups: PropTypes.array,
    limitHighlight: PropTypes.bool,

    // only timeseries
    drawLines: PropTypes.bool,
    marker: PropTypes.bool,
    markerSize: PropTypes.number,
  }),
  data: PropTypes.shape({
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        keyValues: PropTypes.object,
        color: PropTypes.string,
        stats: PropTypes.shape({
          Count: PropTypes.number,
          Cp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          Cpk: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          Max: PropTypes.string,
          Mean: PropTypes.string,
          Min: PropTypes.string,
          Std: PropTypes.string,
          cp: PropTypes.number,
          cpk: PropTypes.number,
          max: PropTypes.number,
          mean: PropTypes.number,
          min: PropTypes.number,
          std: PropTypes.number,
        }),
        values: PropTypes.arrayOf(PropTypes.number),
      }),
    ),
    stats: PropTypes.shape({
      count: PropTypes.number,
      cp: PropTypes.number,
      cpk: PropTypes.number,
      max: PropTypes.number,
      mean: PropTypes.number,
      min: PropTypes.number,
      std: PropTypes.number,
    }),
    info: PropTypes.shape({
      HI_LIMIT: PropTypes.number,
      LO_LIMIT: PropTypes.number,
      UNITS: PropTypes.string,
    }),
  }),
  onConfigUpdated: PropTypes.func,
};

/**
 * The default value of TimeseriesPlot component properties.
 */
// TimeseriesPlot.defaultProps = {}

export default TimeseriesPlot;
