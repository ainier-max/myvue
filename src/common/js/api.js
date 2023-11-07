import axios from "axios";

let headers_config = {
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    dataType: "json",
  },
};
export function commonSelectRequest(param) {
  return axios
    .post("/cbc/select.cbc", param, headers_config)
    .then((response) => {
      //console.log(param.sql + "对应结果集为：", response);
      if (response.data[0].state == "success") {
        return response.data[0];
      } else {
        return response.data[0];
        console.error("服务异常,错误信息1：", response.data[0].message);
      }
    })
    .catch((error) => {
      return error;
      console.error("服务异常,错误信息2：", error);
    });
}
