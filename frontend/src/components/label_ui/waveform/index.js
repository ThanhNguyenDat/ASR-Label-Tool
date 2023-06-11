import React, {useState, useEffect, forwardRef} from "react";
import WaveSurfer from "wavesurfer.js";
import * as WaveSurferRegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import * as WaveSurferTimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";

const Waveform = forwardRef(({
    url, 
    annotations,
}, ref) => {
    
    const [zoomLevel, setZoomLevel] = useState(3);
    const [waveformLoaded, setWaveformLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

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
                WaveSurferTimelinePlugin.create({
                    container: "#waveform-timeline",
                    fontSize: 12,
                    // timeInterval: (pxPerSec) => {
                    //     var retval = 1;
                    //     if (pxPerSec >= 25 * 100) {
                    //         retval = 0.01;
                    //     } else if (pxPerSec >= 25 * 40) {
                    //         retval = 0.025;
                    //     } else if (pxPerSec >= 25 * 10) {
                    //         retval = 0.1;
                    //     } else if (pxPerSec >= 25 * 4) {
                    //         retval = 0.25;
                    //     } else if (pxPerSec >= 25) {
                    //         retval = 1;
                    //     } else if (pxPerSec * 5 >= 25) {
                    //         retval = 5;
                    //     } else if (pxPerSec * 15 >= 25) {
                    //         retval = 15;
                    //     } else {
                    //         retval = Math.ceil(0.5 / pxPerSec) * 60;
                    //     }
                    //     return retval;
                    // },
                }),
                WaveSurferRegionsPlugin.create(),
            ],
        })
        if (url) {
            ref.current.load(url);
            ref.current.zoom(zoomLevel);

            ref.current.on("ready", function (region) {
                ref.current.enableDragSelection({
                    slop: 5,
                    // color: randomColor(0.2),
                    
                });

                ref.current.clearRegions();

                // load new anntations
                if (annotations) {
                    loadRegions(annotations, ref.current);
                }

                setWaveformLoaded(true);
            });

            ref.current.on("region-created", (region) => {
                region.color = "rgba(188, 188, 188, 0.2)";
            })

            ref.current.on("region-click", (region, event) => {
                event.stopPropagation();
                // play region and replay region
                region.play()
                if (event.shiftKey) {
                    region.update({
                        loop: true
                    })
                } else {
                    region.update({
                        loop: false
                    })
                }
            });
            ref.current.on("play", () => setIsPlaying(true));
            ref.current.on("pause", () => setIsPlaying(false));

            const handleResize = ref.current.util.debounce(() => {
                ref.current.empty();
                ref.current.drawBuffer();
            }, 150);
            window.addEventListener("resize", handleResize, false);
            return () => {
                window.removeEventListener("resize", handleResize, false);
            }
        }
    }, []);

    /**
     * Load annotations
     * FORMAT segment:
     * {
     *      start: Float (second),
     *      end: Float (second),
     *      color: rgba(255, 255, 255, 1),
     *      data: {
     *          ...data
     *      }
     * }
     */
    const loadRegions = (annotations, wavesurfer) => {
        annotations.forEach((segment, id) => {
            wavesurfer.addRegion({
                ...segment
            });
        });
    };
    const zoomIn = (e) => {
        ref.current.zoom(e.target.value);
        setZoomLevel(e.target.value);
    };

    const deleteSegment = (id) => {
        ref.current.regions.list[id].remove();
    }

    return (
        <React.Fragment>
            <div
                id="waveform" 
                style={{
                    visibility : `${waveformLoaded ? 
                "visible": "hidden"}`
                }}
            />
            <div 
                id="waveform-timeline"
                style={{
                    visibility : `${waveformLoaded ? 
                "visible": "hidden"}`
                }}
            />
        </React.Fragment>
    );
});

Waveform.propTypes = {
    
};

export default Waveform;