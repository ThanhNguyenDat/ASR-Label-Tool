import React from "react";
import PropTypes from "prop-types";
import { Edit, SimpleForm, TextField, TextInput } from "react-admin";
import Waveform from "../../../../components/label_ui/waveform";

const ASRLabellingEdit = () => {
    const url =
        "https://api.zalo.ai/ailab_video/label_supplier/audio_zalo/2023_03_27/P055b34e459ddb383eacc.wav";

    return (
        <Edit>
            <Waveform
                url={url}
                // playPauseButton={true}
                stopButton={true}
                clearSegmentsButton={true}
            />
        </Edit>
    );
};

ASRLabellingEdit.propTypes = {};

export default ASRLabellingEdit;
