import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { Form, Input, Radio, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined, CopyOutlined } from '@ant-design/icons';
import {FiEdit3} from "react-icons/fi";

import './styles.scss';
import CopyToClipboard from 'react-copy-to-clipboard';
import DiffViewer, { DiffMethod } from 'react-diff-viewer-continued';


const modeDescriptionOptions = [
    {value: "wenet kaldi", title: "Wenet | Kaldi", },
    {value: "typing wenet", title: "Typing | Wenet"}, 
    {value: "typing kaldi", title: "Typing | Kaldi"},
]

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
const regionOptions = [
    {value: "other", color: "black"},
    {value: "bắc", color: "red"},
    {value: "trung", color: "orange"},
    {value: "nam", color: "blue"}
]


const roundNumber = (str) => {return Math.round(parseFloat(str) * 1000) / 1000}

const checkEvery = (arr, target) => {
    return (typeof target === 'string') ? 
    arr.includes(target) : target.every(v=> arr.includes(v))
};

const getModeDescription = (allMode, value) => {
    return allMode.find(mode => mode.value === value)
}

const getTitleModeDescription = (allMode, mode) => {
    let oldTitle, newTitle;

    const titleSplit = getModeDescription(allMode, mode)?.title?.split(" ")
    if (titleSplit.length > 0) {
        oldTitle = titleSplit[0]
        newTitle = titleSplit[titleSplit.length - 1]
    }

    return {
        oldTitle, newTitle
    }
}

const getValueModeDescription = (allMode, mode, record) => {
    let oldValue, newValue;

    const value = getModeDescription(allMode, mode)?.value
    const valueSplit = value.split(" ")

    const oldValueMode = valueSplit[0] // typing
    const newValueMode = valueSplit[1] // kaldi

    if (oldValueMode.includes("wenet")) {
        oldValue = record?.predict_wenet
    } else if (oldValueMode.includes("kaldi")) {
        oldValue = record?.predict_kaldi
    } else if (oldValueMode.includes("typing")) {
        oldValue = record?.description 
    }
    
    if (newValueMode.includes("wenet")) {
        newValue = record?.predict_wenet
    } else if (newValueMode.includes("kaldi")) {
        newValue = record?.predict_kaldi
    } else if (newValueMode.includes("typing")) {
        newValue = record?.description 
    }

    if (!oldValue) {
        oldValue = "None"
    }

    if (!newValue) {
        newValue = "None"
    }
    
    return {
        oldValue,
        newValue,
    }

    


}

const PredictDiffViewer = ({
    oldValue, 
    newValue, 
    oldTitle,
    newTitle,
    method="words", 
    splitView=true, 
    modeShow,
    isHover,

    handleAcceptTextBtn,

    ...props
}) => {
    let compareMethod = DiffMethod.WORDS;
    
    if (method === "words") {
        compareMethod = DiffMethod.WORDS;
    } else if (method === "lines") {
        compareMethod = DiffMethod.LINES;
        // splitView = false;
    }
    // compareMethod = DiffMethod.SENTENCES;
    
    const renderContent = (str) => {
        return (
        <div 
            className='diffent-element' 
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'center',
                width: "100%",
            }}
        >
            <pre
                style={{ display: "inline" }}
                className="foo"
                dangerouslySetInnerHTML={{
                // __html: Prism.highlight(str, Prism.languages.javascript)
                // __html: Prism.highlight(str, Prism.languages.json, "json")
                __html: `${str}`
                }}
            />
        </div>
    )}
    

    const renderGutter = (row) => {
        let text;
        if (row.prefix === 'L') {
            text = oldValue;
        } else if (row.prefix === 'R') {
            text = newValue;
        }

        return (
            <td 
                className='control-diff-viewer'
            >
                <FiEdit3 className='icon'
                    onClick={() => {
                        handleAcceptTextBtn(text);
                    }}
                />
                <CopyToClipboard text={text}>
                    <CopyOutlined className='icon'/>
                </CopyToClipboard>
            </td>
        )
    }

    return (
        <>
            <DiffViewer 
                oldValue={oldValue}
                newValue={newValue}

                leftTitle={oldTitle}
                rightTitle={newTitle}
    
                hideLineNumbers={true}
                showDiffOnly={false}
                splitView={splitView}
                compareMethod={compareMethod}
                styles={{
                    variables: {
                        light: {
                            codeFoldGutterBackground: "#6F767E",
                            codeFoldBackground: "#E2E4E5"
                            }
                    },
                    contentText: {
                        display: 'flex',
                        width: "100%",
                    },
                    diffContainer: {
                        width: "100%"
                    },
                }}
                {...props}
                renderContent={renderContent}
                renderGutter={renderGutter}
            />
        </>
    ) 
}



