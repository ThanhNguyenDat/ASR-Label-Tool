const routes = {
    home: {
        to: "/",
    },

    dashboard: {
        to: "/dashboard",
        name: "dashboard",
    },

    // user
    users: {
        to: "/users",
        name: "users",
        label: "Users",
        children: [],
    },

    asr: {
        name: "asr",
        label: "ASR",
        childrens: [
            {
                to: "/asr_label",
                name: "asr_label",
                label: "ASR Label",
            },
            {
                to: "/asr_segments",
                name: "asr_segments",
                label: "ASR Segments",
            },
            {
                to: "/asr_benchmark",
                name: "asr_benchmark",
                label: "ASR Benchmark",
            },
        ],
    },
};

export default routes;
