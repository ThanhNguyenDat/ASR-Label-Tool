import React from 'react';
import PropTypes from 'prop-types';
import { AutocompleteInput, 
    ChipField, 
    DatagridConfigurable, 
    ExportButton, 
    FilterButton, 
    Link, 
    List, 
    Count,
    NullableBooleanInput, 
    ReferenceField, 
    ReferenceInput, 
    ReferenceManyField, 
    SearchInput, 
    SelectColumnsButton, 
    SingleFieldList, 
    TextField, 
    TextInput, 
    TopToolbar, 
    useListContext, 
    useNotify, 
    useRecordContext, 
    useRedirect,
    Button,
    BulkUpdateButton,
} from 'react-admin';
import { useMediaQuery, Divider, Tabs, Tab, Theme } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import SubdirectoryArrowLeftOutlinedIcon from '@mui/icons-material/SubdirectoryArrowLeftOutlined';

import Aside from './ASRLabellingFilterAside';


const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton />
        {/* <FilterButton /> */}
        <ExportButton />
    </TopToolbar>
);

const ASRLabellingList = () => {
    return (
        <List
            filterDefaultValues={{ status: null }}
            sort={{ field: 'id', order: 'ASC' }}
            perPage={10}
            actions={<ListActions />}
            queryOptions={{meta: {_embed: 'users'}}}
            aside={<Aside />}
        >
            <ASRLabelDatagrid />
        </List>
    );
};

const CustomLinkField = () => {
    const record = useRecordContext();
    const {label_url} = record;
    
    return (
        <a 
            href={label_url} 
            target="_blank" 
            rel="noopener noreferrer"
        >
        Open Link
      </a>
    );
  };

const LabelBulkActionButtons = () => (
    <>
        <BulkUpdateButton 
            label="To Review" 
            icon={<SubdirectoryArrowLeftOutlinedIcon />}
            data={{status: "to_review"}}
        />

        <BulkUpdateButton 
            label="Accept" 
            icon={<ThumbUpOutlinedIcon />}
            data={{status: "reviewed"}}
        />

        <BulkUpdateButton 
            label="Deny" 
            icon={<ThumbDownOffAltOutlinedIcon />}
            data={{status: "deny"}}
            style={{
                color: "red"
            }}
        />
    </>
)

const TabbedDatagrid = () => {
    return (

    <DatagridConfigurable
        bulkActionButtons={<LabelBulkActionButtons />}
    >
        <TextField source='id'/>
        <ReferenceField source="user_id" label="User" reference="users" emptyText="No user">
            <TextField source='username' />
        </ReferenceField>

        <TextField source='seed'/>
        
        {/* <TextField source='label_url'/>  */}
        <CustomLinkField source='label_url'/>
        <TextField source='index'/>
        <TextField source='length'/>
        <TextField source='text'/>
        <TextField source='audibility'/>
        <TextField source='noise'/>
        <TextField source='region'/>
        <TextField source='text_kaldi'/>
        <TextField source='wer_kaldi'/>
        <TextField source='text_wenet'/>
        <TextField source='wer_wenet'/>
       
    </DatagridConfigurable>
    )
}

const ASRLabelDatagrid = () => {
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
        { id: 'to_review', name: 'to_review' || '' },
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
                <TabbedDatagrid />
                
            </>
        </React.Fragment>
    ); 
}


ASRLabellingList.propTypes = {
    
};

export default ASRLabellingList;