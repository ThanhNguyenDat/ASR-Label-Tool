import React, { useState } from "react";

import { Form, Table } from "antd";

import { useRecordContext } from "ra-core";

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const TableWaveformEdit = (props) => {
    const record = useRecordContext();
    const [editingKey, setEditingKey] = useState("");

    const isEditing = (record) => record.key === editingKey;

    return (
        <Table
            components={{
                body: {
                    row: EditableRow,
                },
            }}
        ></Table>
    );
};

TableWaveformEdit.propTypes = {};

export default TableWaveformEdit;
