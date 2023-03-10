#![allow(non_snake_case)]

/* -------------- Import Modules -------------- */

mod consts;
mod data_preprocess;
mod structs;
mod utils;

use crate::{data_preprocess::*, structs::*, utils::*};

use serde::Serialize;
use wasm_bindgen::prelude::*;
use web_sys::console::*;

/* -------------- Define functions -------------- */

// Create own console_log function in web
pub fn console_log<T: Serialize + ?Sized>(str: &str, value: &T) {
    log_2(
        &serde_wasm_bindgen::to_value(str).unwrap(),
        &serde_wasm_bindgen::to_value(value).unwrap(),
    );
}

#[wasm_bindgen]
pub fn main(input_data: JsValue, input_config: JsValue) -> JsValue {
    let data: DataStruct = serde_wasm_bindgen::from_value(input_data).unwrap();

    // Get groups from data and validate it
    let groups = data.groups.unwrap_or(vec![]);

    let config: ConfigStruct = serde_wasm_bindgen::from_value(input_config).unwrap();

    // let hiddenGroups = config.hiddenGroups;
    let hiddenGroups = config.hiddenGroups.unwrap_or(vec![]);

    let filterGroups = filterGroup(groups, hiddenGroups);

    let preprocessGroups = preprocess(filterGroups.clone());

    let groupsValues = groupsValuesList(filterGroups.clone());

    let domain = getDomain(preprocessGroups.clone());

    let info = data.info.unwrap_or(InfoStruct {
        HI_LIMIT: None,
        LO_LIMIT: None,
        UNITS: None,
    });

    let HI_LIMIT = info.HI_LIMIT.unwrap_or(0.0);
    let LO_LIMIT = info.LO_LIMIT.unwrap_or(0.0);

    let shouldShowLimit = shouldShowLimit(HI_LIMIT, LO_LIMIT);

    let returnValues = ReturnValuesStruct {
        filterGroups,
        preprocessGroups,
        groupsValues,
        domain,
        shouldShowLimit,
    };

    console_log(
        "",
        r"
    ----------------------------
    |     Wellcome to rust     |
    ----------------------------
               _~^~^~_
           \) /  o o  \ (/
             '_   -   _'
             / '-----' \
    ",
    );

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

    // console.log in web
    // console_log("checkApprox ", &approx);

    approx
}

#[test]
fn test_groups_values_list() {
    let group1 = GroupItemStruct {
        keyValues: None,
        color: None,
        stats: None,
        values: Some(vec![1.0, 2.0, 3.0]),
    };

    let group2 = GroupItemStruct {
        keyValues: None,
        color: None,
        stats: None,
        values: Some(vec![4.0, 5.0]),
    };

    let group3 = GroupItemStruct {
        keyValues: None,
        color: None,
        stats: None,
        values: Some(vec![6.0, 7.0, 8.0]),
    };

    let group4 = GroupItemStruct {
        keyValues: None,
        color: None,
        stats: None,
        values: Some(vec![]),
    };

    let groups = vec![group1, group2, group3, group4];

    let result = groupsValuesList(groups);

    let expected_output: Vec<Vec<f64>> = vec![[1.0, 4.0], [2.0, 5.0], [3.0, 6.0], [7.0, 8.0]]
        .iter()
        .map(|list| list.to_vec())
        .collect::<Vec<Vec<f64>>>();

    assert_eq!(result, expected_output);
}
