import { FilterList, FilterListItem } from 'react-admin';
import CategoryIcon from '@mui/icons-material/LocalOffer';

export default () => {
    const isSelected = (value, filters) => {
        const noise = filters.noise || [];
        return noise.includes(value.noise);
    };

    const toggleFilter = (value, filters) => {
        const noise = filters.noise || [];
        return {
            ...filters,
            noise: noise.includes(value.noise)
                // Remove the noise if it was already present
                ? noise.filter(v => v !== value.noise)
                // Add the noise if it wasn't already present
                : [...noise, value.noise],
        };
    };

    return (
        <FilterList label="Noise" icon={<CategoryIcon />}>
            <FilterListItem
                label="Heavy"
                value={{ noise: 'heavy' }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
            <FilterListItem
                label="Medium"
                value={{ noise: 'medium' }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
            <FilterListItem
                label="Light"
                value={{ noise: 'light' }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
            <FilterListItem
                label="Clean"
                value={{ noise: 'clean' }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
        </FilterList>
    )
}