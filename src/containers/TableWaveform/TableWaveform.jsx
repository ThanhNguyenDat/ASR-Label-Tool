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
        loading,

        // new code
        handleDeleteRow,
        handleShowPredictRow
    } = rest
    

    const audibilityOptions = [
        {value: "good", color: "blue"}, 
        {value: "audible", color: "green"}, 
        {value: "bad", color: "red"}
    ]
    const noiseOptions = [
        {value:"heavy", color: "red"},
        {value:"medium", color: "orange"},
        {value:"light", color: "green"},
        {value:"clean", color: "blue"}
    ]
    const echoOptions = [
        {value:"heavy", color: "red"},
        {value:"medium", color: "orange"},
        {value:"light", color: "green"},
        {value:"clean", color: "blue"}
    ]

    const roundNumber = (str) => {return Math.round(parseFloat(str) * 1000) / 1000}

    const checkEvery = (arr, target) => {
        return (typeof target === 'string') ? 
        arr.includes(target) : target.every(v=> arr.includes(v))
    };


    const callApiPredict = () => {

    }

    const handleEditInput = (colDataIndex, selectedRegionKey) => ({
        
        onCell: (record, rowIndex) => {
            return {
                onClick: event => {
                    setFocusCell({ row: record.key, col: colDataIndex });
                },
                onMouseEnter: event => {
                    setFocusCell({ row: record.key, col: colDataIndex });
                },
                onChange: event => {
                    const formData1 = form.getFieldValue();
                    
                    // parse to Float
                    const formData = {
                        ...formData1,
                        start_time: roundNumber(formData1.start_time),
                        end_time: roundNumber(formData1.end_time)
                    }
                    console.log("Data update: ", record, rowIndex, colDataIndex, formData[colDataIndex]) // rowIndex = 0 
                    updateDataTablePerCell(record.key, colDataIndex, formData[colDataIndex]);
                }
            }
        },
        render: (text, record, index) => {
            if (record.key === selectedRegionKey) {
                const shouldFocus = focusCell.row === index && focusCell.col === {colDataIndex};

                return (
                    <div className={colDataIndex}>
                        <div className='typing'>
                            <Form.Item
                                name={colDataIndex}
                            >
                                <Input.TextArea 
                                    data-key={colDataIndex}
                                    rows={3}
                                    autoFocus={shouldFocus} 
                                    onFocus={(event)=>{
                                        event.target.selectionStart = event.target.value.length;
                                    }} 
                                />
                        </Form.Item>
                        </div>
                    </div>
                )
            } else {
                return (
                <div className={colDataIndex}>
                    <p>
                        {text}
                    </p>
                </div>
            )}
        }
    })
    
    const handleEditSelect = (colDataIndex, options, selectedRegionKey) => ({
        onCell: (record, rowIndex) => {
            return {
                onClick: event => {
                    setFocusCell({ row: record.key, col: colDataIndex });
                },
                onChange: event => {
                    const formData = form.getFieldValue();
                    updateDataTablePerCell(record.key, colDataIndex, formData[colDataIndex]);
                }
            }
        },
        render: (text, record, index) => {
            const color = options.find(option => option.value === text).color;

            if (record.key === selectedRegionKey) {
                return (
                    <Form.Item
                        name={colDataIndex}
                    >
                        <select 
                        className={`form-select ${colDataIndex}`}
                        style={{color: color}}
                        
                    >
                        {options.map(option => {
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
    })

    // old code
    // const new_columns = columns.map((col) => {
        
    //     if (col.editInput) {
    //         return {
    //             ...col,
    //             onCell: (record, rowIndex) => {
    //                 return {
    //                     onClick: event => {
    //                         console.log("click rowIndex: ", rowIndex)
    //                         console.log("click record: ", record)
    //                         setFocusCell({ row: record.key, col: col.key });
    //                     },
    //                     onMouseEnter: event => {
    //                         setFocusCell({ row: record.key, col: col.key });
    //                     },
    //                     onChange: event => {
    //                         const roundNumber = (str) => {return Math.round(parseFloat(str) * 1000) / 1000}

    //                         const formData1 = form.getFieldValue();
                            
    //                         // parse to Float
    //                         const formData = {
    //                             ...formData1,
    //                             start_time: roundNumber(formData1.start_time),
    //                             end_time: roundNumber(formData1.end_time)
    //                         }
    //                         console.log("Data update: ", record, rowIndex, col.key, formData[col.key]) // rowIndex = 0 
    //                         updateDataTablePerCell(record.key, col.key, formData[col.key]);
    //                     }
    //                 }
    //             },

    //             render: (text, record, index) => {
    //                 if (record.key === selectedRegionKey) {
    //                     const shouldFocus = focusCell.row === index && focusCell.col === col.key;
                        
    //                     return (
    //                         <Form.Item
    //                             name={col.key}
    //                             rules={[
    //                                 {
    //                                     required: true,
    //                                     message: `Enter your ${col.key}`
    //                                 }
    //                             ]}
    //                         >
    //                             <Input.TextArea 
    //                                 data-key={col.key} 
    //                                 rows={3}
    //                                 autoFocus={shouldFocus} 
    //                                 onFocus={(event)=>{
    //                                     event.target.selectionStart = event.target.value.length;
    //                                 }} 
    //                             />
    //                         </Form.Item>
    //                     )  
                        
    //                 } else {
    //                     if (col.tagColor)
    //                     {
    //                         return <Tag color={col.tagColor}>{text}</Tag>
    //                     }
    //                     return <p>{text}</p>
    //                 }
    //             }
    //         }
    //     }

    //     if (col.editSelectOption) {
    //         return {
    //             ...col,
    //             onCell: (record, rowIndex) => {
    //                 return {
    //                     onClick: event => {
    //                         console.log("Select onCell onClick: ", record, rowIndex)
    //                         setFocusCell({ row: record.key, col: col.key });
    //                     },
    //                     onChange: event => {
    //                         const formData = form.getFieldValue();
    //                         console.log("Select onCell onChange: ", record, rowIndex, formData)
    //                         updateDataTablePerCell(record.key, col.key, formData[col.key]);
    //                     }
    //                 }
    //             },
    //             render: (text, record, index) => {
    //                 const selectOptions = col.editSelectOption;
    //                 const color = selectOptions.find(option => option.value === text).color;

    //                 if (record.key === selectedRegionKey) {
                        
    //                     return (    
    //                         <Form.Item
    //                             name={col.key}
    //                             rules={[
    //                                 {
    //                                     required: true,
    //                                     message: `Enter your ${col.key}`
    //                                 }
    //                             ]}
    //                         >
    //                             <select 
    //                                 className={cx('form-select')}
    //                                 style={{color: color}}
                                    
    //                             >
    //                                 {selectOptions.map(option => {
    //                                     return (
    //                                         <option key={option.value} value={option.value} style={{color: option.color}}>{option.value}</option>
    //                                     )
    //                                 })}
    //                             </select>
    //                         </Form.Item>
    //                     )
    //                 } else {
    //                     return <Tag color={color}>{text}</Tag>
    //                 }
    //                 }
    //             }
    //     }
        
    //     if (col.buttonTypes) {
    //         return {
    //             ...col,
    //             onCell: record => {
    //                 return {
    //                     onClick: event => {
    //                         event.stopPropagation(); // this will avoid onRow being called
    //                     }
    //                 }
    //             },
    //             render: (text, record, index) => {
                    
                    
    //                 const buttonTypes = col.buttonTypes.map(button => {
    //                     return button.type
    //                 })
                    
    //                 // only delete button
    //                 if (checkEvery(buttonTypes, 'delete')) {
    //                     return (
    //                         <button
    //                             className={cx("btn btn-danger")}
    //                             onClick={() => {
    //                                 // get handleFunction
    //                                 const handleFunction = col.buttonTypes.find(button => button.type === 'delete').handleFunction
    //                                 handleFunction(record);

    //                             }}
    //                         >Delete</button>
    //                     )
    //                 }
    //             }
    //         }
    //     }

    //     if (col.tagColor) {
    //         return {
    //             ...col,
    //             render: (text, record, index) => {
    //                 return <Tag color={col.tagColor}>{text}</Tag>
    //             }
    //         }
    //     }

    //     return col
    // })

    return (
        <Form form={form} name="table-complex-form">            
            <div>
            <Table 
                rowKey="id" 
                pagination={{ pageSize: 5 }}

                // bắt sự kiện Row trong table
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

                dataSource={dataTable}
                style={{
                    width: "100%"
                }}
                
            >
                <Table.Column 
                    title="Start Time" 
                    dataIndex="start_time" 
                    key="start_time" 
                    width="5%"
                />
                <Table.Column 
                title="End Time" 
                dataIndex="end_time" 
                key="end_time" 
                width="5%" 
                />

                <Table.Column 
                    title="Description" 
                    key="description"
                    dataIndex="description"
                    width="40%" 
                    {...handleEditInput("description", selectedRegionKey)}
                    render={(text, record, index) => {
                        if (record.key === selectedRegionKey) {
                            const shouldFocus = focusCell.row === index && focusCell.col === "description";
            
                            return (
                                <div className='description'>
                                    <div className='predict'
                                    style={{
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                    >
                                        <div className='predict-1' style={{width: "100%"}}>
                                            Predict Kaldi: {record.predict_kaldi}
                                        </div>
                                        <div className='predict-2'>
                                            Predict Wenet: {record.predict_wenet}
                                        </div>
                                    </div>
                                    <div 
                                        style={{
                                            background: "black",
                                            color: "black",
                                            width: "100%",
                                            marginBottom: "5px",
                                            paddingBottom: "2px",
                                            borderRadius: "12px",
                                        }}
                                    />
                                    <div className='typing'>
                                        <Form.Item
                                        name={"description"}
                                        rules={[
                                            {
                                                required: true,
                                                message: `Enter your description`
                                            }
                                        ]}
                                        >
                                            <Input.TextArea 
                                                data-key="description"
                                                rows={3}
                                                autoFocus={shouldFocus} 
                                                onFocus={(event)=>{
                                                    event.target.selectionStart = event.target.value.length;
                                                }} 
                                            />
                                    </Form.Item>
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                            <div className='description'>
                                <div className='predict'
                                    style={{
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                    >
                                        <div className='predict-1' style={{width: "100%"}}>
                                        Predict Kaldi: {record.predict_kaldi}
                                        </div>
                                        <div className='predict-2'>
                                            Predict Wenet: {record.predict_wenet}
                                        </div>
                                    </div>
                                    <div 
                                        style={{
                                            background: "black",
                                            color: "black",
                                            width: "100%",
                                            marginBottom: "5px",
                                            paddingBottom: "2px",
                                            borderRadius: "12px",
                                        }}
                                    />
                                    <p>
                                    {text}
                                    </p>
                            </div>
                        )}
                    }}
                />

                <Table.Column 
                    title="Audibility" 
                    key="audibility"
                    dataIndex="audibility" 
                    width="5%"
                    onCell={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setFocusCell({ row: record.key, col: 'audibility' });
                            },
                            onChange: event => {
                                const formData = form.getFieldValue();
                                updateDataTablePerCell(record.key, "audibility", formData["audibility"]);
                            }
                        }
                    }}
                    render={(text, record, index) => {
                        
                        const color = audibilityOptions.find(option => option.value === text).color;

                        if (record.key === selectedRegionKey) {
                            return (
                                <Form.Item
                                    name="audibility"
                                >
                                    <select 
                                    className={cx('form-select')}
                                    style={{color: color}}
                                    
                                >
                                    {audibilityOptions.map(option => {
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
                    }}
                />

                <Table.Column 
                    title="Noise" 
                    key="noise"
                    dataIndex="noise" 
                    width="5%"
                    {...handleEditSelect("noise", noiseOptions, selectedRegionKey)}
                />

                <Table.Column 
                    title="Echo" 
                    key="echo"
                    dataIndex="echo" 
                    width="5%"
                    {...handleEditSelect("echo", echoOptions, selectedRegionKey)}
                />

                <Table.Column
                    title="Operations"
                    dataIndex="operations"
                    key="operations"
                    width="10%"
                    onCell={(record) => {
                        return {
                            onClick: event => {
                                event.stopPropagation();
                            }
                        }
                    }}
                    render={(text, record, index) => {
                        return (
                            <div style={{
                                display: 'flex',
                                columnGap: '5px'
                            }}>
                                <button 
                                    className='btn btn-danger'
                                    onClick={() => {
                                        handleDeleteRow(record);
                                    }}
                                >
                                    Delete
                                </button>
                                <button
                                    className='btn btn-primary'
                                    onClick={() => {
                                        handleShowPredictRow(record);
                                    }}
                                >
                                    Show Predict
                                </button>
                            </div>
                        )
                    }}
                />
                    
            </Table>

            </div>
  
        </Form>   
    );
};

TableWaveform.propTypes = {

};

export default TableWaveform;