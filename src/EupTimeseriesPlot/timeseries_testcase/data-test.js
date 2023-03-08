/* eslint-disable no-loss-of-precision */
const config = {
  // common config
  valueRangeMode: 'minMax', // minMax ,limit, (default minMax)
  hiddenGroups: [1, 3], // hidden group index list
  limitHighlight: false, //boolean

  // only timeseries
  drawLines: true,
  marker: true,
  markerSize: 3,
}

const data1 = {
  groups: [
    {
      keyValues: { SITE_NUM: 1 },
      color: '#3f1891',
      stats: {
        Count: 53,
        Cp: '79.9',
        Cpk: '69.0',
        Max: '−440.9mV',
        Mean: '−442.7mV',
        Min: '−445.8mV',
        Std: '834.7µV',
        cp: 79.87082415216057,
        cpk: 68.96716473570952,
        max: -0.44087716937065125,
        mean: -0.44269677827943044,
        min: -0.4457610845565796,
        std: 0.00083468110374161,
      },
      values: [
        -0.441873699426651, -0.4421650767326355, -0.4440840780735016,
        -0.4427724778652191, -0.4430401027202606, -0.443501353263855,
      ],
    },
    {
      keyValues: { SITE_NUM: 2 },
      color: '#901789',
      stats: {
        Count: 20,
        Cp: '52.7',
        Cpk: '45.7',
        Max: '−441.5mV',
        Mean: '−443.4mV',
        Min: '−447.8mV',
        Std: '1.264mV',
        cp: 52.74786836126879,
        cpk: 45.72227266489037,
        max: -0.44153299927711487,
        mean: -0.44336160719394685,
        min: -0.4477531909942627,
        std: 0.001263874157027145,
      },
      values: [
        -0.4441087543964386, -0.44347667694091797, -0.4426994025707245,
        -0.44340455532073975, -0.4477531909942627, -0.44318532943725586,
      ],
    },
  ],
  stats: {
    count: 73, // all count
    cp: 72.9, // all cp
    cpk: 61.2, // all cpk
    max: -0.44087716937065125, // all max
    mean: -0.44287892318751715, // all mean
    min: -0.4477531909942627, // all min
    std: 0.0010155658943366039, // all std
  },
  info: {
    HI_LIMIT: -0.44201892614364624, // range hight limit
    LO_LIMIT: -0.4467531909942627, // range low limit
    UNITS: 'V', // range units
  },
}

const data2 = {
  groups: [
    {
      keyValues: { SITE_NUM: 1 },
      color: '#3f1891',
      stats: {
        Count: 53,
        Cp: '79.9',
        Cpk: '69.0',
        Max: '−440.9mV',
        Mean: '−442.7mV',
        Min: '−445.8mV',
        Std: '834.7µV',
        cp: 79.87082415216057,
        cpk: 68.96716473570952,
        max: -0.44087716937065125,
        mean: -0.44269677827943044,
        min: -0.4457610845565796,
        std: 0.00083468110374161,
      },
      values: [
        -0.441873699426651, -0.4421650767326355, -0.4440840780735016,
        -0.4427724778652191, -0.4430401027202606, -0.443501353263855,
      ],
    },
  ],
  stats: {
    count: 73, // all count
    cp: 72.9, // all cp
    cpk: 61.2, // all cpk
    max: -0.44087716937065125, // all max
    mean: -0.44287892318751715, // all mean
    min: -0.4477531909942627, // all min
    std: 0.0010155658943366039, // all std
  },
  info: {
    HI_LIMIT: -0.44201892614364624, // range hight limit
    LO_LIMIT: -0.4467531909942627, // range low limit
    UNITS: 'V', // range units
  },
}

export { config, data1, data2 }
