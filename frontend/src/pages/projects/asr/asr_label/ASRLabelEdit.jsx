import React from "react";
import { useRecordContext } from "react-admin";
import { Edit } from "react-admin";
import ReactWaveform from "../../../../components/label_ui/waveform";

const Waveform = () => {
    const record = useRecordContext();
    const { label_url } = record;

    return (
        <ReactWaveform
            url={label_url}
            stopButton={true}
            clearSegmentsButton={true}
            controlTable={true}
        />
    );
};

const AsrLabelEdit = () => {
    return (
        <Edit>
            <Waveform />
        </Edit>
    );
};

AsrLabelEdit.propTypes = {};

export default AsrLabelEdit;
