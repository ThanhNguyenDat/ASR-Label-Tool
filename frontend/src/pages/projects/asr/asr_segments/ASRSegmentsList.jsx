import React from 'react';
import PropTypes from 'prop-types';
import { AutocompleteInput, 
    DatagridConfigurable, 
    ExportButton, 
    Link, 
    List, 
    Count,
    ReferenceField, 
    SelectColumnsButton, 
    TextField, 
    TopToolbar, 
    useListContext, 
    useRecordContext, 
    BulkUpdateButton,
    FunctionField,
} from 'react-admin';
import { useMediaQuery, Divider, Tabs, Tab, Theme } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import SubdirectoryArrowLeftOutlinedIcon from '@mui/icons-material/SubdirectoryArrowLeftOutlined';

import Aside from './filtes/ASRLabellingFilterAside';
import MoreDataButton from '../../../../components/buttons/MoreDataButton';

import ASRSegmentsPanel from './ASRSegmentsPanel';
import ASRSegmentsDatagrid from './ASRSegmentsDatagrid';

const ListActions = () => (
    <TopToolbar>
        <MoreDataButton />
        <SelectColumnsButton defaultValue={['id', 'index', 'predict_kaldi', 'predict_wenet']}/>
        <ExportButton maxResults={2000}/>
    </TopToolbar>
);


const TabbedDatagrid = () => {
    const listContext = useListContext();
    const { filterValues, setFilters, displayedFilters } = listContext;
    const handleChange = React.useCallback((event, value) => {
        setFilters && setFilters(
            { ...filterValues, status: value },
            displayedFilters, false
        )
    }, [displayedFilters, filterValues, setFilters])
    console.log(filterValues);

    const tabs = React.useMemo(() =>  [
        { id: 'to_review', name: 'to_review' },
        { id: 'deny', name: 'deny' },
        { id: 'reviewed', name: 'reviewed' },
    ], []);

    return (
        <React.Fragment>
             <Tabs
                variant="fullWidth"
                centered
                value={filterValues.status}
                indicatorColor="primary"
                onChange={handleChange}
                
            >
                {tabs.map(choice => (
                    <Tab
                        key={choice.id}
                        label={
                            <span>
                                {choice.name} (
                                <Count
                                    filter={{
                                        ...filterValues,
                                        status: choice.name,
                                    }}
                                    sx={{ lineHeight: 'inherit' }}
                                />
                                )
                            </span>
                        }
                        value={choice.id}
                    />
                ))}
            </Tabs>
            <Divider />
            <>
                <ASRSegmentsDatagrid />
            </>
        </React.Fragment>
    ); 
}

const ASRSegmentsList = () => {
    return (
        <List
            filterDefaultValues={{ status: null }}
            sort={{ field: 'id', order: 'ASC' }}
            perPage={10}
            actions={<ListActions />}
            // queryOptions={{meta: {_embed: 'users'}}}
            aside={<Aside />}
        >
            <TabbedDatagrid />
        </List>
    );
};

export default ASRSegmentsList;