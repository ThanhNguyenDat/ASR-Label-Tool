import React from 'react';
import PropTypes from 'prop-types';
import { Datagrid, List, TextField } from 'react-admin';

const UserList = () => {
    return (
        <List>
            <Datagrid>
                <TextField source='id' />
                <TextField source='uname' />
            </Datagrid>
        </List>
    );
};

UserList.propTypes = {
    
};

export default UserList;