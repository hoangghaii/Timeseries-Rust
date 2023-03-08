#![allow(non_snake_case)]

// import modules
use serde::{Deserialize, Serialize};

/* -------------- Define structs -------------- */
#[derive(Serialize, Deserialize)]
pub struct ConfigStruct {
    // common config
    pub valueRangeMode: String,
    pub hiddenGroups: Vec<u32>,
    pub limitHighlight: bool,

    // only timeseries
    pub drawLines: bool,
    pub marker: bool,
    pub markerSize: u32,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct KeyValuesStruct {
    pub SITE_NUM: u32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct StatsGroupStruct {
    pub Count: u32,
    pub Cp: String,
    pub Cpk: String,
    pub Max: String,
    pub Mean: String,
    pub Min: String,
    pub Std: String,
    pub cp: f64,
    pub cpk: f64,
    pub max: f64,
    pub mean: f64,
    pub min: f64,
    pub std: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GroupItemStruct {
    pub keyValues: KeyValuesStruct,
    pub color: String,
    pub stats: StatsGroupStruct,
    pub values: Vec<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StatsStruct {
    pub count: u32,
    pub cp: f64,
    pub cpk: f64,
    pub max: f64,
    pub mean: f64,
    pub min: f64,
    pub std: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InfoStruct {
    pub HI_LIMIT: f64,
    pub LO_LIMIT: f64,
    pub UNITS: String,
}

#[derive(Serialize, Deserialize)]
pub struct DataStruct {
    pub groups: Vec<GroupItemStruct>,
    pub stats: StatsStruct,
    pub info: InfoStruct,
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

/* -------------- Define functions -------------- */

/**
 * Filter groups by hiddenGroups
 * @method filterGroup
 * @param {array} groups
 * @param {array} hiddenGroups
 * @returns {array}
 */
pub fn filterGroup(groups: Vec<GroupItemStruct>, hiddenGroups: Vec<u32>) -> Vec<GroupItemStruct> {
    // Define filtered groups
    let mut filterdGroup: Vec<&GroupItemStruct> = Vec::new();

    // Loop through groups
    for (index, item) in groups.iter().enumerate() {
        // Parse index to u32
        let index = index as u32;

        // Check if index is in hiddenGroups
        if !hiddenGroups.contains(&index) {
            filterdGroup.push(item)
        }
    }

    // Define returned groups
    let mut returnGroups: Vec<GroupItemStruct> = Vec::new();

    // Loop through filtered groups
    for item in filterdGroup.iter() {
        // Get values
        let values = &item.values;

        // Define list of values
        let mut listValues: Vec<f64> = Vec::new();

        // Loop through values
        for el in values.iter() {
            // Check if value is !NaN
            if !el.is_nan() {
                listValues.push(*el)
            }
        }

        // Push item to returnGroups
        returnGroups.push(GroupItemStruct {
            color: item.color.clone(),
            keyValues: item.keyValues.clone(),
            stats: item.stats.clone(),
            values: listValues,
        })
    }

    returnGroups
}

/**
 * Preprocess data
 *
 * @method preprocess
 * @param {array} groups
 * @returns {array}
 */
pub fn preprocess(groups: Vec<GroupItemStruct>) -> Vec<PreprocessItemStruct> {
    // Define returned groups
    let mut returnedGroups: Vec<PreprocessItemStruct> = Vec::new();

    // Loop through groups
    for item in groups.iter() {
        // Get values
        let values = &item.values;

        // Loop through values
        for (i, el) in values.iter().enumerate() {
            // Push item to returnedGroups
            returnedGroups.push(PreprocessItemStruct {
                color: item.color.clone(),
                keyValues: item.keyValues.clone(),
                stats: item.stats.clone(),
                value: *el,
                x: i as u32,
                y: *el,
            })
        }
    }

    returnedGroups
}

/**
 * Return values list
 *
 * @method groupsValuesList
 * @param {array} groups
 * @returns {array}
 */
pub fn groupsValuesList(groups: Vec<GroupItemStruct>) -> Vec<[f64; 1]> {
    // Check if groups.len() >= 2
    if groups.len() >= 2 {
        // Define returned values
        let mut returnedValues: Vec<[f64; 1]> = Vec::new();

        // Loop through groups
        for (i, item) in groups.iter().enumerate() {
            // Get next item
            let nextItem = groups.get(i + 1);

            // Get values
            let values = &item.values;

            // Get next values
            let nextValues = &nextItem.unwrap().values;

            // Check if values.len() >= nextValues.len()
            if values.len() >= nextValues.len() {
                for (i, el) in values.iter().enumerate() {
                    let elNextValues = nextValues.get(i);

                    // Check if elNextValues is exist
                    if elNextValues.is_some() {
                        let mut returnedValues: Vec<[f64; 2]> = Vec::new();

                        returnedValues.push([*el, *elNextValues.unwrap()]);
                    } else {
                        returnedValues.push([*el]);
                    }
                }
            } else {
                for (i, el) in nextValues.iter().enumerate() {
                    let item = values.get(i);
                    // Check if item is exist
                    if item.is_some() {
                        let mut returnedValues: Vec<[f64; 2]> = Vec::new();

                        returnedValues.push([*item.unwrap(), *el]);
                    } else {
                        returnedValues.push([*el]);
                    }
                }
            }
        }

        returnedValues
    } else {
        // Define returned values
        let mut returnedValues: Vec<[f64; 1]> = Vec::new();

        // Loop through groups
        for item in groups.iter() {
            // Get values
            let values = &item.values;

            // Loop through values
            for el in values.iter() {
                returnedValues.push([*el])
            }
        }

        returnedValues
    }
}
