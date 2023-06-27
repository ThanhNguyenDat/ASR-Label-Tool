import { FilterList, FilterListItem } from "react-admin";
import CategoryIcon from "@mui/icons-material/LocalOffer";

export default () => {
    const isSelected = (value, filters) => {
        const region = filters.region || [];
        return region.includes(value.region);
    };

    const toggleFilter = (value, filters) => {
        const region = filters.region || [];
        return {
            ...filters,
            region: region.includes(value.region)
                ? // Remove the region if it was already present
                  region.filter((v) => v !== value.region)
                : // Add the region if it wasn't already present
                  [...region, value.region],
        };
    };

    return (
        <FilterList label="Noise" icon={<CategoryIcon />}>
            <FilterListItem
                label="Other"
                value={{ region: "other" }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
            <FilterListItem
                label="Bắc"
                value={{ region: "bắc" }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
            <FilterListItem
                label="Trung"
                value={{ region: "trung" }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
            <FilterListItem
                label="Nam"
                value={{ region: "Nam" }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
        </FilterList>
    );
};
