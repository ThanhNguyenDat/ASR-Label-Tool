import React, {
    HtmlHTMLAttributes,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Box,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from "@mui/material";

import { useListContext, useResourceContext } from "ra-core";
import { Button, useDataProvider } from "react-admin";

import ContentFilter from "@mui/icons-material/FilterList";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOffOutlinedIcon from "@mui/icons-material/FilterListOffOutlined";
import { Operators } from "../../config/filterOperators";
import { convertFilters, parseOperator } from "../../helpers/common";
import "./styles.scss";

const FilterButton = (props: FilterButtonProps): JSX.Element => {
    // const filters = useContext(FilterContext) || filtersProp;
    const resource = useResourceContext(props);
    const { filterValues, setFilters } = useListContext(props);

    const dataProvider = useDataProvider();
    const [columnNames, setColumnNames] = useState([]);
    useEffect(() => {
        dataProvider.getColumnNames(resource).then((res) => {
            setColumnNames(res.data);
        });
    }, [resource, dataProvider]);

    const [listFilters, setListFilters] = useState(() =>
        Object.keys(filterValues).map((key) => {
            const { property, operator, value } = parseOperator(key, filterValues[key]);
            return {
                field: property,
                operator: operator,
                value,
            };
        })
    );

    const [open, setOpen] = useState(false);
    const anchorEl = useRef();

    const handleClickButton = useCallback(
        (event) => {
            // This prevents ghost click.
            event.preventDefault();
            setOpen(true);
            anchorEl.current = event.currentTarget;
        },
        [anchorEl, setOpen]
    );

    const handleRequestClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const handleAddMoreFilter = () => {
        const newFilter = {
            field: "",
            operator: "contain",
            value: "",
        };
        setListFilters([...listFilters, newFilter]);
    };

    const handleDeleteFilter = (index) => {
        const updatedFilters = listFilters.filter((_, i) => i !== index);
        setListFilters(updatedFilters);
        updateFilterValues(updatedFilters);
    };

    const updateFilterValues = (listFilters) => {
        const convertedFilters = convertFilters(listFilters);
        // todo: handle displayFilterValue
        setFilters({ ...convertedFilters }, {}, false);
    };

    const handleChangeField = (index, value) => {
        const updatedValue = [...listFilters];
        updatedValue[index].field = value;
        setListFilters([...updatedValue]);
        updateFilterValues(updatedValue);
    };

    const handleChangeOperator = (index, value) => {
        const updatedValue = [...listFilters];
        updatedValue[index].operator = value;
        setListFilters([...updatedValue]);
        updateFilterValues(updatedValue);
    };

    const handleChangeValue = (index, value) => {
        const updatedValue = [...listFilters];
        updatedValue[index].value = value;
        setListFilters([...updatedValue]);
        updateFilterValues(updatedValue);
    };

    const handleFilterButton = () => {
        updateFilterValues(listFilters);
    };

    const handleClearAllFilterButton = () => {
        setListFilters([]);
        updateFilterValues([]);
    };

    return (
        <div className="filter-button">
            <Button
                className="add-filter"
                label="ra.action.add_filter"
                aria-haspopup="true"
                onClick={handleClickButton}
            >
                <ContentFilter />
            </Button>
            <Menu
                open={open}
                anchorEl={anchorEl.current}
                onClose={handleRequestClose}
                className="filter-menu"
            >
                <Box padding={"8px"}>
                    {listFilters.map((filter, index) => {
                        const { field, operator, value } = filter;

                        return (
                            <li key={index}>
                                <Box display="flex" columnGap={"10px"}>
                                    <Box sx={{ width: 150 }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="field-select-label">Field</InputLabel>
                                            <Select
                                                labelId="field-select-label"
                                                id="field-select"
                                                value={field}
                                                label="Field"
                                                onChange={(event) =>
                                                    handleChangeField(index, event.target.value)
                                                }
                                            >
                                                {columnNames &&
                                                    columnNames.map((column, index) => (
                                                        <MenuItem key={index} value={column}>
                                                            {column}
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box sx={{ width: 100 }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="operator-select-label">
                                                Operator
                                            </InputLabel>
                                            <Select
                                                labelId="operator-select-label"
                                                id="operator-select"
                                                label="Operator"
                                                value={operator}
                                                onChange={(event) =>
                                                    handleChangeOperator(index, event.target.value)
                                                }
                                            >
                                                {Object.entries(Operators).map(([key, value]) => (
                                                    <MenuItem key={key} value={key}>
                                                        {value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <TextField
                                        value={value}
                                        id="value-standard"
                                        label="Value"
                                        variant="standard"
                                        onChange={(event) =>
                                            handleChangeValue(index, event.target.value)
                                        }
                                    />
                                    <Tooltip title="Delete" placement="top">
                                        <IconButton
                                            onClick={() => handleDeleteFilter(index)}
                                            style={{ color: "red" }}
                                        >
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </li>
                        );
                    })}
                </Box>
                <Divider />
                <Tooltip title="Add more filter">
                    <IconButton onClick={handleAddMoreFilter} style={{ color: "blueviolet" }}>
                        <AddCircleOutlinedIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Search">
                    <IconButton onClick={handleFilterButton} style={{ color: "gray" }}>
                        <SearchOutlinedIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Clear all filter">
                    <IconButton onClick={handleClearAllFilterButton} style={{ color: "red" }}>
                        <FilterListOffOutlinedIcon />
                    </IconButton>
                </Tooltip>
            </Menu>
        </div>
    );
};

export interface FilterButtonProps extends HtmlHTMLAttributes<HTMLDivElement> {
    className?: string;
    resource?: string;
    filterValues?: any;
    showFilter?: (filterName: string, defaultValue: any) => void;
    displayedFilters?: any;
    filters?: ReactNode[];
    disableSaveQuery?: boolean;
}
export default FilterButton;
