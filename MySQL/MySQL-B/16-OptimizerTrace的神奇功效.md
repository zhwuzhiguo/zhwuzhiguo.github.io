# 16-OptimizerTrace的神奇功效

MySQL5.6以及之后的版本中，提出了一个`optimizer trace`的功能，可以方便的查看优化器生成执行计划的整个过程。

这个功能的开启与关闭由系统变量`optimizer_trace`决定，默认是关闭的：

    mysql> SHOW VARIABLES LIKE 'optimizer_trace';
    +-----------------+--------------------------+
    | Variable_name   | Value                    |
    +-----------------+--------------------------+
    | optimizer_trace | enabled=off,one_line=off |
    +-----------------+--------------------------+


使用`optimizer trace`功能的步骤：

- 打开`optimizer trace`功能:

      SET optimizer_trace="enabled=on";

- 输入查询语句

      EXPLAIN SELECT ...; 

- 从`OPTIMIZER_TRACE`表查看上一个查询的优化过程

      SELECT * FROM information_schema.OPTIMIZER_TRACE;

- 关闭`optimizer trace`功能

      SET optimizer_trace="enabled=off";

示例：

    mysql> SET optimizer_trace="enabled=on";
    Query OK, 0 rows affected (0.00 sec)
    
    mysql> EXPLAIN SELECT * FROM s1 WHERE key1 > 'z' AND key2 < 1000000 AND key3 IN ('a', 'b', 'c') AND common_field = 'abc';
    +----+-------------+-------+------------+-------+----------------------------+----------+---------+------+------+----------+------------------------------------+
    | id | select_type | table | partitions | type  | possible_keys              | key      | key_len | ref  | rows | filtered | Extra                              |
    +----+-------------+-------+------------+-------+----------------------------+----------+---------+------+------+----------+------------------------------------+
    |  1 | SIMPLE      | s1    | NULL       | range | idx_key2,idx_key1,idx_key3 | idx_key1 | 303     | NULL |    1 |     5.00 | Using index condition; Using where |
    +----+-------------+-------+------------+-------+----------------------------+----------+---------+------+------+----------+------------------------------------+
    1 row in set, 1 warning (0.00 sec)
    
    mysql> SELECT * FROM information_schema.OPTIMIZER_TRACE\G
    *************************** 1. row ***************************
                                QUERY: EXPLAIN SELECT * FROM s1 WHERE key1 > 'z' AND key2 < 1000000 AND key3 IN ('a', 'b', 'c') AND common_field = 'abc'
                                TRACE: {
      "steps": [
        {
          "join_preparation": {
            "select#": 1,
            "steps": [
              {
                "IN_uses_bisection": true
              },
              {
                "expanded_query": "/* select#1 */ select `s1`.`id` AS `id`,`s1`.`key1` AS `key1`,`s1`.`key2` AS `key2`,`s1`.`key3` AS `key3`,`s1`.`key_part1` AS `key_part1`,`s1`.`key_part2` AS `key_part2`,`s1`.`key_part3` AS `key_part3`,`s1`.`common_field` AS `common_field` from `s1` where ((`s1`.`key1` > 'z') and (`s1`.`key2` < 1000000) and (`s1`.`key3` in ('a','b','c')) and (`s1`.`common_field` = 'abc'))"
              }
            ]
          }
        },
        {
          "join_optimization": {
            "select#": 1,
            "steps": [
              {
                "condition_processing": {
                  "condition": "WHERE",
                  "original_condition": "((`s1`.`key1` > 'z') and (`s1`.`key2` < 1000000) and (`s1`.`key3` in ('a','b','c')) and (`s1`.`common_field` = 'abc'))",
                  "steps": [
                    {
                      "transformation": "equality_propagation",
                      "resulting_condition": "((`s1`.`key1` > 'z') and (`s1`.`key2` < 1000000) and (`s1`.`key3` in ('a','b','c')) and (`s1`.`common_field` = 'abc'))"
                    },
                    {
                      "transformation": "constant_propagation",
                      "resulting_condition": "((`s1`.`key1` > 'z') and (`s1`.`key2` < 1000000) and (`s1`.`key3` in ('a','b','c')) and (`s1`.`common_field` = 'abc'))"
                    },
                    {
                      "transformation": "trivial_condition_removal",
                      "resulting_condition": "((`s1`.`key1` > 'z') and (`s1`.`key2` < 1000000) and (`s1`.`key3` in ('a','b','c')) and (`s1`.`common_field` = 'abc'))"
                    }
                  ]
                }
              },
              {
                "substitute_generated_columns": {
                }
              },
              {
                "table_dependencies": [
                  {
                    "table": "`s1`",
                    "row_may_be_null": false,
                    "map_bit": 0,
                    "depends_on_map_bits": [
                    ]
                  }
                ]
              },
              {
                "ref_optimizer_key_uses": [
                ]
              },
              {
                "rows_estimation": [
                  {
                    "table": "`s1`",
                    "range_analysis": {
                      "table_scan": {
                        "rows": 9781,
                        "cost": 2055.3
                      },
                      "potential_range_indexes": [
                        {
                          "index": "PRIMARY",
                          "usable": false,
                          "cause": "not_applicable"
                        },
                        {
                          "index": "idx_key2",
                          "usable": true,
                          "key_parts": [
                            "key2"
                          ]
                        },
                        {
                          "index": "idx_key1",
                          "usable": true,
                          "key_parts": [
                            "key1",
                            "id"
                          ]
                        },
                        {
                          "index": "idx_key3",
                          "usable": true,
                          "key_parts": [
                            "key3",
                            "id"
                          ]
                        },
                        {
                          "index": "idx_key_part",
                          "usable": false,
                          "cause": "not_applicable"
                        }
                      ],
                      "setup_range_conditions": [
                      ],
                      "group_index_range": {
                        "chosen": false,
                        "cause": "not_group_by_or_distinct"
                      },
                      "analyzing_range_alternatives": {
                        "range_scan_alternatives": [
                          {
                            "index": "idx_key2",
                            "ranges": [
                              "NULL < key2 < 1000000"
                            ],
                            "index_dives_for_eq_ranges": true,
                            "rowid_ordered": false,
                            "using_mrr": false,
                            "index_only": false,
                            "rows": 10000,
                            "cost": 12001,
                            "chosen": false,
                            "cause": "cost"
                          },
                          {
                            "index": "idx_key1",
                            "ranges": [
                              "z < key1"
                            ],
                            "index_dives_for_eq_ranges": true,
                            "rowid_ordered": false,
                            "using_mrr": false,
                            "index_only": false,
                            "rows": 1,
                            "cost": 2.21,
                            "chosen": true
                          },
                          {
                            "index": "idx_key3",
                            "ranges": [
                              "a <= key3 <= a",
                              "b <= key3 <= b",
                              "c <= key3 <= c"
                            ],
                            "index_dives_for_eq_ranges": true,
                            "rowid_ordered": false,
                            "using_mrr": false,
                            "index_only": false,
                            "rows": 3,
                            "cost": 6.61,
                            "chosen": false,
                            "cause": "cost"
                          }
                        ],
                        "analyzing_roworder_intersect": {
                          "usable": false,
                          "cause": "too_few_roworder_scans"
                        }
                      },
                      "chosen_range_access_summary": {
                        "range_access_plan": {
                          "type": "range_scan",
                          "index": "idx_key1",
                          "rows": 1,
                          "ranges": [
                            "z < key1"
                          ]
                        },
                        "rows_for_plan": 1,
                        "cost_for_plan": 2.21,
                        "chosen": true
                      }
                    }
                  }
                ]
              },
              {
                "considered_execution_plans": [
                  {
                    "plan_prefix": [
                    ],
                    "table": "`s1`",
                    "best_access_path": {
                      "considered_access_paths": [
                        {
                          "rows_to_scan": 1,
                          "access_type": "range",
                          "range_details": {
                            "used_index": "idx_key1"
                          },
                          "resulting_rows": 0.05,
                          "cost": 2.41,
                          "chosen": true
                        }
                      ]
                    },
                    "condition_filtering_pct": 100,
                    "rows_for_plan": 0.05,
                    "cost_for_plan": 2.41,
                    "chosen": true
                  }
                ]
              },
              {
                "attaching_conditions_to_tables": {
                  "original_condition": "((`s1`.`key1` > 'z') and (`s1`.`key2` < 1000000) and (`s1`.`key3` in ('a','b','c')) and (`s1`.`common_field` = 'abc'))",
                  "attached_conditions_computation": [
                  ],
                  "attached_conditions_summary": [
                    {
                      "table": "`s1`",
                      "attached": "((`s1`.`key1` > 'z') and (`s1`.`key2` < 1000000) and (`s1`.`key3` in ('a','b','c')) and (`s1`.`common_field` = 'abc'))"
                    }
                  ]
                }
              },
              {
                "refine_plan": [
                  {
                    "table": "`s1`",
                    "pushed_index_condition": "(`s1`.`key1` > 'z')",
                    "table_condition_attached": "((`s1`.`key2` < 1000000) and (`s1`.`key3` in ('a','b','c')) and (`s1`.`common_field` = 'abc'))"
                  }
                ]
              }
            ]
          }
        },
        {
          "join_explain": {
            "select#": 1,
            "steps": [
            ]
          }
        }
      ]
    }
    MISSING_BYTES_BEYOND_MAX_MEM_SIZE: 0
              INSUFFICIENT_PRIVILEGES: 0
    1 row in set (0.00 sec)
    
    mysql> SET optimizer_trace="enabled=off";
    Query OK, 0 rows affected (0.00 sec)

# 完