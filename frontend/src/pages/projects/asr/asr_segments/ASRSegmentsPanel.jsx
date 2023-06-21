import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRecordContext } from 'ra-core';
import ReactDiffViewer, { DiffMethod } from '@custom/react-diff-viewer';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';

import UpdatePredictButton from '../../../../components/buttons/UpdatePredictButton';

const DiffViewer = ({
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
                __html: `${str}`
                }}
            />
        </div>
    )}
    

    // const renderGutter = (row) => {
    //     let text;
    //     if (row.prefix === 'L') {
    //         text = oldValue;
    //     } else if (row.prefix === 'R') {
    //         text = newValue;
    //     }

    //     return (
    //         <td 
    //             className='control-diff-viewer'
    //         >
    //             <FiEdit3 className='icon'
    //                 onClick={() => {
    //                     handleAcceptTextBtn(text);
    //                 }}
    //             />
    //         </td>
    //     )
    // }

    return (
        <>
            <ReactDiffViewer 
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
                // renderGutter={renderGutter}
            />
        </>
    ) 
}


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
        oldValue = record?.text 
    }
    
    if (newValueMode.includes("wenet")) {
        newValue = record?.predict_wenet
    } else if (newValueMode.includes("kaldi")) {
        newValue = record?.predict_kaldi
    } else if (newValueMode.includes("typing")) {
        newValue = record?.text 
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

const modeDiffOpions = [
    {value: "wenet kaldi", title: "Wenet | Kaldi", },
    {value: "typing wenet", title: "Typing | Wenet"}, 
    {value: "typing kaldi", title: "Typing | Kaldi"},
]

const ASRSegmentsPanel = props => {
    const record = useRecordContext();

    const [modeDiff, setModeDiff] = useState("typing kaldi");
    const { oldTitle, newTitle } = getTitleModeDescription(modeDiffOpions, modeDiff);
    const { oldValue, newValue } = getValueModeDescription(modeDiffOpions, modeDiff, record);

    const handleChangeDiffMode = (event) => {
        setModeDiff(event.target.value);
    };

    return (
        <>
            <Box display="flex">
                <FormControl sx={{width: "20%", paddingRight: "10px"}}>
                    <InputLabel id="mode-simple-select-label">Mode</InputLabel>
                    <Select
                        labelId="mode-simple-select-label"
                        id="mode-simple-select"
                        value={modeDiff}
                        label="Mode"
                        onChange={handleChangeDiffMode}
                    >
                        {modeDiffOpions.map(mode => (
                            <MenuItem key={mode.value} value={mode.value}>{mode.title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <DiffViewer
                    oldTitle={oldTitle}
                    newTitle={newTitle}

                    oldValue={oldValue}
                    newValue={newValue}
                />
                <UpdatePredictButton />  
            </Box>
        </>
    );
    
};

ASRSegmentsPanel.propTypes = {
    
};

export default ASRSegmentsPanel;