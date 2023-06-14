import React from 'react';
import PropTypes from 'prop-types';
import {
    Button, useDataProvider, useNotify, useRefresh
} from 'react-admin';
import UnfoldMoreDoubleIcon from '@mui/icons-material/UnfoldMoreDouble';
import { useMutation } from 'react-query';

const MoreDataButton = () => {
    const dataProvider = useDataProvider();
    const refresh = useRefresh();
    const notify = useNotify();

    const {mutate, isLoading, error, isSuccess } = useMutation(() => dataProvider.exportMoreData(), {
        onError: (error) => {
        notify(`Get more data error: ${error.message}`, {type: 'error'})
    }, onSuccess: () => {
        refresh();
    }})
    const handleClick = () => {
        mutate()
    }
    return (
        <Button 
            label='More Data' 
            onClick={()=>handleClick()} 
            startIcon={<UnfoldMoreDoubleIcon />} 
            disabled={isLoading}
        />
            
    );
};

MoreDataButton.propTypes = {
    
};

export default MoreDataButton;