import React from 'react';
import PropTypes from 'prop-types';

import {
    ExportButton, 
    List, 
    Count,
    SelectColumnsButton, 
    TopToolbar, 
    useListContext,  
    TextField,  
    DatagridConfigurable,
    FilterButton,
    TextInput
} from 'react-admin';
import PlayPauseButton from '../../../../components/buttons/PlayPauseButton';
import ASRBenchmarkDatagridExpand from './ASRBenchmarkDatagridExpand';
import './styles.scss';

const fieldfilters = [
    <TextInput label="Search" source="q" alwaysOn />,
    <TextInput label="Seed" source="seed"/>,
    <TextInput label="Full Text" source="full_text"/>,
];


const ListActions = () => (
    <TopToolbar>
        <FilterButton />
        <SelectColumnsButton 
            defaultValue={['seed', 'full_text', 'wer_google', 'wer_kaldi', 'wer_wenet']}
        />
        <ExportButton maxResults={1e9}/>
    </TopToolbar>
);

const ASRBenchmarkGoogleList = props => {
    return (
        <List
            filters={fieldfilters}
            actions={<ListActions />}
            sort={{ field: 'id', order: 'ASC' }}
            perPage={10}
            className='asr-benchmark-list'
        >
            <DatagridConfigurable
                // omit={['seed', 'full_text', 'wer_google', 'wer_kaldi', 'wer_wenet']}
                omit={['id', 'label_url', 'predict_google', 'predict_kaldi', 'predict_wenet']}
                expand={<ASRBenchmarkDatagridExpand />}
                className='asr-benchmark-datagrid'
            >
                <TextField source="id" cellClassName='id'/>
                <TextField source="seed" cellClassName='seed'/>
                <TextField source="label_url" cellClassName='label_url'/>
                <TextField source="full_text" cellClassName='full_text' />
                <TextField source="predict_google" cellClassName='predict_google' />
                <TextField source="wer_google" cellClassName='wer_google' />
                <TextField source="predict_kaldi" cellClassName='predict_kaldi' />
                <TextField source="wer_kaldi" cellClassName='wer_kaldi' />
                <TextField source="predict_wenet" cellClassName='predict_wenet' />
                <TextField source="wer_wenet" cellClassName='wer_wenet' />
                <PlayPauseButton />
            </DatagridConfigurable>
        </List>
    );
};

ASRBenchmarkGoogleList.propTypes = {
    
};

export default ASRBenchmarkGoogleList;