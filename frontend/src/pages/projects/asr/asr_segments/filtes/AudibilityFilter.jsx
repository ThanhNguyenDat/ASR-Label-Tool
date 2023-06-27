import { FilterList, FilterListItem } from "react-admin";
import CategoryIcon from "@mui/icons-material/LocalOffer";

export default () => {
    const isSelected = (value, filters) => {
        const audibility = filters.audibility || [];
        return audibility.includes(value.audibility);
    };

    const toggleFilter = (value, filters) => {
        const audibility = filters.audibility || [];
        return {
            ...filters,
            audibility: audibility.includes(value.audibility)
                ? // Remove the audibility if it was already present
                  audibility.filter((v) => v !== value.audibility)
                : // Add the audibility if it wasn't already present
                  [...audibility, value.audibility],
        };
    };

    return (
        <FilterList label="Audibility" icon={<CategoryIcon />}>
            <FilterListItem
                label="Good"
                value={{ audibility: "good" }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
            <FilterListItem
                label="Audible"
                value={{ audibility: "audible" }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
            <FilterListItem
                label="Bad"
                value={{ audibility: "bad" }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
        </FilterList>
    );
};
