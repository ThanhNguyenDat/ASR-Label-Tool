var AL = {};
!(function (e) {
    var t = [
        "event:got_results",
        "event:got_settings",
        "event:got_key_press",
        "event:got_update_select_class",
        "event:got_results_fail"
    ],
        n = {},
        s = [
            "cevent:got_data",
            "cevent:got_request_setting",
            "cevent:got_request_result",
            "cevent:got_common_info",
            "cevent:got_request_reset",
            "cevent:got_update_select_class",
            "cevent:push_results_fail"
        ];
    function a(e, n) {
        if (!t.includes(e)) throw "Child event " + e + " is not exist";
        var s;
        (package_data = { name: e, data: n }),
            (s = package_data),
            window.parent.postMessage(JSON.stringify(s), "*");
    }
    function o(e, t) {
        if (!s.includes(e)) throw "Event " + e + " is not exist";
        n[e] = t;
    }
    window.addEventListener("message", function (e) {
        if (
            ((event_package_data = JSON.parse(e.data)),
                (ename = event_package_data.name),
                !(s.includes(ename) && ename in n))
        )
            throw "Event " + ename + " is not registed or not exist";
        (handler = n[ename]), handler(event_package_data.data);
    }),
        $(document).on("keypress", function (e) {
            a("event:got_key_press", {
                key: e.key,
                keyCode: e.keyCode,
                charCode: e.charCode,
                shiftKey: e.shiftKey,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey
            });
        }),
        (e.onReceiveCommonInfo = function (e) {
            o("cevent:got_common_info", e);
        }),
        (e.onReceiveData = function (e) {
            o("cevent:got_data", e);
        }),
        (e.onReceiveRequestResult = function (e) {
            o("cevent:got_request_result", e);
        }),
        (e.onReceiveRequestSettings = function (e) {
            o("cevent:got_request_setting", e);
        }),
        (e.onReceiveRequestResetCurrent = function (e) {
            o("cevent:got_request_reset", e);
        }),
        (e.onUpdateSelectClass = function (e) {
            o("cevent:got_update_select_class", e);
        }),
        (e.onPushResultFail = function (e) {
            o("cevent:push_results_fail", e);
        }),
        (e.pushResult = function (e) {
            a("event:got_results", e);
        }),
        (e.pushResultFail = function () {
            a("event:got_results_fail", {});
        }),
        (e.pushSettings = function (e) {
            a("event:got_settings", e);
        }),
        (e.updateCurrentSelectedClass = function (e) {
            a("event:got_update_select_class", { class_id: e });
        });
})(AL);
