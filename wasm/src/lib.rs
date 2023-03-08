#![allow(non_snake_case)]

mod data_preprocess;
mod util;

use crate::data_preprocess::*;
use crate::util::*;
use serde::Serialize;
use wasm_bindgen::prelude::*;

#[derive(Debug, Serialize)]
pub struct ReturnValuesStruct {
    pub filterGroups: Vec<GroupItemStruct>,
    pub preprocessGroups: Vec<PreprocessItemStruct>,
    pub groupsValues: Vec<[f64; 1]>,
    pub domain: ([i32; 2], [f64; 2]),
    pub shouldShowLimit: (f64, f64),
}

#[wasm_bindgen]
pub fn main(input_data: JsValue, input_config: JsValue) -> JsValue {
    let data: DataStruct = serde_wasm_bindgen::from_value(input_data).unwrap();
    let groups = data.groups;

    let config: ConfigStruct = serde_wasm_bindgen::from_value(input_config).unwrap();
    let hiddenGroups = config.hiddenGroups;

    let filterGroups = filterGroup(groups, hiddenGroups);

    let preprocessGroups = preprocess(filterGroups.clone());

    let groupsValues = groupsValuesList(filterGroups.clone());

    let domain = getDomain(preprocessGroups.clone());

    let HI_LIMIT = data.info.HI_LIMIT;
    let LO_LIMIT = data.info.LO_LIMIT;

    let shouldShowLimit = shouldShowLimit(HI_LIMIT, LO_LIMIT);

    let returnValues = ReturnValuesStruct {
        filterGroups,
        preprocessGroups,
        groupsValues,
        domain,
        shouldShowLimit,
    };

    serde_wasm_bindgen::to_value(&returnValues).unwrap()
}

#[wasm_bindgen]
pub fn checkApprox(point: i32, coord: f64, epsilon: f64) -> bool {
    let verifiedPoint = point.abs();
    let verifiedCoord = if !coord.is_nan() { coord.abs() } else { 0.0 };
    let verifiedEpsilon = if !coord.is_nan() { epsilon } else { 0.0001 };

    let approx = if verifiedPoint == 0 {
        verifiedCoord < verifiedEpsilon
    } else {
        (verifiedCoord - verifiedPoint as f64).abs() < verifiedEpsilon
    };

    approx
}
