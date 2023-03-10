#![allow(non_snake_case)]

/* -------------- Import Modules -------------- */

use crate::{consts::*, structs::*};

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
    let mut filterdGroup: Vec<GroupItemStruct> = Vec::new();

    // Loop through groups
    for (index, item) in groups.into_iter().enumerate() {
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
    for item in filterdGroup.into_iter() {
        // Get values
        let values = item.values.unwrap_or(vec![]);

        // Define list of values
        let mut listValues: Vec<f64> = Vec::new();

        // Loop through values
        for value in values.iter() {
            // Check if value is !NaN
            if !value.is_nan() {
                listValues.push(*value)
            }
        }

        // Push item to returnGroups
        returnGroups.push(GroupItemStruct {
            color: item.color.clone(),
            keyValues: item.keyValues.clone(),
            stats: item.stats.clone(),
            values: Some(listValues),
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
    for item in groups.into_iter() {
        // Get values
        let values = item.values.unwrap_or(vec![]);

        // Loop through values
        for (i, el) in values.into_iter().enumerate() {
            // Push item to returnedGroups
            returnedGroups.push(PreprocessItemStruct {
                color: item.color.clone().unwrap_or(DEFAULT_COLOR.to_string()),
                keyValues: item
                    .keyValues
                    .clone()
                    .unwrap_or(KeyValuesStruct { SITE_NUM: None }),
                stats: item.stats.clone().unwrap_or(StatsGroupStruct {
                    Count: None,
                    Cp: None,
                    Cpk: None,
                    Max: None,
                    Mean: None,
                    Min: None,
                    Std: None,
                    cp: None,
                    cpk: None,
                    max: None,
                    mean: None,
                    min: None,
                    std: None,
                }),
                value: el,
                x: i as u32,
                y: el,
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
pub fn groupsValuesList(groups: Vec<GroupItemStruct>) -> Vec<Vec<f64>> {
    // Define returned values
    let mut returnedValues: Vec<Vec<f64>> = Vec::new();

    // Check if groups.len() >= 2
    if groups.len() >= 2 {
        // Loop through groups
        for i in 0..groups.len() - 1 {
            // Get item
            let item = &groups[i];

            // Get next item
            let nextItem = &groups[i + 1];

            // Get values
            let values = &item.values.clone().unwrap_or(vec![]);

            // Get next values
            let nextValues = &nextItem.values.clone().unwrap_or(vec![]);

            if values.len() >= nextValues.len() {
                for (i, el) in values.iter().enumerate() {
                    let elNextValues = nextValues.get(i);

                    let mut list: Vec<f64> = Vec::new();

                    // Check if elNextValues is exist
                    if !elNextValues.is_none() {
                        list.push(*el);
                        list.push(*elNextValues.unwrap());
                    } else {
                        list.push(*el);
                    }

                    returnedValues.push(list);
                }
            } else {
                for (i, el) in nextValues.iter().enumerate() {
                    let item = values.get(i);

                    let mut list: Vec<f64> = Vec::new();

                    // Check if item is exist
                    if !item.is_none() {
                        list.push(*item.unwrap());
                        list.push(*el);
                    } else {
                        list.push(*el);
                    }

                    returnedValues.push(list);
                }
            }
        }
    } else {
        // Loop through groups
        for group in groups.into_iter() {
            // Get values
            let values = group.values.unwrap_or(vec![]);

            // Loop through values
            for value in values {
                let mut list: Vec<f64> = Vec::new();

                list.push(value);

                returnedValues.push(list);
            }
        }
    }

    returnedValues
}
