const routes = {
    home: {
        to: "/",
    },

    dashboard: {
        to: "/dashboard",
        name: "dashboard"
    },

    // user
    users: {
        to: "/users",
        name: "users",
        label: "Users",
        children: [
            
        ]
    },


    // asr
    asr_label: {
        to: "/asr_label",
        name: "asr_label",
        label: "ASR Label",
        children: [
            {
                to: "/asr_label/:id",
            }
        ]
    },
    asr_segments: {
        to: "/asr_segments",
        name: "asr_segments",
        label: "ASR Segments",
        children: [

        ]
    },
};

export default routes;