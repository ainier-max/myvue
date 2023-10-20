export function commonSelectRequest(axios, param, callback) {
    //debugger
    let headers_config={
        headers: {
            "Content-Type":"application/json;charset=utf-8",
            "dataType":"json"
        }
    }
    axios.post(window.cbcConfig.serverUrl + '/cbc/select.cbc', param, headers_config)
        .then(response => {
            //console.log(param.sql + "对应结果集为：", response);
            if (response.data[0].state == "success") {
                callback(response.data[0]);
            } else {
                console.error("服务异常,错误信息1：", response.data[0].message);
            }
        }).catch(error => {
        console.error("服务异常,错误信息2：", error);
    });
}

export function commonBatchSelectRequest(axios, param, callback) {
    //debugger
    let headers_config={
        headers: {
            "Content-Type":"application/json;charset=utf-8",
            "dataType":"json"
        }
    }
    axios.post(window.cbcConfig.serverUrl + '/cbc/selectByBatch.cbc', param, headers_config)
        .then(response => {
            console.log("commonBatchSelectRequest--对应结果集为：", response);
            if (response.data[0].state == "success") {
                callback(response.data[0]);
            } else {
                console.error("服务异常,错误信息1：", response.data[0].message);
            }
        }).catch(error => {
        console.error("服务异常,错误信息2：", error);
    });
}



export function commonSelectRequestAndOtherParam(axios, param, callback, otherParam) {
    let headers_config={
        headers: {
            "Content-Type":"application/json;charset=utf-8",
            "dataType":"json"
        }
    }
    axios.post(window.cbcConfig.serverUrl + '/cbc/select.cbc', param, headers_config)
        .then(response => {
            //console.log(param.sql + "对应结果集为：", response);
            if (response.data[0].state == "success") {
                callback(response.data[0], otherParam);
            } else {
                console.error("服务异常,错误信息1：", response.data[0].message);
            }
        }).catch(error => {
        console.error("服务异常,错误信息2：", error);
    });
}

export function commonExcuteRequest(axios, param, callback) {
    let headers_config={
        headers: {
            "Content-Type":"application/json;charset=utf-8",
            "dataType":"json"
        }
    }
    //console.log(param.sql + "对应参数：", param);
    axios.post(window.cbcConfig.serverUrl + '/cbc/excute.cbc', param, headers_config)
        .then(response => {
            if (response.data[0].state == "success") {
                callback(response.data[0]);
            } else {
                console.error("服务异常,错误信息：", response.data[0].message);
            }
        }).catch(error => {
        console.error("服务异常,错误信息：", error);
    });
}

export function commonExcuteByBatchRequest(axios, param, callback) {
    let headers_config={
        headers: {
            "Content-Type":"application/json;charset=utf-8",
            "dataType":"json"
        }
    }
    //console.log(param.sql + "对应参数：", param);
    axios.post(window.cbcConfig.serverUrl + '/cbc/excuteByBatch.cbc', param, headers_config)
        .then(response => {
            if (response.data[0].state == "success") {
                callback(response.data[0]);
            } else {
                console.error("服务异常,错误信息：", response.data[0].message);
            }
        }).catch(error => {
        console.error("服务异常,错误信息：", error);
    });
}



export function commonExcuteRequestAndOtherParam(axios, param, callback,otherParam) {
    let headers_config={
        headers: {
            "Content-Type":"application/json;charset=utf-8",
            "dataType":"json"
        }
    }
    //console.log(param.sql + "对应参数：", param);
    axios.post(window.cbcConfig.serverUrl + '/cbc/excute.cbc', param, headers_config)
        .then(response => {
            //console.log(param.sql + "对应结果集为：", response);
            callback(response.data[0],otherParam);
        }).catch(error => {
        console.error("服务异常,错误信息2：", error);
    });
}

