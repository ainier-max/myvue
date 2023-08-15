let option={
    devOption:{
        attr: {

        },
        option: {
            overflow: "auto",
            margin:[10,10]
        }
    },
    logic_config:{
        logicFun: function(paramObj) {
            console.log("内置组件--栏目：", paramObj);
        }
    },
    blue_script_node_config:{
        shape: 'static-in-rect',
        width: 150,
        height: 160,
        attrs: {
            body: {
                fill: 'rgba(40, 44, 52,0.9)',
                stroke: '#d9d9d9',
                strokeWidth: 1,
            },
            label: {
                fill: 'rgba(255,255,255,0.8)', // 文字颜色
                fontSize: 14, // 文字大小
                refX: 0.5,
                refY: 8,
                textAnchor: 'middle',
                textVerticalAnchor: 'top',
            },
        },
    },
    blue_script_in_out_config:{
        in: [{
            key: 'startEdit',
            label: 'startEdit',
            value: null,
            type: 'function',
            connected: false,
            show: true
        }],
    },
    blue_script_visualize_config:{
        settings: [
            "ShowInParam", "ShowOutParam"
        ]
    }
}

export default option;
