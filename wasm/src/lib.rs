#![allow(non_snake_case)]

/* -------------- Import Modules -------------- */

pub mod consts;
pub mod data_preprocess;
pub mod structs;
pub mod utils;

use crate::{data_preprocess::*, structs::*, utils::*};

use serde::Serialize;
use wasm_bindgen::prelude::*;
use web_sys::console::*;

/* -------------- Define functions -------------- */

/**
 * Create own console_log function in web
 * @method console_log
 * @param {string} str
 * @param {object} value
 */
pub fn console_log<T: Serialize + ?Sized>(str: &str, value: &T) {
    log_2(
        &serde_wasm_bindgen::to_value(str).unwrap(),
        &serde_wasm_bindgen::to_value(value).unwrap(),
    );
}

/**
 * Main function
 * @method main
 * @param {object} input_data
 * @param {object} input_config
 * @returns {object}
 */
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
    |     Wellcome to RUST     |
    ----------------------------
               _~^~^~_
           \) /  o o  \ (/
             '_   -   _'
             / '-----' \
    ",
    );

    serde_wasm_bindgen::to_value(&returnValues).unwrap()
}

/**
 * Check if point is approx to coord
 * @method checkApprox
 * @param {number} point
 * @param {number} coord
 * @param {number} epsilon
 * @returns {boolean}
 */
#[wasm_bindgen]
pub fn checkApprox(point: Option<f64>, coord: Option<f64>, epsilon: Option<f64>) -> bool {
    let verifiedPoint = point.unwrap_or(0.0).abs();
    let verifiedCoord = coord.unwrap_or(0.0).abs();
    let verifiedEpsilon = epsilon.unwrap_or(0.0001).abs();

    let approx = (verifiedPoint - verifiedCoord).abs() <= verifiedEpsilon;

    approx
}
