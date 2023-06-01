import React from 'react';
import PropTypes from 'prop-types';
import { List, Datagrid, TextField, EmailField, TextInput, ReferenceInput } from "react-admin";
import UserFilterSidebar from './UserFilterSidebar';
const userFilters = [
    // input search
    <TextInput source="q" label="Search" alwaysOn />,

    // filter bar filter buttons
    <ReferenceInput source="id" label="Id" reference="users" />,
];

const UserList = () => {
    return (
        <List filters={userFilters} >
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="name" />
                <TextField source="username" />
                <EmailField source="email" />
                <TextField source="address.street" />
                <TextField source="phone" />
                <TextField source="website" />
                <TextField source="company.name" />
            </Datagrid>
        </List>
    );
};

UserList.propTypes = {
    
};

export default UserList;