function TableWaveform ({columns, dataTable, ...rest}) {   
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

    const [form] = Form.useForm();
    const inputRef = React.useRef();
    const [selectedModeDescription, setSelectedModeDescription] = useState("wenet kaldi");

    // const oldTitleModeDescription = useMemo(() => {
    //     return getModeDescription(modeDescriptionOptions, selectedModeDescription).title.split(" ")[0]
    // }, [selectedModeDescription])

    // const newTitleModeDescription = useMemo(() => {
    //     const titleSplit = getModeDescription(modeDescriptionOptions, selectedModeDescription).title.split(" ")
        
    //     return titleSplit[titleSplit.length - 1]
    // }, [selectedModeDescription])

    



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
                    updateDataTablePerCell(record.key, colDataIndex, formData[colDataIndex]);
                }
            }
        },
        render: (text, record, index) => {
            if (record.key === selectedRegionKey) {
                const shouldFocus = focusCell.row === index && focusCell.col === {colDataIndex};

                return (
                    <div className={colDataIndex} key={`${colDataIndex} ${record.key}`}>
                        <div className='typing'>
                            <Form.Item
                                name={colDataIndex}
                                key={colDataIndex}
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
                <div className={colDataIndex} key={`${colDataIndex} ${record.key}`}>
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
            const color = options.find(option => option.value === text)?.color;

            if (record.key === selectedRegionKey) {
                return (
                    <Form.Item
                        name={colDataIndex}
                        key={colDataIndex}
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


    const handleEditRadio = (colDataIndex, options, selectedRegionKey) => ({
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
            const color = options.find(option => option.value === text)?.color;

            if (record.key === selectedRegionKey) {
                return (
                    <div key={`${colDataIndex} ${record.key}`}>
                        
                    <Form.Item
                        name={colDataIndex}
                    >
                        <Radio.Group>
                            <Space direction='vertical'>
                                {options.map(option => {
                                    return <Radio key={option.value} value={option.value} style={{color: option.color}}>{option.value}</Radio>
                                })}
                            </Space>
                        </Radio.Group>
                    </Form.Item>

                    </div>
                )
            } else {
                return <Tag color={color} key={`${colDataIndex} ${record.key}`}>{text}</Tag>
            }

        }
    })

    const handleAcceptTextBtn = (text) => {
        console.log(focusCell, text);
        const currentRowDataTableIndex = dataTable.findIndex(data => data.id === focusCell.row);

        dataTable[currentRowDataTableIndex].description = text;
        updateDataTablePerCell(focusCell.row, focusCell.col, text);
    }

    return (
        <Form form={form} name="table-complex-form"
        className='form-control-table'
        key="form-control-table"
        >            
            <div>
            <Table 
                key="table-label"
                className='table-label-asr'
                
                rowKey={(record) => {
                    
                    return record.key
                }}

                pagination={{ pageSize: 5 }}

                // bắt sự kiện Row trong table
                onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setSelectedRegionKey(record.key);
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
                    key="start_time" 
                    title="Start Time" 
                    dataIndex="start_time" 
                    width="1%"
                />
                <Table.Column 
                    key="end_time" 
                    title="End Time" 
                    dataIndex="end_time" 
                    width="1%" 
                />
                <Table.Column 
                    title={() => (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            Description 
                            <select 
                                className='form-select mode-description'
                                style={{
                                    marginLeft: "10px",
                                    width: "20%"

                                }}
                                value={selectedModeDescription} 
                                onChange={(e)=>setSelectedModeDescription(e.target.value)}
                            >
                                {modeDescriptionOptions.map(mode => (
                                    <option value={mode.value} key={mode.value}>{mode.title}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    key="description"
                    dataIndex="description"
                    // width="40%" 
                    {...handleEditInput("description", selectedRegionKey)}
                    render={(text, record, index) => {
                        const { oldValue, newValue } = getValueModeDescription(modeDescriptionOptions, selectedModeDescription, record);
                            
                        const { oldTitle, newTitle } = getTitleModeDescription(modeDescriptionOptions, selectedModeDescription);


                        if (record.key === selectedRegionKey) {
                            const shouldFocus = focusCell.row === index && focusCell.col === "description";
                            
                            // get values of predict
                            return (
                                <div className='description' key={`description-${record.key}`}>
                                    <div className='predict'
                                    style={{
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                    >
                                        <PredictDiffViewer 
                                            oldValue={oldValue}
                                            newValue={newValue}
                                            oldTitle={oldTitle}
                                            newTitle={newTitle}

                                            handleAcceptTextBtn={handleAcceptTextBtn}

                                        />
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
                            <div className='description' key={`description-${record.key}`}>
                                
                                <div className='predict'
                                    style={{
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                    >
                                        <PredictDiffViewer 
                                            oldValue={oldValue}
                                            newValue={newValue}
                                            
                                            oldTitle={oldTitle}
                                            newTitle={newTitle}

                                            handleAcceptTextBtn={handleAcceptTextBtn}
                                        />
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
                    {...handleEditRadio("audibility", audibilityOptions, selectedRegionKey)}
                />

                <Table.Column 
                    title="Noise" 
                    key="noise"
                    dataIndex="noise" 
                    width="5%"
                    // {...handleEditSelect("noise", noiseOptions, selectedRegionKey)}
                    {...handleEditRadio("noise", noiseOptions, selectedRegionKey)}
                />

                <Table.Column 
                    title="Region" 
                    key="region"
                    dataIndex="region" 
                    width="5%"
                    // {...handleEditSelect("region", regionOptions, selectedRegionKey)}
                    {...handleEditRadio("region", regionOptions, selectedRegionKey)}
                />

                <Table.Column
                    className='operations-column'
                    title="Operations"
                    dataIndex="operations"
                    key="operations"
                    width="1%"
                    onCell={(record) => {
                        return {
                            onClick: event => {
                                event.stopPropagation();
                            }
                        }
                    }}
                    render={(text, record, index) => {
                        return (
                            <div 
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    rowGap: "2px",
                                }}
                            >
                                <EditOutlined 
                                    className='btn btn-primary'
                                    onClick={() => {
                                        handleShowPredictRow(record);
                                    }}    
                                />
                                <DeleteOutlined 
                                    className='btn btn-danger' 
                                    onClick={()=> {
                                        handleDeleteRow(record);
                                    }}
                                />
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