export const pageMixin = {
    data() {
        return {

        }
    },
    methods: {
        runAllProcess() {
            console.log("流程的所有蓝图节点：", this.pageBlueScripts);
            console.log("寻找所有流程的起点");
            let startBlueScripts = [];
            for (let i = 0; i < this.pageBlueScripts.length; i++) {
                if (this.pageBlueScripts[i].config.startPointFlag == true && this.pageBlueScripts[i].blue_script_type !="EventStartRun") {
                    startBlueScripts.push(this.pageBlueScripts[i]);
                }
                //重置所有的运行状态
                //if (typeof (this.pageBlueScripts[i].config.in_out_config.in) != "undefined") {
                //    for (let j = 0; j < this.pageBlueScripts[i].config.in_out_config.in.length; j++) {
                //        this.pageBlueScripts[i].config.in_out_config.in[j].ifProcessFlag = false;
                //    }
                //}
            }
            console.log("执行流程的所有起点：", startBlueScripts);
            console.log("重置流程输入参数运行状态为false：", this.pageBlueScripts);
            console.log("执行流程关键逻辑：只有节点的输入参数的执行状态ifProcess都为true,才会继续走流程！");
            console.log("流程主逻辑--开始执行");
            //执行逻辑
            for (let i = 0; i < startBlueScripts.length; i++) {
                //起点的输入参数都设置ifProcessFlag为true
                let inTemp = startBlueScripts[i].config.in_out_config.in;
                if(typeof (inTemp)!="undefined"){
                    for (let j = 0; j < inTemp.length; j++) {
                        inTemp[j].ifProcessFlag = true;
                    }
                }
                //console.log("startBlueScripts1",startBlueScripts);
                //节点开始执行
                this.runBlueScriptProcess('', '', startBlueScripts[i]);
            }
            //console.log("pageBlueScripts6667:", pageBlueScripts);
        },
        //单个node执行
        runBlueScriptProcess(fromPort, toPort, blueScript) {
            console.log(blueScript.name+",该蓝图fromPort", fromPort);
            console.log(blueScript.name+",该蓝图toPort", toPort);
            console.log(blueScript.name+",该蓝图节点信息：", blueScript);
            let inTemp = blueScript.config.in_out_config.in;
            console.log(blueScript.name+",该蓝图输入信息：", inTemp);



            if(typeof (inTemp)=="undefined"){
                inTemp=[];
            }

            for(let i=0;i<inTemp.length;i++){
                if(toPort==inTemp[i].portID){
                    if(typeof (inTemp[i].onlySet)!="undefined" && inTemp[i].onlySet==true){
                        console.log(blueScript.name+"该蓝图接口("+inTemp[i].label+")不执行蓝图逻辑");
                        return;
                    }
                }
            }



            /**
            let setWaitFlag=0;

            for(let i=0;i<inTemp.length;i++){
                if(toPort==inTemp[i].portID && inTemp[i]=="function"){
                    setWaitFlag=1;
                }
            }
             */

            if(fromPort == "" || inTemp.length == 1) {
                //如果蓝图无输入端口,不需要等待输入
                //如果输入个数为1个参数时，不需要等待输入
                blueScript.waitFlag = false;
            }else if(typeof (blueScript.config.settings)!="undefined" && typeof (blueScript.config.settings.RelevancePortSetProcessFlagToFalse ) != "undefined"){
                //如果设置了关联蓝图节点
                blueScript.waitFlag = true;
            }else{
                blueScript.waitFlag = true;
            }
            console.log(blueScript.name+",该蓝图节点的等待标识：",blueScript.waitFlag);

            let paramObj = {};
            paramObj.runPort = toPort;
            paramObj.blueScript = blueScript;
            paramObj.pageComponents = this.pageComponents;
            paramObj.pageBlueScripts = this.pageBlueScripts;
            paramObj.pageLayouts = this.pageLayouts;
            paramObj.callBackFun = this.callBackFun;

            console.log("当前蓝图eval（执行方法与逻辑）转换blueScript",blueScript);
            if (typeof (blueScript.config.execFunctionStr) != "undefined" && blueScript.config.execFunctionStr != "") {
                blueScript.execFunction = eval("(" + blueScript.config.execFunctionStr + ")");
            }

            blueScript.logic_config = eval("(" + blueScript.config.logic_config_str + ")");


            if (fromPort != '' || toPort != '') {
                console.log("this.pageDebugFlag556",this.pageDebugFlag);

                if(this.pageDebugFlag==true || this.pageDebugFlag=="true"){
                    this.changeEdgeStyle(fromPort, toPort);
                }
            }

            if (blueScript.waitFlag == true) {
                let processArrFlag = [];
                for (let i = 0; i < inTemp.length; i++) {
                    //事件类型不考虑,连接状态为true,执行状态为true,表示该蓝图端口已被执行
                    if (inTemp[i].type != "event" && inTemp[i].type != "function") {
                        if (inTemp[i].connected == true) {
                            if (inTemp[i].ifProcessFlag == true) {
                                processArrFlag.push(true);
                            } else {
                                processArrFlag.push(false);
                            }
                        } else {
                            processArrFlag.push(true);
                        }
                    }
                }
                let toStartFlag = true;//开始执行标识
                for (let i = 0; i < processArrFlag.length; i++) {
                    if (processArrFlag[i] == false) {
                        toStartFlag = false;
                    }
                }
                if (toStartFlag == true) {
                    for(let i=0;i<inTemp.length;i++){
                        if(toPort==inTemp[i].portID && inTemp[i].type=="function"){
                            paramObj.functionReturnValue=this.excuteFunction(inTemp[i],blueScript);
                        }
                    }
                    paramObj.blueScript.debugParamObj = paramObj;
                    paramObj.debugFlag = false;
                    //执行蓝图逻辑
                    console.log(blueScript.name+",开始执行蓝图逻辑");
                    blueScript.config.logic_config.logicFun(paramObj);
                } else {
                    //未全完成输入
                    console.log(blueScript.name+",等待其他参数输入:", blueScript);
                }
            } else if (blueScript.waitFlag == false) {
                for(let i=0;i<inTemp.length;i++){
                    if(toPort==inTemp[i].portID && inTemp[i].type=="function"){
                        paramObj.functionReturnValue=this.excuteFunction(inTemp[i],blueScript);
                    }
                }
                paramObj.blueScript.debugParamObj = paramObj;
                paramObj.debugFlag = false;
                //执行蓝图逻辑
                console.log("blueScript123213144",blueScript);
                if(typeof (blueScript.config.logic_config.logicFun)=="string"){
                    blueScript.config.logic_config.logicFun=eval("(" + blueScript.config.logic_config.logicFun + ")");
                }

                blueScript.config.logic_config.logicFun(paramObj);
            }
        },
        excuteFunction(inObj,blueScript){
            console.log("excuteFunction--inObj:",inObj);
            console.log("excuteFunction--window[\"page\"+this.page_id].cbcDebugPageComponentsInstance:",window["page"+this.page_id].cbcDebugPageComponentsInstance);
            let functionRetrunValue=null;
            for(let m=0;m<window["page"+this.page_id].cbcDebugPageComponentsInstance.length;m++) {
                if (window["page"+this.page_id].cbcDebugPageComponentsInstance[m].component_ref == blueScript.component_ref) {
                    let refObjectTemp=window["page"+this.page_id].cbcDebugPageComponentsInstance[m].refs[blueScript.component_ref];
                    console.log("ref对象"+m,refObjectTemp);
                    if(refObjectTemp!=null){
                        if(inObj.param=="inValue"){
                            functionRetrunValue = window["page"+this.page_id].cbcDebugPageComponentsInstance[m].refs[blueScript.component_ref][inObj.label](inObj.value);
                        }else{
                            functionRetrunValue = window["page"+this.page_id].cbcDebugPageComponentsInstance[m].refs[blueScript.component_ref][inObj.label]();
                        }
                    }
                }
            }
            console.log("functionRetrunValue", functionRetrunValue);
            return functionRetrunValue;
        },

        callBackFun(paramObj) {
            console.log("callBackFun--paramObj456", paramObj);
            if (paramObj.debugFlag == true) {
                window.cbcBlueScriptSettingsInstance.ctx.setCurrentBlueScriptByDebug(paramObj.blueScript);
                return;
            }
            if (paramObj.type == "runNextProcessFun") {
                this.runNextProcessFun(paramObj);
            } else if (paramObj.type == "runChangedProcessFun") {
                this.runChangedProcessFun(paramObj);
            } else if (paramObj.type == "refreshComponentFun") {
                this.refreshComponentFun(paramObj);
            } else if (paramObj.type == "excuteComponentFun") {
                this.excuteComponentFun(paramObj);
            }else if (paramObj.type == "openDialogFun") {
                this.openDialogFun(paramObj);
            }else if (paramObj.type == "closeDialogFun") {
                this.closeDialogFun(paramObj);
            }else if(paramObj.type == "runAllProcess"){
                this.runAllProcess();
            }else if (paramObj.type == "openMapPopupFun") {
                this.openMapPopupFun(paramObj);
            }else if (paramObj.type == "refreshLayout") {
                this.refreshLayout(paramObj);
            }else if (paramObj.type == "refreshLayoutByIndex") {
                this.refreshLayoutByIndex(paramObj);
            }
        },
        //页面块刷新
        refreshLayoutByIndex(paramObj){
            console.log("refreshLayoutByIndex--paramObj", paramObj);
            let typeTemp=paramObj.refreshLayoutObj.layout_config.blocks_components[paramObj.refreshLayoutIndex].type;
            paramObj.refreshLayoutObj.layout_config.blocks_components[paramObj.refreshLayoutIndex].type="no";
            let the=this;
            this.$nextTick(()=>{
                paramObj.refreshLayoutObj.layout_config.blocks_components[paramObj.refreshLayoutIndex].type=typeTemp;
            });

        },

        refreshLayout(paramObj){
            console.log("refreshLayout--paramObj", paramObj);
            let layout=paramObj.value;
            let layoutTypeTemp=layout.layout_type;
            layout.layout_type="no";//值变化，然后刷新
            console.log("refreshLayout--layout",layout);
            let the=this;
            this.$nextTick(()=>{
                layout.layout_type=layoutTypeTemp;
            });
        },
        openMapPopupFun(paramObj) {
            let widthTemp=parseInt(paramObj.popupObj.width);
            let heigthTemp=parseInt(paramObj.popupObj.height);
            //样式计算
            this.divPopupStyle="width: 0;height: 0;margin-left: "+(widthTemp/2-10)+"px;margin-top: 0px;border-left: 10px solid transparent;border-right: 10px solid transparent;border-top: 10px solid rgb(40, 44, 52);";

            let xField = paramObj.blueScript.config.xField;
            let yField = paramObj.blueScript.config.yField;
            if (typeof(xField) == "undefined" || typeof(yField) == "undefined") {
                console.error("未设置x或y字段");
                return;
            }
            let resultTemp = null;
            let inTemp = paramObj.blueScript.config.in_out_config.in;
            for (let i = 0; i < inTemp.length; i++) {
                if (inTemp[i].label == "object") {
                    resultTemp = inTemp[i].value;
                }
            }
            console.log("resultTemp",resultTemp);

            let flagTemp = 0;
            for (let i = 0; i < this.mapPopupArr.length; i++) {
                if (this.mapPopupArr[i].page_block_ref == paramObj.popupObj.page_block_ref) {
                    this.mapPopupArr[i].visible = true;
                    flagTemp = 1;
                }
            }
            if (flagTemp == 0) {
                this.mapPopupArr.push(paramObj.popupObj);
            }
            console.log("openMapPopupFun--this.mapPopupArr", this.mapPopupArr);
            console.log("openMapPopupFun--paramObj", paramObj);
            let map = window.cbcGlobalSettings.params[paramObj.blueScript.config.settings.RelevanceGlobalSettingParamField];
            map.eachLayer(function(layer){
                //删除layerType不是map值的图层
                if(layer.layerType=="divPopup"){
                    map.removeLayer(layer);
                }
            });

            let the=this;

            this.$nextTick(() => {
                //the.sleep(3000);
                let option={};
                option.iconAnchor = [widthTemp/2, heigthTemp+55];
                option.iconSize=[widthTemp,heigthTemp];
                option.html=the.$refs["mapPopup_"+paramObj.popupObj.page_block_ref][0];
                option.html.style.background="rgb(40, 44, 52)";
                console.log("html111",option.html);
                let divLayer = L.marker([resultTemp[yField], resultTemp[xField]], {icon: L.divIcon(option)});
                divLayer.layerType = "divPopup";
                divLayer.addTo(map);
            });

        },
        sleep(numberMillis) {
            let now = new Date();
            let exitTime = now.getTime() + numberMillis;
            while (true) {
                now = new Date();
                if (now.getTime() > exitTime)
                    return;
            }
        },

        openDialogFun(paramObj){
            console.log("openDialogFun--this.dialogArr",this.dialogArr);
            let flagTemp=0;
            for(let i=0;i<this.dialogArr.length;i++){
                if(this.dialogArr[i].page_block_ref==paramObj.dialogObj.page_block_ref){
                    this.dialogArr[i].visible=true;
                    flagTemp=1;
                }
            }
            if(flagTemp==0){
                this.dialogArr.push(paramObj.dialogObj);
            }
        },
        closeDialogFun(paramObj){
            console.log("closeDialogFun--paramObj",paramObj);
            for(let i=0;i<this.dialogArr.length;i++){
                if(this.dialogArr[i].page_block_ref==paramObj.dialogObj.page_block_ref){
                    this.dialogArr[i].visible=false;
                }
            }
        },

        /**
         * 运行所有的输出节点
         * 根据下一个ref,port,value设置值并执行该蓝图节点
         let obj={};
         obj.blue_script_ref
         obj.fromPort
         obj.toPort
         obj.value
         */
        runNextProcessFun(paramObj) {
            //console.log("param8885", paramObj);
            //执行有连接状态的下一个蓝图节点
            console.log(paramObj.blueScript.name+":runNextProcessFun--paramObj:", paramObj);
            for (let i = 0; i < paramObj.blueScript.config.in_out_config.out.length; i++) {
                let outTemp = paramObj.blueScript.config.in_out_config.out[i];
                //console.log("typeof(paramObj.value)",typeof(paramObj.value));
                //输出端口赋值
                outTemp.value=paramObj.value;
                //输出端的执行状态
                outTemp.ifProcessFlag = true;

                if (typeof (outTemp.connectedTargetArr) != "undefined") {
                    for (let j = 0; j < outTemp.connectedTargetArr.length; j++) {
                        let connectedTargetTemp = outTemp.connectedTargetArr[j];
                        let param = {};
                        param.blue_script_ref = connectedTargetTemp.cell;
                        param.fromPort = outTemp.connectedSource.port;
                        param.toPort = connectedTargetTemp.port;
                        param.value = paramObj.value;
                        this.setNodeInValueAndRunProcessFun(param);
                    }
                }
            }
            //执行有配置的下一个蓝图节点
            if(typeof (paramObj.blueScript.config.settings)!="undefined" && typeof (paramObj.blueScript.config.settings.RelevanceBlueScriptsRefresh)!="undefined"){
                for(let i=0;i<paramObj.blueScript.config.settings.RelevanceBlueScriptsRefresh.length;i++){
                    for (let j = 0; j < this.pageBlueScripts.length; j++) {
                        if (paramObj.blueScript.config.settings.RelevanceBlueScriptsRefresh[i].blue_script_ref == this.pageBlueScripts[j].blue_script_ref) {
                            this.runBlueScriptProcess('', '', this.pageBlueScripts[j]);
                        }
                    }
                }
            }

        },
        runChangedProcessFun(paramObj) {
            console.log(paramObj.blueScript.name+"runChangedProcessFun--paramObj:", paramObj);
            for (let j = 0; j < paramObj.changedOut.connectedTargetArr.length; j++) {
                /**
                //out赋值
                for (let i = 0; i < paramObj.blueScript.config.in_out_config.out.length; i++) {
                    let outTemp = paramObj.blueScript.config.in_out_config.out[i];
                    //console.log("typeof(paramObj.value)",typeof(paramObj.value));
                    if(outTemp.portID==paramObj.changedOut.portID){
                        outTemp.value = paramObj.value;
                    }else{
                        outTemp.value = null;
                    }
                    //输出端的执行状态
                }
                 */

                let connectedTargetTemp = paramObj.changedOut.connectedTargetArr[j];
                let param = {};
                param.blue_script_ref = connectedTargetTemp.cell;
                param.fromPort = paramObj.changedOut.connectedSource.port;
                param.toPort = connectedTargetTemp.port;
                param.value = paramObj.value;
                this.setNodeInValueAndRunProcessFun(param);

            }
        },

        setNodeInValueAndRunProcessFun(param) {
            console.log("setNodeInValueAndRunProcessFun--param:", param);
            for (let i = 0; i < this.pageBlueScripts.length; i++) {
                if (this.pageBlueScripts[i].blue_script_ref == param.blue_script_ref) {
                    //console.log("this.pageBlueScripts8885", this.pageBlueScripts[i]);
                    for (let j = 0; j < this.pageBlueScripts[i].config.in_out_config.in.length; j++) {
                        let inTemp = this.pageBlueScripts[i].config.in_out_config.in[j];
                        console.log("setNodeInValueAndRunProcessFun--inTemp", inTemp);
                        if (inTemp.portID == param.toPort) {
                            inTemp.value = param.value;
                            inTemp.ifProcessFlag = true;
                            if (typeof (this.pageBlueScripts[i].config.dataSet) != "undefined") {
                                //值不是数组
                                if(typeof(param.value)!="undefined" && typeof (param.value.length)=="undefined"){
                                    //设置dataSet数据
                                    this.pageBlueScripts[i].config.dataSet.data = [param.value];
                                    //设置dataSet字段
                                    if (this.pageBlueScripts[i].config.dataSet.data.length > 0) {
                                        let objTemp = this.pageBlueScripts[i].config.dataSet.data[0];
                                        this.pageBlueScripts[i].config.dataSet.fields = [];
                                        for (let key in objTemp) {
                                            this.pageBlueScripts[i].config.dataSet.fields.push(key);
                                        }
                                    }
                                }else{

                                    //值是数组
                                    //设置dataSet数据
                                    this.pageBlueScripts[i].config.dataSet.data = param.value;
                                    console.log("设置dataSet数据this.pageBlueScripts[i]",this.pageBlueScripts[i]);
                                    //设置dataSet字段
                                    if (this.pageBlueScripts[i].config.dataSet.data.length > 0) {
                                        let objTemp = this.pageBlueScripts[i].config.dataSet.data[0];
                                        this.pageBlueScripts[i].config.dataSet.fields = [];
                                        for (let key in objTemp) {
                                            this.pageBlueScripts[i].config.dataSet.fields.push(key);
                                        }
                                    }
                                }

                            }

                            this.runBlueScriptProcess(param.fromPort, param.toPort, this.pageBlueScripts[i]);


                        }
                    }
                }
            }
        },


        /**
         * 刷新组件方法
         * let param={};
         * param.pageComponents=param.pageComponents;
         * param.refreshComponent=param.pageComponents[i];
         * @param param
         */
        refreshComponentFun(paramObj) {
            console.log("refreshComponentFun--paramObj", paramObj);
            for (let i = 0; i < paramObj.pageComponents.length; i++) {
                if (paramObj.blueScript.component_ref != "") {
                    if (paramObj.blueScript.component_ref == paramObj.pageComponents[i].component_ref) {
                        //蓝图dataSet赋值到组件的dataSet中
                        if(typeof (paramObj.blueScript.config.dataSet)!="undefined"){
                            paramObj.pageComponents[i].component_config.dataset = paramObj.blueScript.config.dataSet;
                        }
                        this.$refs[this.layoutPageBlockRef].refreshPageComponent(paramObj.pageComponents[i])
                    }
                } else {
                    if (paramObj.component_ref == paramObj.pageComponents[i].component_ref) {
                        //蓝图dataSet赋值到组件的dataSet中
                        if(typeof (paramObj.blueScript.config.dataSet)!="undefined"){
                            paramObj.pageComponents[i].component_config.dataset = paramObj.blueScript.config.dataSet;
                        }
                        this.$refs[this.layoutPageBlockRef].refreshPageComponent(paramObj.pageComponents[i])
                    }
                }

            }
        },
        /**
         * 调用组件里面的方法
         * let obj={};
         * obj.blue_script_ref=param.blueScript.blue_script_ref;
         * obj.label=inTemp.label;
         * @param param
         */
        excuteComponentFun(paramObj) {
            //待完善
            //console.log("excuteComponentFun--paramObj", paramObj);
            this.$refs[this.layoutPageBlockRef].excuteComponentFun(paramObj);
        },

        changeEdgeStyle(fromPort, toPort) {
            //console.log("ttttt1fromPort,toPort", fromPort, toPort);
            const edges = window.cbcBlueScriptInstance.data.graph.getEdges();
            console.log("ttttt1edges", edges);
            for (let i = 0; i < edges.length; i++) {
                if (edges[i].source.port == fromPort && edges[i].target.port == toPort) {
                    edges[i].attr('line', {
                        stroke: '#1890ff',
                        strokeDasharray: 5,
                        style: {
                            animation: 'ant-line 30s infinite linear'
                        }
                    })
                }
            }
        },



    },
}


