import React from 'react';
import PropTypes from 'prop-types';
import { useRecordContext } from 'react-admin';
import { Edit, SimpleForm, TextField, TextInput } from 'react-admin';
import ReactWaveform from '../../../../components/label_ui/waveform';

const Waveform = () => {
    const record = useRecordContext();
    const { id, seed, label_url, lb1 } = record;
    
    return (
        <ReactWaveform 
            url={label_url} 
            stopButton={true}
            clearSegmentsButton={true}
            controlTable={true}
        />
    )
}

const BigTableEdit = () => {
    
    return (
        <Edit>
            <Waveform />
            
        </Edit>
    );
};

BigTableEdit.propTypes = {
    
};

export default BigTableEdit;