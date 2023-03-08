import * as d3 from 'd3';
import { format, isInteger, isNumber, isObject, isString } from 'mathjs';
import ReactDOMServer from 'react-dom/server';
import Tooltip from '../components/Tooltip/Tooltip';

/**
 * Return webgl color from hex color
 *
 * @method parseGlColor
 * @param {object} d
 * @returns {string} web-gl color
 */
export function parseGlColor(d) {
  d = isObject(d) ? d : {};

  let color = _get(d, 'color', '#FFFFFF');
  color = isString(color) ? color : '#FFFFFF';

  return webglColor(color);
}

/**
 * Return new config limitHighlight
 *
 * @method onShowLimitHightlight
 * @param {boolean} value
 * @param {object} newConfig
 * @returns {object}
 */
export function onShowLimitHightlight(displayLimitHightLight, newConfig) {
  return {
    updatedDisplayLimitHightLight: !displayLimitHightLight,
    updatedConfig: {
      ...newConfig,
      limitHighlight: !displayLimitHightLight,
    },
  };
}

/**
 * Return new config valueRangeMode
 *
 * @method onChangeValueRangeMode
 * @param {string} valueRangeMode
 * @param {object} newConfig
 * @returns {object}
 */
export function onChangeValueRangeMode(valueRangeMode, newConfig) {
  return {
    updatedValueRangeMode: valueRangeMode,
    updatedConfig: {
      ...newConfig,
      valueRangeMode,
    },
  };
}

/**
 * Return new config fill marker
 *
 * @method onFillColor
 * @param {boolean} value
 * @param {object} newConfig
 * @returns {object}
 */
export function onFillColor(value, newConfig) {
  return {
    updatedFillColor: value,
    updatedConfig: {
      ...newConfig,
      marker: value,
    },
  };
}

/**
 * Return new config drawLines
 *
 * @method onDrawLines
 * @param {boolean} value
 * @param {object} newConfig
 * @returns {object}
 */
export function onDrawLines(value, newConfig) {
  return {
    updatedDrawLines: value,
    updatedConfig: {
      ...newConfig,
      drawLines: value,
    },
  };
}

/**
 * Return new point size
 *
 * @method onChangePointsSize
 * @param {number} value
 * @param {object} newConfig
 * @returns {object}
 */
export function onChangePointsSize(value, newConfig) {
  return {
    updatedPointsSize: value,
    updatedConfig: {
      ...newConfig,
      markerSize: value,
    },
  };
}

/**
 * @method showTooltip
 * @param {string} tooltipId
 * @param {object} data
 * @param {string} backgroundColor
 * @param {string} fontColor
 * @param {number} coordX
 * @param {number} coordY
 */
export function showTooltip({
  tooltipId,
  data,
  backgroundColor,
  fontColor,
  coordX,
  coordY,
}) {
  const tooltip = d3.select(tooltipId);
  const brushOverlay = d3.select('.brush .overlay');

  const { keyValues, stats, value } = data;

  const cp = _get(stats, 'Cp', '');
  const cpk = _get(stats, 'Cpk', '');
  const max = _get(stats, 'Max', '');
  const min = _get(stats, 'Min', '');
  const mean = _get(stats, 'Mean', '');
  const std = _get(stats, 'Std', '');

  tooltip.style('background', backgroundColor);
  tooltip.style('color', fontColor);
  tooltip.transition().duration(200).style('opacity', 1);

  brushOverlay.style('cursor', 'pointer');
  // Define keyTables
  let keyTable = [];

  for (let i = 0; i < Object.keys(keyValues).length; i++) {
    keyTable.push({ name: Object.keys(keyValues)[i], isFromData: true });
  }
  keyTable.push(
    { name: 'Value', isFromData: false },
    { name: 'Cp', isFromData: false },
    { name: 'Cpk', isFromData: false },
    { name: 'Max', isFromData: false },
    { name: 'Mean', isFromData: false },
    { name: 'Min', isFromData: false },
    { name: 'Std', isFromData: false },
  );

  // Define keyValues
  let keyValue = [];

  for (let i = 0; i < Object.values(keyValues).length; i++) {
    keyValue.push(Object.values(keyValues)[i]);
  }
  keyValue.push(value, cp, cpk, max, mean, min, std);

  const dataTooltip = combineArrays(keyTable, keyValue);
  const tooltipElement = ReactDOMServer.renderToString(
    // eslint-disable-next-line react/react-in-jsx-scope
    <Tooltip data={dataTooltip} />,
  );
  tooltip.html(tooltipElement);

  const xPadding = coordX + 95;
  const yPadding = coordY + 65;

  tooltip
    .style('left', xPadding + 'px')
    .style('top', yPadding + 'px')
    .style('z-index', 9);
}

/**
 * @method hideTooltip
 * @param {string} tooltipId
 */
export function hideTooltip(tooltipId) {
  const tooltip = d3.select(tooltipId);
  const brushOverlay = d3.select('.brush .overlay');

  tooltip.transition().duration(200).style('opacity', 0);
  brushOverlay.style('cursor', 'crosshair');
}

export function formatNumber(number) {
  if (isNaN(number) || number === null) {
    return number;
  }

  return d3.format('~r')(number);
}

export function formatSi(number, _decimal) {
  if (isNaN(number) || number === null) {
    return number;
  }

  let decimal;
  if (isNaN(_decimal) || _decimal === null || _decimal === undefined) {
    decimal = 4;
  } else {
    decimal = _decimal + 1;
  }

  return d3.format(`.${decimal}~s`)(number);
}

/**
 * Retun format decimal number by _decimal
 *
 * @method formatDecimal
 * @param {Number} number
 * @param {Number} _decimal
 * @returns {Number} number with format decimal
 */
export function formatDecimal(number, _decimal) {
  if (isNaN(number) || number === null) {
    return number;
  }

  let decimal;
  if (isNaN(_decimal) || _decimal === null || _decimal === undefined) {
    decimal = 3;
  } else {
    decimal = _decimal;
  }
  return d3.format(`.${decimal}~f`)(number);
}

/**
 * Return value if value != undefined or defaultValue if value == undefined
 *
 * @method _get
 * @param {Object} object
 * @param {String} key
 * @param {Number} defaultValue
 * @returns {Number} result
 */
export function _get(object, key, defaultValue) {
  if (typeof object !== 'object' || object === null || object === undefined) {
    return defaultValue;
  }

  const result = object[key];
  return typeof result !== 'undefined' ? result : defaultValue;
}

export function combineArrays(first, second) {
  let arrMerge = [];
  return first.reduce((acc, val, ind) => {
    acc = {
      keyName: first[ind],
      valueName: second[ind],
    };
    arrMerge.push(acc);
    return arrMerge;
  }, {});
}

export function webglColor(color) {
  const { r, g, b, opacity } = d3.color(color).rgb();
  return [r / 255, g / 255, b / 255, opacity];
}

export function getNumberIsNotZero(number) {
  if (!isNumber(number)) {
    return 0;
  }

  const fixedNumber = format(number, { notation: 'fixed' });

  if (isNaN(fixedNumber) || isInteger(number)) {
    return 0;
  }

  const numberAfterDigit = String(fixedNumber).split('.')[1];

  let index = 0;

  for (let i = 0; i < numberAfterDigit.length; i++) {
    const element = Number(numberAfterDigit[i]);

    if (element !== 0) {
      index = i;
      break;
    }
  }
  return index;
}
