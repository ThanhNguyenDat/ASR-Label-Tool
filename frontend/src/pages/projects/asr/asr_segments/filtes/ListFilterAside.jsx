import React from "react";
import PropTypes from "prop-types";
import CategoryIcon from "@mui/icons-material/LocalOffer";
import { FilterListItem, FilterList } from "react-admin";

const ListFilterAside = ({
    label,
    icon,
    filterBy,
    values,

    ...props
}) => {
    if (!values || !label || !filterBy) return null;

    const isSelected = (value, filters) => {
        const _filters = filters[filterBy] || [];
        return _filters.includes(value[filterBy]);
    };

    const toggleFilter = (value, filters) => {
        const _filters = filters[filterBy] || [];

        return {
            ...filters,
            [filterBy]: _filters.includes(value[filterBy])
                ? // Remove the noise if it was already present
                  _filters.filter((v) => v !== value[filterBy])
                : // Add the noise if it wasn't already present
                  [..._filters, value[filterBy]],
        };
    };
    console.log(values);
    return (
        <FilterList label={label || ""} icon={icon || <CategoryIcon />} {...props}>
            {values.map((item, index) => {
                console.log(item);
                console.log(item.value);
                return (
                    <FilterListItem
                        key={index}
                        label={item?.label || item?.value}
                        value={{ filterBy: item?.value }}
                        isSelected={isSelected}
                        toggleFilter={toggleFilter}
                    />
                );
            })}
        </FilterList>
    );
};

ListFilterAside.propTypes = {};

export default ListFilterAside;
