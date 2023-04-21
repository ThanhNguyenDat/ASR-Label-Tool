import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import styled, { css } from "styled-components";

import useContextMenu from '@hooks/useContextMenu';
import { Button, Checkbox, Input } from 'antd';

const ContextMenu = styled.div`
  position: absolute;
  font-size: 13px;
  width: 100px;
  background-color: #f5f5f5;
  border-radius: 5px;

  z-index: 999;
  ${({ top, left }) => css`
    top: ${top}px;
    left: ${left}px;
  `}

  ul {
    box-sizing: border-box;
    margin: 0;
    list-style: none;
    box-shadow: 0 0 0 2px black;
    border-radius: 10px;
    padding: 0;
  }
  ul li {
    padding: 9px 0px;
    border-radius: 10px;
  }
  /* hover */
  ul li:hover {
    cursor: pointer;
    background-color: white;
  }
`;

function ItemFlexbox(props) {
    let { 
        sx, 
        id, 
        resultLabel, 
        setResultLabel, 
        // onClick: originalOnClick,
        clicked,
        points,
        color,
        setColor,
        ...other 
    } = props;

    
    // console.log("props: ", props)
    return (
        <>
            <Button 
                style={{
                    ":hover": {
                        cursor: 'pointer',
                        opacity: 0.5
                    },
                    ":active": {
                        // color: 'blue'
                    },

                    background: color,
                }}
                {...other}
                
                onClick={() => {
                    props.onClick();

                    setColor(pre => {
                        if (pre) return pre
                    })
                    console.log("click id: ", id)
                    // setClicked(false)
                    

                }}

                // onContextMenu={(e) => {
                //     e.preventDefault();
                //     props.onContextMenu();
                    
                //     setClicked(false);
                    
                //     console.log("right click", id)
                    
                //     console.log(e)
                //     setPoints({
                //         x: e.pageX,
                //         y: e.pageY,
                //     });
                //     setClicked(true);
                // }}
            />
            {clicked && (
                <ContextMenu top={points.y} left={points.x}>
                
                <ul> 
                    <li
                        onClick={() => {
                            setColor('#f5f5f5')
                            setResultLabel(pre => (pre.map(p => ({
                                    ...p,
                                    "class_id": 0, // commonInfo
                                    "class_name": "Other"
                            }))))
                        }} 
                        style={{backgroundColor: '#f5f5f5'}}
                    >Other</li>
                    <li 
                        onClick={() => {
                            setColor('cyan')
                            setResultLabel(pre => (pre.map(p => ({
                                ...p,
                                "class_id": 1, // commonInfo
                                "class_name": "Good"
                        }))))
                        }} 
                        style={{backgroundColor: 'cyan'}}
                    >Good</li>
                    <li 
                        onClick={() => {

                            setColor('red')
                            
                            setResultLabel(pre => (pre.map(p => ({
                                ...p,
                                "class_id": 2, // commonInfo
                                "class_name": "Bad"
                        }))))
                        }} 
                        style={{backgroundColor: 'red'}}
                    >Bad</li>
                    <li
                        onClick={() => {
                            setColor('#00ff33')
                            setResultLabel(pre => (pre.map(p => ({
                                ...p,
                                "class_id": 3, // commonInfo
                                "class_name": "Redo"
                        }))))
                        }} 
                        style={{backgroundColor: '#00ff33'}}
                    >Redo</li>
                   
                </ul>
                </ContextMenu>
            )}
      </>
    );
}

ItemFlexbox.propTypes = {
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
      ),
      PropTypes.func,
      PropTypes.object,
    ]),
};
  
export default ItemFlexbox;