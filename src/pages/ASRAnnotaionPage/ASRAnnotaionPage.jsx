import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import Waveform from "../../components/Waveform";
import useScript from "../../hooks/useScript";

import style from "./ASRAnnotaionPage.scss";

import { customArray, iterifyArr } from '../../utils/customArray'

const cx = classNames.bind(style)

// const _audioUrl =
//   "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3"; // bi loi

// const _audioUrl =
//   "https://assets.mixkit.co/active_storage/sfx/1714/1714-preview.mp3"; // khoong bi loi

const formatAnnotaion = [
    {
        item_info: {
            url: "https://assets.mixkit.co/active_storage/sfx/1714/1714-preview.mp3",
        },
        annotations: [
            { start: 0, end: 1, description: "alo 0 1" },
            { start: 2, end: 3, description: "alo 2 3" },
        ],
    },

    {
        item_info: {
            url: "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3",
        },
        annotations: [{ start: 0, end: 1, description: "alo 0 1" }],
    },

    {
        item_info: {
            url: "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3",
        },
    },
];




const data = {
    "annotations": [
        {
            "class_id": 3579,
            "class_name": "Human",
            "content": {
                "index": 0, // start
                "length": 2, // end - start
                "text": "alo" // description
            },
            "extra": {
                "hard_level": 1,
                "classify": "noise"
            }
        },
        {
            "class_id": 3579,
            "class_name": "Human",
            "content": {
                "index": 2,
                "length": 0.5,
                "text": "1234"
            },
            "extra": {
                "hard_level": 0,
                "classify": "normal"
            }
        }
    ],
    "data": [
        {
            "data_cat_id": 2,
            "dataset_id": 1970,
            "seed": 380,
            "id": 2677,
            "file_name": "https://assets.mixkit.co/active_storage/sfx/1714/1714-preview.mp3" //url
        }
    ]
}



function ASRAnnotaionPage(props) {
    // useScript({ url: "https://label.lab.zalo.ai/ui/ailab_ui_api.js" });

    const [dataLabels, setDataLabels] = useState({})

    useEffect(() => {
        if (window.AL) {
            window.AL.onReceiveData(function (data) {
                setDataLabels(data)
            })
        }
    }, [])

    // update props
    props = {
        // audioUrl: audioUrl,
        // annotations: annotations,
        dataLabels: data || {}, // dataLabels
        ...props
    }

    return (
        <div className={cx("container ASRAnnotaionPage")}>
            <Waveform {...props} />
        </div>
    );
}

export default ASRAnnotaionPage;
