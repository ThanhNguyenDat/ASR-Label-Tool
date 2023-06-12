import React from 'react';
import PropTypes from 'prop-types';
import {
    Button
} from 'react-admin';
import UnfoldMoreDoubleIcon from '@mui/icons-material/UnfoldMoreDouble';

const MoreDataButton = () => {
    const handleClick = () => {
        console.log("123");
    }
    return (
        <Button 
            label='More Data' 
            onClick={()=>handleClick()} 
            startIcon={<UnfoldMoreDoubleIcon />} 
        />
            
    );
};

MoreDataButton.propTypes = {
    
};

export default MoreDataButton;