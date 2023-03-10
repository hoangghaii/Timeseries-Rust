#![allow(non_snake_case)]

use wasm::checkApprox;
use wasm::{data_preprocess::*, structs::*, utils::*};

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_check_approx() {
        let point = 0.0001;
        let coord = 0.0002;
        let epsilon = 0.0001;

        let result = checkApprox(Some(point), Some(coord), Some(epsilon));

        assert_eq!(result, true);
    }

    #[test]
    fn test_groups_values_list() {
        let group1 = GroupItemStruct {
            keyValues: None,
            color: None,
            stats: None,
            values: Some(vec![1.0, 2.0, 3.0]),
        };

        // Vec::new(1.0, 2.0, 3.0);

        let group2 = GroupItemStruct {
            keyValues: None,
            color: None,
            stats: None,
            values: Some(vec![4.0, 5.0, 6.0]),
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
            values: Some(vec![1.5, 2.3, 7.1]),
        };

        let groups = vec![group1, group2, group3, group4];

        let result = groupsValuesList(groups);

        let expected_output: Vec<Vec<f64>> = vec![
            [1.0, 4.0],
            [2.0, 5.0],
            [3.0, 6.0],
            [4.0, 6.0],
            [5.0, 7.0],
            [6.0, 8.0],
            [6.0, 1.5],
            [7.0, 2.3],
            [8.0, 7.1],
        ]
        .iter()
        .map(|list| list.to_vec())
        .collect::<Vec<Vec<f64>>>();

        assert_eq!(result, expected_output);
    }

    #[test]
    fn test_filterGroups() {
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
            values: Some(vec![4.0, 5.0, 6.0]),
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
            values: Some(vec![1.5, 2.3, 7.1]),
        };

        let groups = vec![group1, group2, group3, group4];

        let hiddenGroups = vec![1, 3];

        let filterGroups = filterGroup(groups, hiddenGroups);

        let expectedFilterGroups = vec![
            GroupItemStruct {
                keyValues: None,
                color: None,
                stats: None,
                values: Some(vec![1.0, 2.0, 3.0]),
            },
            GroupItemStruct {
                keyValues: None,
                color: None,
                stats: None,
                values: Some(vec![6.0, 7.0, 8.0]),
            },
        ];

        assert_eq!(filterGroups, expectedFilterGroups);
    }

    #[test]
    fn test_preprocessGroups() {
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
            values: Some(vec![4.0, 5.0, 6.0]),
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
            values: Some(vec![1.5, 2.3, 7.1]),
        };

        let groups = vec![group1, group2, group3, group4];

        let hiddenGroups = vec![1, 3];

        let filterGroups = filterGroup(groups, hiddenGroups);

        let preprocessGroups = preprocess(filterGroups.clone());

        let expectedPreprocessGroups = vec![
            PreprocessItemStruct {
                color: "#27ae60".to_string(),
                keyValues: KeyValuesStruct { SITE_NUM: None },
                stats: StatsGroupStruct {
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
                },
                value: 1.0,
                x: 0,
                y: 1.0,
            },
            PreprocessItemStruct {
                color: "#27ae60".to_string(),
                keyValues: KeyValuesStruct { SITE_NUM: None },
                stats: StatsGroupStruct {
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
                },
                value: 2.0,
                x: 1,
                y: 2.0,
            },
            PreprocessItemStruct {
                color: "#27ae60".to_string(),
                keyValues: KeyValuesStruct { SITE_NUM: None },
                stats: StatsGroupStruct {
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
                },
                value: 3.0,
                x: 2,
                y: 3.0,
            },
            PreprocessItemStruct {
                color: "#27ae60".to_string(),
                keyValues: KeyValuesStruct { SITE_NUM: None },
                stats: StatsGroupStruct {
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
                },
                value: 6.0,
                x: 0,
                y: 6.0,
            },
            PreprocessItemStruct {
                color: "#27ae60".to_string(),
                keyValues: KeyValuesStruct { SITE_NUM: None },
                stats: StatsGroupStruct {
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
                },
                value: 7.0,
                x: 1,
                y: 7.0,
            },
            PreprocessItemStruct {
                color: "#27ae60".to_string(),
                keyValues: KeyValuesStruct { SITE_NUM: None },
                stats: StatsGroupStruct {
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
                },
                value: 8.0,
                x: 2,
                y: 8.0,
            },
        ];

        assert_eq!(preprocessGroups, expectedPreprocessGroups);
    }

    #[test]
    fn test_groupsValues() {
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
            values: Some(vec![4.0, 5.0, 6.0]),
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
            values: Some(vec![1.5, 2.3, 7.1]),
        };

        let groups = vec![group1, group2, group3, group4];

        let hiddenGroups = vec![1, 3];

        let filterGroups = filterGroup(groups, hiddenGroups);

        let groupsValues = groupsValuesList(filterGroups.clone());

        let expectedGroupsValues = vec![vec![1.0, 6.0], vec![2.0, 7.0], vec![3.0, 8.0]];

        assert_eq!(groupsValues, expectedGroupsValues);
    }

    #[test]
    fn test_domain() {
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
            values: Some(vec![4.0, 5.0, 6.0]),
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
            values: Some(vec![1.5, 2.3, 7.1]),
        };

        let groups = vec![group1, group2, group3, group4];

        let hiddenGroups = vec![1, 3];

        let filterGroups = filterGroup(groups, hiddenGroups);

        let preprocessGroups = preprocess(filterGroups.clone());

        let domain = getDomain(preprocessGroups.clone());

        let expectedDomain = ([-1, 5], [0.9999, 8.0001]);

        assert_eq!(domain, expectedDomain);
    }

    #[test]
    fn test_shouldShowLimit() {
        let HI_LIMIT = -0.44201892614364624;
        let LO_LIMIT = -0.4467531909942627;

        let showLimit = shouldShowLimit(HI_LIMIT, LO_LIMIT);

        let expectedShowLimit = (-0.4467531909942627, -0.44201892614364624);

        assert_eq!(showLimit, expectedShowLimit);
    }
}
