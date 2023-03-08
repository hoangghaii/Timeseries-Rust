import {
  checkApprox,
  onChangePointsSize,
  onChangeValueRangeMode,
  onDrawLines,
  onFillColor,
  onShowLimitHightlight,
  parseGlColor,
  shouldShowLimit,
} from '../functions'
import { config, data1 } from './data-test'

describe('EupTimeseries data_preprocess test', () => {
  // Test function parseGlColor
  test.each([
    // valid cases
    [
      data1.groups[0],
      [0.24705882352941178, 0.09411764705882353, 0.5686274509803921, 1],
    ],
    [
      data1.groups[1],
      [0.5647058823529412, 0.09019607843137255, 0.5372549019607843, 1],
    ],

    // invalid cases
    [{}, [1, 1, 1, 1]],
    [null, [1, 1, 1, 1]],
    [undefined, [1, 1, 1, 1]],
  ])('Test function parseGlColor', (data, expected) => {
    const r = parseGlColor(data)
    expect(r).toEqual(expected)
  })

  // Test function onShowLimitHightlight
  test.each([
    // valid cases
    [
      true,
      config,
      {
        updatedDisplayLimitHightLight: false,
        updatedConfig: {
          ...config,
          limitHighlight: false,
        },
      },
    ],
    [
      false,
      config,
      {
        updatedDisplayLimitHightLight: true,
        updatedConfig: {
          ...config,
          limitHighlight: true,
        },
      },
    ],
  ])(
    'Test function onShowLimitHightlight',
    (displayLimitHightLight, newConfig, expected) => {
      const r = onShowLimitHightlight(displayLimitHightLight, newConfig)
      expect(r).toEqual(expected)
    }
  )

  // Test function onChangeValueRangeMode
  test.each([
    // valid cases
    [
      'minMax',
      config,
      {
        updatedValueRangeMode: 'minMax',
        updatedConfig: {
          ...config,
          valueRangeMode: 'minMax',
        },
      },
    ],
    [
      'limit',
      config,
      {
        updatedValueRangeMode: 'limit',
        updatedConfig: {
          ...config,
          valueRangeMode: 'limit',
        },
      },
    ],
  ])(
    'Test function onChangeValueRangeMode',
    (valueRangeMode, newConfig, expected) => {
      const r = onChangeValueRangeMode(valueRangeMode, newConfig)
      expect(r).toEqual(expected)
    }
  )

  // Test function onFillColor
  test.each([
    // valid cases
    [
      true,
      config,
      {
        updatedFillColor: true,
        updatedConfig: {
          ...config,
          marker: true,
        },
      },
    ],
    [
      false,
      config,
      {
        updatedFillColor: false,
        updatedConfig: {
          ...config,
          marker: false,
        },
      },
    ],
  ])('Test function onFillColor', (value, newConfig, expected) => {
    const r = onFillColor(value, newConfig)
    expect(r).toEqual(expected)
  })

  // Test function onDrawLines
  test.each([
    // valid cases
    [
      true,
      config,
      {
        updatedDrawLines: true,
        updatedConfig: {
          ...config,
          drawLines: true,
        },
      },
    ],
    [
      false,
      config,
      {
        updatedDrawLines: false,
        updatedConfig: {
          ...config,
          drawLines: false,
        },
      },
    ],
  ])('Test function onDrawLines', (value, newConfig, expected) => {
    const r = onDrawLines(value, newConfig)
    expect(r).toEqual(expected)
  })

  // Test function onChangePointsSize
  test.each([
    // valid cases
    [
      70,
      config,
      {
        updatedPointsSize: 70,
        updatedConfig: {
          ...config,
          markerSize: 70,
        },
      },
    ],
    [
      90,
      config,
      {
        updatedPointsSize: 90,
        updatedConfig: {
          ...config,
          markerSize: 90,
        },
      },
    ],
  ])('Test function onChangePointsSize', (value, newConfig, expected) => {
    const r = onChangePointsSize(value, newConfig)
    expect(r).toEqual(expected)
  })

  // Test function shouldShowLimit
  test.each([
    // valid cases
    [
      -0.44201892614364624,
      -0.4467531909942627,
      { lowLimit: -0.4467531909942627, hightLimit: -0.44201892614364624 },
    ],

    // invalid cases
    [
      null,
      -0.4467531909942627,
      { lowLimit: -0.4467531909942627, hightLimit: undefined },
    ],
    [
      -0.44201892614364624,
      undefined,
      { lowLimit: undefined, hightLimit: -0.44201892614364624 },
    ],
    [null, undefined, { lowLimit: undefined, hightLimit: undefined }],
  ])('Test function shouldShowLimit', (hiLimit, loLimit, expected) => {
    const r = shouldShowLimit(hiLimit, loLimit)
    expect(r).toEqual(expected)
  })

  // Test function checkApprox
  test.each([
    // valid cases
    [0.1254, 0.2354, null, false],
    [0.1235, 0.12344, undefined, true],
    [0.1254, 0.1252, 0.00001, false],
    [0.23555, 0.23554, 'string', true],

    // invalid cases
    ['string', null, 'string', false],
    [undefined, 'string', null, false],
    [undefined, null, undefined, false],
  ])('Test function checkApprox', (point, coord, epsilon, expected) => {
    const r = checkApprox(point, coord, epsilon)
    expect(r).toEqual(expected)
  })
})
