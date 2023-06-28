//sequelize
// where: {
//     [Op.and]: [{ a: 5 }, { b: 6 }],            // (a = 5) AND (b = 6)
//     [Op.or]: [{ a: 5 }, { b: 6 }],             // (a = 5) OR (b = 6)
//     someAttribute: {
//       // Basics
//       [Op.eq]: 3,                              // = 3
//       [Op.ne]: 20,                             // != 20
//       [Op.is]: null,                           // IS NULL
//       [Op.not]: true,                          // IS NOT TRUE
//       [Op.or]: [5, 6],                         // (someAttribute = 5) OR (someAttribute = 6)

//       // Using dialect specific column identifiers (PG in the following example):
//       [Op.col]: 'user.organization_id',        // = "user"."organization_id"

//       // Number comparisons
//       [Op.gt]: 6,                              // > 6
//       [Op.gte]: 6,                             // >= 6
//       [Op.lt]: 10,                             // < 10
//       [Op.lte]: 10,                            // <= 10
//       [Op.between]: [6, 10],                   // BETWEEN 6 AND 10
//       [Op.notBetween]: [11, 15],               // NOT BETWEEN 11 AND 15

//       // Other operators

//       [Op.all]: sequelize.literal('SELECT 1'), // > ALL (SELECT 1)

//       [Op.in]: [1, 2],                         // IN [1, 2]
//       [Op.notIn]: [1, 2],                      // NOT IN [1, 2]

//       [Op.like]: '%hat',                       // LIKE '%hat'
//       [Op.notLike]: '%hat',                    // NOT LIKE '%hat'
//       [Op.startsWith]: 'hat',                  // LIKE 'hat%'
//       [Op.endsWith]: 'hat',                    // LIKE '%hat'
//       [Op.substring]: 'hat',                   // LIKE '%hat%'
//       [Op.iLike]: '%hat',                      // ILIKE '%hat' (case insensitive) (PG only)
//       [Op.notILike]: '%hat',                   // NOT ILIKE '%hat'  (PG only)
//       [Op.regexp]: '^[h|a|t]',                 // REGEXP/~ '^[h|a|t]' (MySQL/PG only)
//       [Op.notRegexp]: '^[h|a|t]',              // NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
//       [Op.iRegexp]: '^[h|a|t]',                // ~* '^[h|a|t]' (PG only)
//       [Op.notIRegexp]: '^[h|a|t]',             // !~* '^[h|a|t]' (PG only)

//       [Op.any]: [2, 3],                        // ANY (ARRAY[2, 3]::INTEGER[]) (PG only)
//       [Op.match]: Sequelize.fn('to_tsquery', 'fat & rat') // match text search for strings 'fat' and 'rat' (PG only)

//       // In Postgres, Op.like/Op.iLike/Op.notLike can be combined to Op.any:
//       [Op.like]: { [Op.any]: ['cat', 'hat'] }  // LIKE ANY (ARRAY['cat', 'hat'])

//       // There are more postgres-only range operators, see below
//     }
//   }

export const Operators = {
    eq: "=", // = 3 //// done
    ne: "!=", // != 20 //// done
    gt: ">", // > 6 //// done
    gte: ">=", // >= 6 //// done
    lt: "<", // < 10 //// done
    lte: "<=", //// done
    in: "IN", // IN [1, 2] //// done
    notIn: "NOT IN", //// done
    like: "LIKE", // LIKE '%hat' //// done
    notLike: "NOT LIKE", // NOT LIKE '%hat' //// done
    startsWith: "startsWith", // LIKE 'hat%' //// done
    endsWith: "endsWith", // LIKE '%hat' //// done
    contain: "contain", // LIKE '%hat%' //// done

    //
    // "and": "AND",  // [{ a: 5 }, { b: 6 }], // (a = 5) AND (b = 6)
    // "or": "OR", //  [{ a: 5 }, { b: 6 }], // (a = 5) OR (b = 6)
    // "is": "IS", // IS NULL
    // "not": "IS NOT", // IS NOT TRUE
    // "col": "col", // = "user"."organization_id"
    // "between": "between" , // BETWEEN 6 AND 10
    // "notBetween": "not between",  // NOT BETWEEN 11 AND 15
    // "all": "> ALL", // > ALL (SELECT 1)
    // "iLike": "ILIKE", // ILIKE '%hat' (case insensitive) (PG only)
    // "notILike": "NOT ILIKE", // NOT ILIKE '%hat'  (PG only)
    // "regexp": "REGEXP/~", // REGEXP/~ '^[h|a|t]' (MySQL/PG only)
    // "notRegexp": "NOT REGEXP/!~", // NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
    // "iRegexp": "~*", // ~* '^[h|a|t]' (PG only)
    // "notIRegexp":  "!~*", // !~* '^[h|a|t]' (PG only)
    // "any": "ANY", // ANY (ARRAY[2, 3]::INTEGER[]) (PG only)
};
