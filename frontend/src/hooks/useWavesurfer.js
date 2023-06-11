import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import * as WaveSurferRegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import * as WaveSurferTimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";

const useWavesurfer = (audioUrl, annotations) => {
  const wavesurferRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Khởi tạo Wavesurfer khi component được tạo
    wavesurferRef.current = WaveSurfer.create({
        container: wavesurferRef.current,
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
                // WaveSurferTimelinePlugin.create({
                //     container: "#waveform-timeline",
                //     fontSize: 12,
                //     // timeInterval: (pxPerSec) => {
                //     //     var retval = 1;
                //     //     if (pxPerSec >= 25 * 100) {
                //     //         retval = 0.01;
                //     //     } else if (pxPerSec >= 25 * 40) {
                //     //         retval = 0.025;
                //     //     } else if (pxPerSec >= 25 * 10) {
                //     //         retval = 0.1;
                //     //     } else if (pxPerSec >= 25 * 4) {
                //     //         retval = 0.25;
                //     //     } else if (pxPerSec >= 25) {
                //     //         retval = 1;
                //     //     } else if (pxPerSec * 5 >= 25) {
                //     //         retval = 5;
                //     //     } else if (pxPerSec * 15 >= 25) {
                //     //         retval = 15;
                //     //     } else {
                //     //         retval = Math.ceil(0.5 / pxPerSec) * 60;
                //     //     }
                //     //     return retval;
                //     // },
                // }),
                WaveSurferRegionsPlugin.create(),
            ],
        });

        // Load âm thanh từ URL
        wavesurferRef.current.load(audioUrl);

        // Xử lý khi âm thanh đã được tải
        wavesurferRef.current.on('ready', () => {
            wavesurferRef.current.enableDragSelection({
                slop: 5,
                // color: randomColor(0.2),
            });

            clearSegments();
            if (annotations) {
                loadRegions(annotations, wavesurferRef.current);
            }

            setIsLoading(false);
        });

        wavesurferRef.current.on("play", () => setIsPlaying(true));
        wavesurferRef.current.on("pause", () => setIsPlaying(false));


        wavesurferRef.current.on("region-created", (region) => {
            region.color = "rgba(188, 188, 188, 0.2)";
        })

        wavesurferRef.current.on("region-click", (region, event) => {
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

        // Hủy bỏ đối tượng Wavesurfer khi component bị huỷ
        return () => wavesurferRef.current?.destroy();
    }, [audioUrl]);
    
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

    const togglePlaying = () => {
        if (wavesurferRef.current) {
            const togglePlayback = () => {
                if (wavesurferRef.current?.isPlaying()) {
                    wavesurferRef.current.pause();
                    setIsPlaying(false);
                } else {
                    wavesurferRef.current.play();
                    setIsPlaying(true);
                }
            };
            togglePlayback();
        }
    };

    const stopPlayback = () => wavesurferRef.current.stop();
    const clearSegments = () => wavesurferRef.current.clearRegions();

    const zoomIn = (e) => {
        wavesurferRef.current.zoom(e.target.value);
        // setZoomLevel(e.target.value);
    };

    const deleteSegment = (id) => {
        wavesurferRef.current.regions.list[id].remove();
    }

    return { wavesurferRef, isLoading, isPlaying, togglePlaying, stopPlayback, clearSegments };
};

export default useWavesurfer;