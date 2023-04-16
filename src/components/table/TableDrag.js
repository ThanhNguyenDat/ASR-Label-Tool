import React from 'react';
import PropTypes from 'prop-types';

import { Outlet } from 'react-router-dom';

import { DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import Row from './Row';

function TableDrag (props) {

    const { 
        children, 
        dataSource, 
        setDataSource ,
        enableDrag,
    } = props
    console.log("enableDrag: ", enableDrag)
    



    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
          setDataSource((prev) => {
            const activeIndex = prev.findIndex((i) => i.key === active.id);
            const overIndex = prev.findIndex((i) => i.key === over?.id);
            return arrayMove(prev, activeIndex, overIndex);
          });
        }
    };

    return (
        <>
        {enableDrag ? (
            <DndContext onDragEnd={onDragEnd}>
                <SortableContext
                    // rowKey array
                    items={dataSource.map((i) => i.key)}
                    strategy={verticalListSortingStrategy}
                >
                    {React.Children.map(children, (child) => {
                        return React.cloneElement(child, { 
                            ...props,
                            components: {
                                body: {
                                    row: Row    
                                }
                            }
                        })
                    })}
                    {children}
                </SortableContext>
            </DndContext>
        ) : (
            <>
                {React.Children.map(children, child => (
                    React.cloneElement(child, {...props})
                ))}
            </>
        )}
        
        </>
    );
};

TableDrag.propTypes = {
    
};

export default TableDrag;