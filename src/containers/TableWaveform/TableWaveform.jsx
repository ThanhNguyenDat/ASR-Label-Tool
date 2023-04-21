import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { Form, Input, Table, Tag } from "antd";
import { propTypes } from 'react-bootstrap/esm/Image';

const cx = classNames.bind();

function TableWaveform ({columns, dataTable, ...rest}) {   
    const [form] = Form.useForm();
    const inputRef = React.useRef();

    

    const { 
        playWaveform,
        setSelectedRegionKey, 
        selectedRegionKey,
        setFocusCell,
        focusCell,
        updateDataTablePerCell,
    } = rest
    
    const new_columns = columns.map((col) => {
        if (col.editInput) {
            return {
                ...col,
                onCell: (record, rowIndex) => {
                    return {
                        onClick: event => {
                            console.log("click rowIndex: ", rowIndex)
                            console.log("click record: ", record)
                            setFocusCell({ row: record.key, col: col.key });
                        },
                        onMouseEnter: event => {
                            setFocusCell({ row: record.key, col: col.key });
                        },
                        onChange: event => {
                            const roundNumber = (str) => {return Math.round(parseFloat(str) * 1000) / 1000}

                            const formData1 = form.getFieldValue();
                            
                            // parse to Float
                            const formData = {
                                ...formData1,
                                start_time: roundNumber(formData1.start_time),
                                end_time: roundNumber(formData1.end_time)
                            }
                            console.log("Data update: ", record, rowIndex, col.key, formData[col.key]) // rowIndex = 0 
                            updateDataTablePerCell(record.key, col.key, formData[col.key]);
                        }
                    }
                },

                render: (text, record, index) => {
                    if (record.key === selectedRegionKey) {
                        const shouldFocus = focusCell.row === index && focusCell.col === col.key;
                        
                        return (
                            <Form.Item
                                name={col.key}
                                rules={[
                                    {
                                        required: true,
                                        message: `Enter your ${col.key}`
                                    }
                                ]}
                            >
                                <Input.TextArea 
                                    data-key={col.key} 
                                    rows={3}
                                    autoFocus={shouldFocus} 
                                    onFocus={(event)=>{
                                        event.target.selectionStart = event.target.value.length;
                                    }} 
                                />
                            </Form.Item>
                        )  
                        
                    } else {
                        if (col.tagColor)
                        {
                            return <Tag color={col.tagColor}>{text}</Tag>
                        }
                        return <p>{text}</p>
                    }
                }
            }
        }

        if (col.editSelectOption) {
            return {
                ...col,
                onCell: (record, rowIndex) => {
                    return {
                        onClick: event => {
                            console.log("Select onCell onClick: ", record, rowIndex)
                            setFocusCell({ row: record.key, col: col.key });
                        },
                        onChange: event => {
                            const formData = form.getFieldValue();
                            console.log("Select onCell onChange: ", record, rowIndex, formData)
                            updateDataTablePerCell(record.key, col.key, formData[col.key]);
                        }
                    }
                },
                render: (text, record, index) => {
                    const selectOptions = col.editSelectOption;
                    const color = selectOptions.find(option => option.value === text).color;

                    if (record.key === selectedRegionKey) {
                        
                        return (    
                            <Form.Item
                                name={col.key}
                                rules={[
                                    {
                                        required: true,
                                        message: `Enter your ${col.key}`
                                    }
                                ]}
                            >
                                <select 
                                    className={cx('form-select')}
                                    style={{color: color}}
                                    
                                >
                                    {selectOptions.map(option => {
                                        return (
                                            <option key={option.value} value={option.value} style={{color: option.color}}>{option.value}</option>
                                        )
                                    })}
                                </select>
                            </Form.Item>
                        )
                    } else {
                        return <Tag color={color}>{text}</Tag>
                    }
                    }
                }
        }
        
        if (col.buttonTypes) {
            return {
                ...col,
                onCell: record => {
                    return {
                        onClick: event => {
                            event.stopPropagation(); // this will avoid onRow being called
                        }
                    }
                },
                render: (text, record, index) => {
                    let checkEvery = (arr, target) => {
                        return (typeof target === 'string') ? 
                        arr.includes(target) : target.every(v=> arr.includes(v))
                    };
                    
                    const buttonTypes = col.buttonTypes.map(button => {
                        return button.type
                    })
                    
                    // only delete button
                    if (checkEvery(buttonTypes, 'delete')) {
                        return (
                            <button
                                className={cx("btn btn-danger")}
                                onClick={() => {
                                    // get handleFunction
                                    const handleFunction = col.buttonTypes.find(button => button.type === 'delete').handleFunction
                                    handleFunction(record);

                                }}
                            >Delete</button>
                        )
                    }
                }
            }
        }

        if (col.tagColor) {
            return {
                ...col,
                render: (text, record, index) => {
                    return <Tag color={col.tagColor}>{text}</Tag>
                }
            }
        }

        return col
    })
    
    return (
        <Form form={form} name="table-complex-form">            
            <Table
                columns={new_columns}
                dataSource={dataTable}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setSelectedRegionKey(record.key);
                            console.log('row', record, rowIndex)
                            form.setFieldsValue({
                                ...record
                            })

                            setFocusCell({ row: rowIndex, col: "description" });
                            
                            // play region
                            playWaveform?.regions.list[record.wave_id].play()
                        },
                        // onBlur: event => {
                        //     setSelectedRegionKey(null)
                        // },
                        // onMouseEnter: event => {
                        //     setSelectedRegionKey(record.key);
                        //     form.setFieldsValue({
                        //         ...record
                        //     })
                        //     setFocusCell({ row: rowIndex, col: "description" });
                        // },
                        // onMouseLeave: event => {
                        //     setSelectedRegionKey(null)
                        // }
                    }
                }}
                
            >
            </Table> 
        </Form>   
    );
};

TableWaveform.propTypes = {

};

export default TableWaveform;