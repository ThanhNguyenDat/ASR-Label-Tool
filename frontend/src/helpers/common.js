import { Operators } from "../config/filterOperators";

export const parseOperator = (key, value, separator = "|op=") => {
    if (key.includes(separator)) {
        const [prop, op] = key.split(separator);
        if (!Object.prototype.hasOwnProperty.call(Operators, op)) {
            throw new Error(`Invalid Filter Condition/Operator (${op})`);
        }
        return {
            property: prop,
            operator: Operators[op],
            value,
        };
    }
    // this is handling the default - which is an Equal if value is it's a string or number, or an IN if we received an Array.
    return {
        property: key,
        operator: Array.isArray(value) ? Operators.in : Operators.eq,
        value,
    };
};

export const convertFilters = (filters) => {
    const convertedFilters = {};
    filters.forEach((filter) => {
        const { field, operator, value } = filter;
        const key = `${field}|op=${operator}`;
        convertedFilters[key] = value;
    });
    return convertedFilters;
};
