#![allow(dead_code)]
#![allow(non_snake_case)]

mod data_preprocess;

use crate::data_preprocess::*;
use wasm_bindgen::prelude::*;

#[derive(Debug)]
#[wasm_bindgen]
pub struct ReturnValue {
    returnedGroups: Vec<PreprocessItemStruct>,
}

#[wasm_bindgen]
pub fn main(input_data: JsValue, input_config: JsValue) -> ReturnValue {
    let data: DataStruct = serde_wasm_bindgen::from_value(input_data).unwrap();
    let groups = data.groups;

    let config: ConfigStruct = serde_wasm_bindgen::from_value(input_config).unwrap();
    let hiddenGroups = config.hiddenGroups;

    let returnedGroups = preprocess(groups, hiddenGroups);

    ReturnValue { returnedGroups }
}
