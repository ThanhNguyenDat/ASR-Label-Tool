import React from 'react';
import PropTypes from 'prop-types';
import {
    Button, useDataProvider
} from 'react-admin';
import UnfoldMoreDoubleIcon from '@mui/icons-material/UnfoldMoreDouble';
import { useMutation } from 'react-query';

const MoreDataButton = () => {
    const dataProvider = useDataProvider();
    const {mutate, isLoading} = useMutation(() => dataProvider.exportMoreData())
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