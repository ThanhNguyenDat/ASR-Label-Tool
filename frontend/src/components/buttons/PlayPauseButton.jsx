import React, { useEffect, useRef, useState } from 'react';
import {  
    useRecordContext, 
} from 'react-admin';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import { IconButton, Tooltip } from '@mui/material';
import { green } from '@mui/material/colors';


const PlayPauseButton = props => {
    const [isPlaying, setIsPlaying] = useState(false);

    const record = useRecordContext();
    const {label_url} = record;
    
    const audio = useRef(new Audio(label_url)).current;

    useEffect(() => {
        const handlePlay = () => {
            setIsPlaying(true);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, [audio]);

    const togglePlaying = () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    let transportPlayButton;
    if (!isPlaying) {
        transportPlayButton = (
            <Tooltip title="Play"  placement="top">
                <IconButton onClick={togglePlaying} style={{ color: green[500] }}>
                    <PlayArrowIcon/>
                </IconButton>
            </Tooltip>
        );
    } else {
        transportPlayButton = (
            <Tooltip title="Pause" placement="top">
                <IconButton onClick={togglePlaying}>
                    <PauseIcon style={{ color: green[500] }}/>
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <>
            {transportPlayButton}
        </>
    )
};

PlayPauseButton.propTypes = {
    
};

export default PlayPauseButton;