#![allow(non_snake_case)]

/* -------------- Import Modules -------------- */

use serde::{Deserialize, Serialize};

/* -------------- Define structs -------------- */

#[derive(Serialize, Deserialize)]
pub struct ConfigStruct {
    // common config
    pub valueRangeMode: Option<String>,
    pub hiddenGroups: Option<Vec<u32>>,
    pub limitHighlight: bool,

    // only timeseries
    pub drawLines: Option<bool>,
    pub marker: Option<bool>,
    pub markerSize: Option<u32>,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct KeyValuesStruct {
    pub SITE_NUM: Option<u32>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct StatsGroupStruct {
    pub Count: Option<u32>,
    pub Cp: Option<String>,
    pub Cpk: Option<String>,
    pub Max: Option<String>,
    pub Mean: Option<String>,
    pub Min: Option<String>,
    pub Std: Option<String>,
    pub cp: Option<f64>,
    pub cpk: Option<f64>,
    pub max: Option<f64>,
    pub mean: Option<f64>,
    pub min: Option<f64>,
    pub std: Option<f64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GroupItemStruct {
    pub keyValues: Option<KeyValuesStruct>,
    pub color: Option<String>,
    pub stats: Option<StatsGroupStruct>,
    pub values: Option<Vec<f64>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StatsStruct {
    pub count: Option<u32>,
    pub cp: Option<f64>,
    pub cpk: Option<f64>,
    pub max: Option<f64>,
    pub mean: Option<f64>,
    pub min: Option<f64>,
    pub std: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InfoStruct {
    pub HI_LIMIT: Option<f64>,
    pub LO_LIMIT: Option<f64>,
    pub UNITS: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct DataStruct {
    pub groups: Option<Vec<GroupItemStruct>>,
    pub stats: Option<StatsStruct>,
    pub info: Option<InfoStruct>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PreprocessItemStruct {
    pub color: String,
    pub keyValues: KeyValuesStruct,
    pub stats: StatsGroupStruct,
    pub value: f64,
    pub x: u32,
    pub y: f64,
}

#[derive(Debug, Serialize)]
pub struct ReturnValuesStruct {
    pub filterGroups: Vec<GroupItemStruct>,
    pub preprocessGroups: Vec<PreprocessItemStruct>,
    pub groupsValues: Vec<Vec<f64>>,
    pub domain: ([i32; 2], [f64; 2]),
    pub shouldShowLimit: (f64, f64),
}
