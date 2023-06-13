import React, {useState, useEffect, forwardRef} from "react";
import useWavesurfer from '../../../hooks/useWavesurfer';

import IconButton from '@mui/material/IconButton';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import LayersClearIcon from '@mui/icons-material/LayersClear';

import { green, red, blue, orange } from '@mui/material/colors';
import TableWaveformEdit from "./TableWaveformEdit";

const ReactWaveform = ({
    url, 
    annotations,  
    stopButton,
    clearSegmentsButton,
    controlTable,
    ...rest
}) => {
    const {wavesurferRef, isLoading, isPlaying, togglePlaying, stopPlayback, clearSegments } = useWavesurfer(url, annotations);

    let transportPlayButton;
    if (!isPlaying) {
        transportPlayButton = (
        <IconButton onClick={togglePlaying} style={{ color: green[500] }}>
            <PlayArrowIcon/>
        </IconButton>
        );
    } else {
        transportPlayButton = (
        <IconButton onClick={togglePlaying}>
            <PauseIcon style={{ color: green[500] }}/>
        </IconButton>
        );
    }

    return (
        <div {...rest}>
            <div ref={wavesurferRef} />
            {transportPlayButton}
            {stopButton && (<>
                <IconButton onClick={stopPlayback}>
                    <StopIcon />
                </IconButton>
            </>)}

            {clearSegmentsButton && (<>
                <IconButton onClick={clearSegments}>
                    <LayersClearIcon style={{ color: red[500] }}/>
                </IconButton>
            </>)}
            
            {controlTable && (<div>
                <TableWaveformEdit />
            </div>)}
        </div>
    )
}


ReactWaveform.propTypes = {
    
};

export default ReactWaveform;