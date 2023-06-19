import React from 'react';

import {
    Button, 
    useDataProvider, 
    useNotify, 
    useRefresh,
    useRecordContext
} from 'react-admin';
import { useMutation } from 'react-query';
import { Tooltip, IconButton } from '@mui/material';
import EditNotificationsIcon from '@mui/icons-material/EditNotifications';
import dataProvider from '../../dataProvider';

const UpdatePredictButton = props => {
    const dataProvider = useDataProvider();
    const refresh = useRefresh();
    const notify = useNotify();

    const record = useRecordContext();
    const {seed, id, label_url, index, length} = record;
    const request_data = {
        'seed': seed,
        'item_id': id,
        'id': id,
        'start_time': index,
        'end_time': index + length,
        'url': label_url,
    }
    
    // todo: 2 huong: 1 su dung updateOne, 2 la tiep tuc huong di nay
    const {mutate, isLoading, error, isSuccess} = useMutation(() => dataProvider.updatePredict("asr_segments", request_data), {
        onError: (error) => {
            notify(`Can't to update predict data with error: ${error.message}`, {type: 'error'})
        },
        onSuccess: () => {
            refresh();
        }
    })

    const handleCallPredict = () => {
        
        mutate()
    }
    
    return (
        <Tooltip title="Update predict" placement='top'>
            <IconButton onClick={handleCallPredict} sx={{width: "5%"}} disabled={isLoading}>
                <EditNotificationsIcon />
            </IconButton>
        </Tooltip>
    );
};

UpdatePredictButton.propTypes = {
    
};

export default UpdatePredictButton;