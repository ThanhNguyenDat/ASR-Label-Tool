import React from 'react';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';
import { Table, Form, Tag, Modal, Input, Image, Space, Button, Badge } from "antd";
import { 
    DeleteOutlined, 
    EditOutlined, 
    ExclamationCircleOutlined, 
    SearchOutlined,
    MenuOutlined
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { table_color } from '../../constants/table';


const Row = ({ children, ...props }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props['data-row-key'],
    });
    const style = {
      ...props.style,
      transform: CSS.Transform.toString(
        transform && {
          ...transform,
          scaleY: 1,
        },
      )?.replace(/translate3d\(([^,]+),/, 'translate3d(0,'),
      transition,
      ...(isDragging
        ? {
            position: 'relative',
            zIndex: 9999,
          }
        : {}),
    };
    return (
      <tr {...props} ref={setNodeRef} style={style} {...attributes}>
        {React.Children.map(children, (child) => {
          if (child.key === 'sort') {
            return React.cloneElement(child, {
              children: (
                <MenuOutlined
                  ref={setActivatorNodeRef}
                  style={{
                    touchAction: 'none',
                    cursor: 'move',
                  }}
                  {...listeners}
                />
              ),
            });
          }
          return child;
        })}
      </tr>
    );
  };


const DataTable = ({columns, dataSource, setDataSource, ...rest}) => {
    const { confirm } = Modal;
    const navigate = useNavigate()

    const [focusCell, setFocusCell] = React.useState({row: null, col: null})
    const [isEditing, setIsEditing] = React.useState(false);
    const [dataCell, setDataCell] = React.useState(null);

    // search
    const [searchText, setSearchText] = React.useState('');
    const [searchedColumn, setSearchedColumn] = React.useState('');

    const searchInput = React.useRef(null);
    
    // table parmas
    const [tableParams, setTableParams] = React.useState({
        pagination: {
            showQuickJumper:true,
            current: 1,
            pageSize: 5,
            total: dataSource.length, // > 50
        },
    });

    // search
    const handleSearch = (selectedKeys, confirm, key) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(key);
      };
      const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
      };

    // button
    function onDeleteData(record) {
        confirm({
            title: "Are you sure? You want to delete this?",
            icon: <ExclamationCircleOutlined />,
            content: "When clicked the OK button, This data will be deleted",
            
            onOk() {
                setDataSource(pre => pre.filter(data => data.id !== record.id))
            },
            onCancel() {
                console.log("You clicked cancel button")
            },
            okType: "danger",
            okText: "Delete"
        })
    }

    function onEditData(record) {
        setIsEditing(true);
        setDataCell(record);
    }

    function resetDataCell() {
        setIsEditing(false);
        setDataCell(null);
    }


    // table params
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    }

    // Drab Table
    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
          setDataSource((previous) => {
            const activeIndex = previous.findIndex((i) => i.key === active.id);
            const overIndex = previous.findIndex((i) => i.key === over?.id);
            return arrayMove(previous, activeIndex, overIndex);
          });
        }
    };

    let newColumns = columns.map(oldCol =>  {
        let newCol = {
            ...oldCol,
            onCell: (record, rowIndex) => ({
                onMouseEnter: event => {
                    setFocusCell({row: rowIndex, col: oldCol.key})
                },
                onMouseLeave: event => {
                    setFocusCell({row: null, col: null})
                },
                onChange: event => {
                    
                },
                onClick: event => {
                    // navigate
                    if (newCol.navigate) {
                        navigate(record.to)
                    }
                }
            }),
        }

        if (newCol.key === "image") {
            newCol = {
                ...newCol,
                render: url => <Image 
                                    {...newCol.config}
                                    alt={url} 
                                    src={url} 
                                    width={newCol.width}
                                    fallback="data:image/png;base64,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"
                                />
            }
        }

        if (newCol.key === "tags") {
            // get config of column tags
            const config = newCol.config
            newCol = {
                ...newCol,
                render: (_, { tags }) => (
                    <>
                        {
                            tags.map(tag => {
                                
                                let color = table_color[tag] || table_color["default"]
                                return (
                                    <Tag 
                                        {...config}
                                        color={color} 
                                        key={tag}
                                    >
                                        {tag}
                                    </Tag>)
                            })
                        }
                    </>
                )
            }
            
        }  

        if (newCol.key === "actions") {
            newCol = {
                ...newCol,
                fixed: 'right',
                onCell: record => ({
                    ...newCol.onCell,
                    onClick: event => {
                        event.stopPropagation();
                    }
                }),
                render: (_, record) => (
                    <>
                        <EditOutlined 
                            onClick={() => {onEditData(record)}}
                        />
                        <DeleteOutlined 
                            onClick={() => {onDeleteData(record)}} 
                            style={{ color: "red", margin: 12}}
                        />
                    </>
                )
            }
        }

        if (newCol.key === "status") {
            newCol = {
                ...newCol,
                render: (_, record) => <Badge status={record.status} text={record.status}/>
            }
        }

        if (newCol.enableSearch) {
            newCol = {
                ...newCol,
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
                    <div
                      style={{
                        padding: 8,
                      }}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <Input
                        ref={searchInput}
                        placeholder={`Search ${newCol.title}`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, newCol.key)}
                        style={{
                          marginBottom: 8,
                          display: 'block',
                        }}
                      />
                      <Space>
                        <Button
                          type="primary"
                          onClick={() => handleSearch(selectedKeys, confirm, newCol.key)}
                          icon={<SearchOutlined />}
                          size="small"
                          style={{
                            width: 90,
                          }}
                        >
                          Search
                        </Button>
                        <Button
                          onClick={() => clearFilters && handleReset(clearFilters)}
                          size="small"
                          style={{
                            width: 90,
                          }}
                        >
                          Reset
                        </Button>
                        <Button
                          type="link"
                          size="small"
                          onClick={() => {
                            close();
                          }}
                        >
                          close
                        </Button>
                      </Space>
                    </div>
                  ),

                  filterIcon: (filtered) => (
                    <SearchOutlined
                      style={{
                        color: filtered ? '#1890ff' : undefined,
                      }}
                    />
                  ),
                  onFilter: (value, record) =>
                    record[newCol.key].toString().toLowerCase().includes(value.toLowerCase()),
                  onFilterDropdownOpenChange: (visible) => {
                    if (visible) {
                    //   setTimeout(() => searchInput.current?.select(), 100);
                        searchInput.current?.select()
                    }
                  },
                  render: (text) =>
                    searchedColumn === newCol.key ? (
                      <Highlighter
                        highlightStyle={{
                          backgroundColor: '#ffc069',
                          padding: 0,
                        }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                      />
                    ) : (
                      text
                    ),
            }
        }

        if (newCol.enableSort) {
            newCol = {
                ...newCol,
                sorter: (a, b) => a[newCol.key].length - b[newCol.key].length,
                sortDirections: ['descend', 'ascend'],
            }
        }

        return newCol
    })

    return (
        <>
        <DndContext onDragEnd={onDragEnd}>
            <SortableContext
                // rowKey array
                items={dataSource.map((i) => i.key)}
                strategy={verticalListSortingStrategy}
            >
                <Table 
                    {...rest}
                    columns={newColumns}
                    dataSource={dataSource}
                    
                    components={{
                        body: {
                            row: Row
                        }
                    }}

                    pagination={tableParams.pagination}
                    onChange={handleTableChange}
                    onRow={(record, rowIndex) => ({
                        onMouseEnter: event => {
                            
                        },
                        onMouseLeave: event => {
                            
                        }
                    })}
                />
            </SortableContext>
        </DndContext>
        
            <Modal 
                title="Edit Data"
                open={isEditing}
                okText="Save"
                onCancel={()=>{resetDataCell()}}
                onOk={()=>{
                    setDataSource(pre=>(
                        pre.map((row, rowIndex) => {
                            if (dataCell.id === row.id) {
                                return dataCell
                            }
                            return row
                        })
                    ))
                    resetDataCell()}
                }
            >
                {newColumns.map(col => {
                    if (col.editTextArea) {
                        return (         
                            <>           
                                <Input.TextArea
                                    {...col.editTextArea}
                                    key={col.key}
                                    value={dataCell && dataCell[col.key]}
                                    onChange={event => {setDataCell(pre=> ({...pre, [col.key]: event.target.value}))}}
                                />
                            </>
                        )
                    }
                    if (col.editText) {
                        return (
                            <Input   
                                {...col.editText}
                                key={col.key}
                                value={dataCell && dataCell[col.key]}
                                onChange={event => {setDataCell(pre=> ({...pre, [col.key]: event.target.value}))}}
                            />)
                    }
                })}
            </Modal>
        </>
    );
};

DataTable.propTypes = {
    
};

export default DataTable;