import React from 'react';
import PropTypes from 'prop-types';
import { Datagrid, List, TextField } from 'react-admin';

const ASRLabelList = props => {
    return (
        <List>
            <Datagrid>
                <TextField source="id"/>
                <TextField source="lb1"/>
                <TextField source="exported" />
            </Datagrid>
        </List>
    );
};

ASRLabelList.propTypes = {
    
};

export default ASRLabelList;