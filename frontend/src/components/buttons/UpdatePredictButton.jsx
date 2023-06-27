import React from "react";

import {
    Button,
    useDataProvider,
    useNotify,
    useRefresh,
    useRecordContext,
    useResourceContext,
} from "react-admin";
import { useMutation } from "react-query";
import { Tooltip, IconButton } from "@mui/material";
import EditNotificationsIcon from "@mui/icons-material/EditNotifications";

const UpdatePredictButton = (props) => {
    const dataProvider = useDataProvider();
    const refresh = useRefresh();
    const notify = useNotify();
    const resource = useResourceContext();

    const record = useRecordContext();
    const { seed, id, label_url, index, length } = record;
    const request_data = {
        seed: seed,
        item_id: id,
        id: id,
        start_time: index,
        end_time: index + length,
        url: label_url,
    };

    // todo:
    const { mutate, isLoading, error, isSuccess } = useMutation(
        () => dataProvider.updatePredict(resource, request_data),
        {
            onError: (error) => {
                notify(`Can't to update predict data with error: ${error.message}`, {
                    type: "error",
                });
            },
            onSuccess: () => {
                refresh();
            },
        }
    );

    const handleCallPredict = () => {
        // mutate()
    };

    return (
        <Tooltip title="Update predict" placement="top">
            <IconButton
                onClick={handleCallPredict}
                sx={{ width: "5%" }}
                disabled={isLoading}
                {...props}
            >
                <EditNotificationsIcon />
            </IconButton>
        </Tooltip>
    );
};

UpdatePredictButton.propTypes = {};

export default UpdatePredictButton;
