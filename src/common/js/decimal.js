//浮点数保留两位小数
//1.功能：将浮点数四舍五入，取小数点后2位
export function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return;
    }
    f = Math.round(x*100)/100;
    return f;
}

//2.强制保留2位小数，如：2，会在2后面补上00.即2.00
export function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

// 3.保留两位小数 浮点数四舍五入 位数不够 不补0
export function fomatFloat(src,pos){
    return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
}