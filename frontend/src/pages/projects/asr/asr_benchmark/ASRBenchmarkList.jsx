import React from "react";

import {
    ExportButton,
    List,
    SelectColumnsButton,
    TopToolbar,
    TextField,
    DatagridConfigurable,
    // FilterButton,
} from "react-admin";
import PlayPauseButton from "../../../../components/buttons/PlayPauseButton";
import ASRBenchmarkDatagridExpand from "./ASRBenchmarkDatagridExpand";
import FilterButton from "../../../../components/buttons/FilterButton.tsx";

import "./styles.scss";

const ListActions = () => (
    <TopToolbar>
        <FilterButton />
        <SelectColumnsButton
            defaultValue={["seed", "full_text", "wer_google", "wer_kaldi", "wer_wenet"]}
        />
        <ExportButton maxResults={1e9} />
    </TopToolbar>
);

const ASRBenchmarkGoogleList = (props) => {
    // const filters = {
    //     'name|op=substring': 'ma',
    //     'age|op=lt': [18],
    //     'cities': {
    //         'id|op=in': ['NY', 'LA']
    //     },
    //     'status|op=notIn': ["pending", "deleted"]
    // }

    return (
        <List
            actions={<ListActions />}
            sort={{ field: "id", order: "ASC" }}
            perPage={5}
            className="asr-benchmark-list"
        >
            <DatagridConfigurable
                omit={["id", "label_url", "predict_google", "predict_kaldi", "predict_wenet"]}
                expand={<ASRBenchmarkDatagridExpand />}
                className="asr-benchmark-datagrid"
            >
                <TextField source="id" cellClassName="id" />
                <TextField source="seed" cellClassName="seed" />
                <TextField source="label_url" cellClassName="label_url" />
                <TextField source="full_text" cellClassName="full_text" />
                <TextField source="predict_google" cellClassName="predict_google" />
                <TextField source="google_text_type" cellClassName="google_text_type" />
                <TextField source="wer_google" cellClassName="wer_google" />
                <TextField source="predict_kaldi" cellClassName="predict_kaldi" />
                <TextField source="wer_kaldi" cellClassName="wer_kaldi" />
                <TextField source="predict_wenet" cellClassName="predict_wenet" />
                <TextField source="wer_wenet" cellClassName="wer_wenet" />
                <PlayPauseButton />
            </DatagridConfigurable>
        </List>
    );
};

ASRBenchmarkGoogleList.propTypes = {};

export default ASRBenchmarkGoogleList;
