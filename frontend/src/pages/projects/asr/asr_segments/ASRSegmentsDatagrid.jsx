import React from 'react';
import {
    DatagridConfigurable, 
    ReferenceField, 
    TextField, 
    useRecordContext, 
    BulkUpdateButton,
    EditButton,
    BulkDeleteButton,
    BulkExportButton,
    useResourceContext,
    downloadCSV,
} from 'react-admin';

import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import SubdirectoryArrowLeftOutlinedIcon from '@mui/icons-material/SubdirectoryArrowLeftOutlined';

import ASRSegmentsPanel from './ASRSegmentsPanel';
import PlayPauseButton from '../../../../components/buttons/PlayPauseButton';
import jsonExport from 'jsonexport/dist'
const LabelBulkActionButtons = () => {
    const resouce = useResourceContext()
    
    return (
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
        <BulkDeleteButton />
        <BulkExportButton />
    </>
)}

const CustomLinkField = () => {
    const record = useRecordContext();
    const {label_url} = record;
    if (label_url === 'ERROR') {
        return "ERROR"
    }
    
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

const ASRSegmentsDatagrid = props => {
    return (
        <DatagridConfigurable
            bulkActionButtons={<LabelBulkActionButtons />}
            // rowClick='edit'
            
            expand={<ASRSegmentsPanel />}
            // expandSingle
            isRowExpandable={row => row.id}    
        >
            <TextField source='id'/>
            <TextField source='seed' onClick={(event)=>{console.log(event.target);}}/>
            
            <ReferenceField source="user_id" label="User" reference="users" emptyText="No user">
                <TextField source='uname' />
            </ReferenceField>

            <CustomLinkField source='label_url'/>
            <TextField source='index'/>
            <TextField source='length'/>
            <TextField source='text'/>
            <TextField source='audibility'/>
            <TextField source='noise'/>
            <TextField source='region'/>
            <TextField source='predict_kaldi'/>
            <TextField source='wer_kaldi'/>
            <TextField source='predict_wenet'/>
            <TextField source='wer_wenet'/>
            {/* <EditButton/> */}
            <PlayPauseButton />
        </DatagridConfigurable>
    )
};

ASRSegmentsDatagrid.propTypes = {
    
};

export default ASRSegmentsDatagrid;