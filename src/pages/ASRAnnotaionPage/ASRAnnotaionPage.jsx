import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import Waveform from "../../components/Waveform";
import useScript from "../../hooks/useScript";

const cx = classNames.bind()

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

function ASRAnnotaionPage(props) {
    // useScript({ url: "https://label.lab.zalo.ai/ui/ailab_ui_api.js" });

    const [audioUrl, setAudioUrl] = useState(
        formatAnnotaion[0]["item_info"]["url"]
    ); // string

    const [annotations, setAnnotations] = useState(
        formatAnnotaion[0]["annotations"]
    ); // array

    return (
        <div className={cx("container ASRAnnotaionPage")}>
            <input
                placeholder="Nhập link audio"
                onChange={(event) => {
                    setAudioUrl(event.target.value);
                    setAnnotations([]);
                }}
            />
            {audioUrl && (
                <Waveform audioUrl={audioUrl} annotations={annotations} />
            )}
        </div>
    );
}

export default ASRAnnotaionPage;
