import React from "react";
import PropTypes from "prop-types";
import DiffViewerASRText from "../../../../components/diff_viewer/DiffViewerASRText";
const modeDiffOpions = [
    {
        title: "Typing | Google",
        mode: ["full_text", "predict_google"],
    },
    {
        title: "Wenet | Kaldi",
        mode: ["predict_wenet", "predict_kaldi"],
    },
    {
        title: "Typing | Kaldi",
        mode: ["full_text", "predict_kaldi"],
    },
    {
        title: "Typing | Wenet",
        mode: ["full_text", "predict_wenet"],
    },
];
const ASRBenchmarkGoogleDatagridExpand = (props) => {
    return (
        <div>
            <DiffViewerASRText modeOptions={modeDiffOpions} />
        </div>
    );
};

ASRBenchmarkGoogleDatagridExpand.propTypes = {};

export default ASRBenchmarkGoogleDatagridExpand;
