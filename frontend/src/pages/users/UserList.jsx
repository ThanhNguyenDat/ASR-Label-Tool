import React from "react";
import { Datagrid, List, TextField } from "react-admin";

const UserList = () => {
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <TextField source="uname" />
            </Datagrid>
        </List>
    );
};

UserList.propTypes = {};

export default UserList;
