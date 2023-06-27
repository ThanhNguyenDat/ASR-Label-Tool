import React, { useState } from "react";
import PropTypes from "prop-types";

import { Form, Input, Radio, Space, Table, Tag } from "antd";

import { DeleteOutlined, EditOutlined, CopyOutlined } from "@ant-design/icons";
import { useRecordContext } from "ra-core";

// import ReactDiffViewer from '../../diff_viewer';

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
