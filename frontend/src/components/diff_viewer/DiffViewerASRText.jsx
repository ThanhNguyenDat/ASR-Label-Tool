import React, { useMemo, useState } from 'react';
import { useRecordContext } from 'ra-core';
import ReactDiffViewer, { DiffMethod } from '@custom/react-diff-viewer';

import CustomDiffViewer from './DiffViewer.tsx';

import { 
    Box, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
} from '@mui/material';
import UpdatePredictButton from '../buttons/UpdatePredictButton';
import './styles.scss';

const WrapperDiffViewer = ({
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
        // compareMethod = DiffMethod.WORDS;
        compareMethod = DiffMethod.WORDS;
    } else if (method === "lines") {
        compareMethod = DiffMethod.LINES;
    } else if (method === 'chars') {
        compareMethod = DiffMethod.CHARS;
        
    }

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
                style={{ 
                    display: "inline",
                    wordSpacing: '0.1rem',
                    letterSpacing: '0.01071em',
                    fontFamily: '"Roboto","Helvetica","Arial",sans-serif'
                }}
                className="foo"
                dangerouslySetInnerHTML={{
                __html: `${str}`
                }}
            />
        </div>
    )}
    

    const renderGutter = (row) => {
        let text;
        if (row.prefix === 'L') {
            text = oldTitle;
        } else if (row.prefix === 'R') {
            text = newTitle;
        }

        return (
            <td 
                className='control-diff-viewer'
            >
                {text}
            </td>
        )
    }

    return (
        <>
            <CustomDiffViewer
                oldValue={oldValue}
                newValue={newValue}

                leftTitle={splitView ? oldTitle : undefined}
                rightTitle={splitView ? newTitle : undefined}
    
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


const getModeDescription = (allMode, mode) => {
    return allMode.find(m => m.mode === mode)
}

const getTitleModeDescription = (allMode, mode) => {
    let oldTitle, newTitle;

    const titleSplit = getModeDescription(allMode, mode)?.title?.split(" ")
    if (titleSplit?.length > 0) {
        oldTitle = titleSplit[0]
        newTitle = titleSplit[titleSplit.length - 1]
    }

    return {
        oldTitle, newTitle
    }
}


const getValueModeDescription = (allMode, mode, record) => {
    let oldValue, newValue;
    
    const modes = getModeDescription(allMode, mode)?.mode
    
    const oldValueMode = modes[0] // typing
    const newValueMode = modes[1] // kaldi

    oldValue = record[oldValueMode]
    newValue = record[newValueMode]
    console.log(oldValue);

    if (!oldValue) {
        oldValue = "none"
    }

    if (!newValue) {
        newValue = "none"
    }
    
    return {
        oldValue,
        newValue,
    }
}

// samples
// const modeDiffOpions = [
//     {
//         title: "Wenet | Kaldi", 
//         mode: ['predict_wenet', 'predict_kaldi']
//     },
//     {
//         title: "Typing | Wenet", 
//         mode: ['full_text', 'predict_wenet']
//     }, 
//     {
//         title: "Typing | google", 
//         mode: ['full_text', 'predict_google']
//     }, 
// ]

const DiffViewerASRText = ({ modeOptions }) => {
    const record = useRecordContext();
    
    const [modeDiff, setModeDiff] = useState(modeOptions[0].mode);
    const { oldTitle, newTitle } = getTitleModeDescription(modeOptions, modeDiff);
    const { oldValue, newValue } = getValueModeDescription(modeOptions, modeDiff, record);

    const handleChangeDiffMode = (event) => {
        setModeDiff(event.target.value);
    };

    return (
        <>
            <Box display="flex" width="100%">
                <FormControl fullWidth sx={{ flex: '0 0 18%', paddingRight: '10px' }}>
                    <InputLabel id="mode-simple-select-label">Mode</InputLabel>
                    <Select
                        labelId="mode-simple-select-label"
                        id="mode-simple-select"
                        value={modeDiff}
                        label="Mode"
                        onChange={handleChangeDiffMode}
                    >
                        {modeOptions.map(mode => (
                            <MenuItem key={mode.mode} value={mode.mode}>{mode.title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ flex: '1 1 auto' }}>
                    <WrapperDiffViewer
                        oldTitle={oldTitle}
                        newTitle={newTitle}

                        oldValue={oldValue}
                        newValue={newValue}
                        splitView={false}
                    />
                </Box>
                <UpdatePredictButton sx={{ flex: '0 0 auto' }} />  
            </Box>
        </>
    );
    
};

DiffViewerASRText.propTypes = {
    
};

export default DiffViewerASRText;