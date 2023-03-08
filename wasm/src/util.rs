#![allow(non_snake_case)]
#![allow(unused_assignments)]

use crate::data_preprocess::*;

pub fn getDomain(groups: Vec<PreprocessItemStruct>) -> ([i32; 2], [f64; 2]) {
    let mut xDomain: [i32; 2] = [0, 0];
    let mut yDomain: [f64; 2] = [0.0, 0.0];

    if groups.len() == 0 || groups.is_empty() {
        xDomain = [-1, 0];
        yDomain = [0.0, 0.0];
    } else {
        let mut sortedByY = groups.clone();
        sortedByY.sort_by(|a, b| a.y.partial_cmp(&b.y).unwrap());

        let minY = sortedByY[0].y;
        let maxY = sortedByY[sortedByY.len() - 1].y;

        yDomain = [minY - 0.0001, maxY + 0.0001];

        let mut sortedByX = groups.clone();
        sortedByX.sort_by(|a, b| a.x.partial_cmp(&b.x).unwrap());

        let maxX = sortedByX[sortedByX.len() - 1].x as i32;

        xDomain = [-1, maxX + 3];
    }

    let domain = (xDomain, yDomain);

    domain
}

pub fn shouldShowLimit(hiLimit: f64, loLimit: f64) -> (f64, f64) {
    let mut lowLimit: f64 = 0.0;
    let mut hightLimit: f64 = 0.0;

    if !loLimit.is_nan() && !hiLimit.is_nan() && loLimit < hiLimit {
        lowLimit = loLimit;
        hightLimit = hiLimit;
    }
    if !loLimit.is_nan() && hiLimit.is_nan() {
        lowLimit = loLimit;
    }
    if loLimit.is_nan() && !hiLimit.is_nan() {
        hightLimit = hiLimit;
    }

    let shouldShowLimit = (lowLimit, hightLimit);

    shouldShowLimit
}
