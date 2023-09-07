let myip="127.0.0.1";
//let myip="10.11.0.87";
window.cbcConfig={
    //应用部署地址(后缀必须'/')
    deployUrl:"http://"+myip+":4000/",
    //依赖文件地址
    DependenciesPackageUrl:"http://"+myip+":8089/",
    //请求后端接口地址
    serverUrl:"http://"+myip+":8087/",
    uploadUrl:"http://"+myip+":8087/cbc/upload.cbc",
    getFileUrl:"http://"+myip+":8087/cbc/getFile.cbc",
    deleteFileUrl:"http://"+myip+":8087/cbc/deleteFile.cbc",
}




window.cbc_headers_config={
    

}