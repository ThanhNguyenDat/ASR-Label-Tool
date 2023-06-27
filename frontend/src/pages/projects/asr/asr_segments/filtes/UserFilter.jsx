import React from "react";
import PropTypes from "prop-types";
import { FilterList, FilterListItem } from "react-admin";

const UserFilter = ({ values }) => {
    const isSelected = (value, filters) => {
        const user_id = filters.user_id || [];
        return user_id.includes(value.user_id);
    };

    const toggleFilter = (value, filters) => {
        const user_id = filters.user_id || [];
        return {
            ...filters,
            user_id: user_id.includes(value.user_id)
                ? // Remove the user_id if it was already present
                  user_id.filter((v) => v !== value.user_id)
                : // Add the user_id if it wasn't already present
                  [...user_id, value.user_id],
        };
    };
    // source="user_id" reference="users"
    return (
        <FilterList label="Username">
            <FilterListItem
                label="Lê Thành Hải"
                value={{ user_id: 563 }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
            <FilterListItem
                label="Nguyễn Đạt Thành"
                value={{ user_id: 564 }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
            <FilterListItem
                label="Đào Tấn Phát"
                value={{ user_id: 575 }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
        </FilterList>
    );
};

UserFilter.propTypes = {};

export default UserFilter;
