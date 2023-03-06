#![allow(dead_code)]
#![allow(non_snake_case)]

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ConfigStruct {
    // common config
    valueRangeMode: String,
    pub hiddenGroups: Vec<u32>,
    limitHighlight: bool,

    // only timeseries
    drawLines: bool,
    marker: bool,
    markerSize: u32,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct KeyValuesStruct {
    SITE_NUM: u32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct StatsGroupStruct {
    Count: u32,
    Cp: String,
    Cpk: String,
    Max: String,
    Mean: String,
    Min: String,
    Std: String,
    cp: f64,
    cpk: f64,
    max: f64,
    mean: f64,
    min: f64,
    std: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
// #[wasm_bindgen]
pub struct GroupItemStruct {
    keyValues: KeyValuesStruct,
    color: String,
    stats: StatsGroupStruct,
    values: Vec<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StatsStruct {
    count: u32,
    cp: f64,
    cpk: f64,
    max: f64,
    mean: f64,
    min: f64,
    std: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InfoStruct {
    HI_LIMIT: f64,
    LO_LIMIT: f64,
    UNITS: String,
}

#[derive(Serialize, Deserialize)]
pub struct DataStruct {
    pub groups: Vec<GroupItemStruct>,
    stats: StatsStruct,
    info: InfoStruct,
}

#[derive(Debug)]
pub struct PreprocessItemStruct {
    color: String,
    keyValues: KeyValuesStruct,
    stats: StatsGroupStruct,
    value: f64,
    x: u32,
    y: f64,
}

// #[wasm_bindgen]
pub fn preprocess(
    groups: Vec<GroupItemStruct>,
    hiddenGroups: Vec<u32>,
) -> Vec<PreprocessItemStruct> {
    let mut filterdGroup: Vec<&GroupItemStruct> = Vec::new();

    for (index, item) in groups.iter().enumerate() {
        let index = index as u32;
        if !hiddenGroups.contains(&index) {
            filterdGroup.push(item)
        }
    }

    let mut returnedGroups: Vec<PreprocessItemStruct> = Vec::new();

    for (index, item) in filterdGroup.iter().enumerate() {
        let values = &item.values;
        for (i, el) in values.iter().enumerate() {
            returnedGroups.push(PreprocessItemStruct {
                color: item.color.clone(),
                keyValues: item.keyValues.clone(),
                stats: item.stats.clone(),
                value: *el,
                x: i as u32,
                y: index as f64,
            })
        }
    }

    returnedGroups
}
