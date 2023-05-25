import React, { forwardRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";

import { randomColor } from "@utils/randomColor";


const Waveform = forwardRef(({
    url, 
    annotations, 
    
    updateDataTableByWavesurfer,
    updateResultLabel,
}, ref) => {
    const [waveformLoaded, setWaveformLoaded] = useState(false);
    
    useEffect(() => {
        ref.current = WaveSurfer.create({
            container: "#waveform",
            waveColor: "#D9DCFF",
            progressColor: "#4353FF",
            cursorColor: "#4353FF",

            barWidth: 3,
            barRadius: 3,
            cursorWidth: 1,
            height: 100,
            barGap: 3,
            backend: 'WebAudio',
            
            plugins: [
                TimelinePlugin.create({
                    container: "#waveform-timeline",
                    timeInterval: (pxPerSec) => {
                        var retval = 1;
                        if (pxPerSec >= 25 * 100) {
                            retval = 0.01;
                        } else if (pxPerSec >= 25 * 40) {
                            retval = 0.025;
                        } else if (pxPerSec >= 25 * 10) {
                            retval = 0.1;
                        } else if (pxPerSec >= 25 * 4) {
                            retval = 0.25;
                        } else if (pxPerSec >= 25) {
                            retval = 1;
                        } else if (pxPerSec * 5 >= 25) {
                            retval = 5;
                        } else if (pxPerSec * 15 >= 25) {
                            retval = 15;
                        } else {
                            retval = Math.ceil(0.5 / pxPerSec) * 60;
                        }
                        return retval;
                    },
                    fontSize: 12,
                }),
                RegionsPlugin.create(),
            ],
        })
        ref.current.on("ready", () => {
            setWaveformLoaded(true)
        })
    })

    useEffect(() => {
        if (url) {
            ref.current.load(url);
            ref.current.on("ready", function (region) {
                ref.current.enableDragSelection({
                    slop: 5,
                    color: randomColor(0.2),
                });

                ref.current.clearRegions();

                // load new anntations
                loadRegions(annotations, ref.current);
                // setWavesurfer(ref.current);
                
            });
        }
    }, [url])
    

    /**
     * Load annotations
     */
    const loadRegions = (annotations, wavesurfer) => {
        annotations.map((annotation, id) => {
            const region = {}
            region.color = randomColor(0.2);
            region.data = {};
            
            region.start = annotation.content.tag.index / 1000;
            region.end = (annotation.content.tag.length + annotation.content.tag.index) / 1000;
            region.data.note = annotation.content.tag.text;
            
            region.data.audibility = annotation.content.extras?.classify?.audibility || "good";
            region.data.noise = annotation.content.extras?.classify?.noise || "clean";
            region.data.echo = annotation.content.extras?.classify?.echo || "clean";
            region.data.region = annotation.content.extras?.classify?.region || "other";

            region.data.review = annotation.content.extras?.review || "";
            wavesurfer.addRegion(region);
        });

        const newDataTable = updateDataTableByWavesurfer(wavesurfer);
        updateResultLabel(newDataTable);
    };
    
    return (
        <div>
            <div 
                id="waveform" 
                style={{
                    visibility : `${waveformLoaded ? 
                "visible": "hiddent"}`
                }}
            />
            <div 
                id="waveform-timeline"
                style={{
                    visibility : `${waveformLoaded ? 
                "visible": "hiddent"}`
                }}
            />
        </div>
    );
});

Waveform.propTypes = {
    
};

export default Waveform;