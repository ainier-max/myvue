// 返回一个将对象中的函数都转化为字符串的对象　不直接在原对象上面改
function stringifyFunction(obj){
    let newObj = JSON.parse(JSON.stringify(obj))
    for(let key in obj){
        if(obj[key] instanceof Function){
            newObj[key] = obj[key].toString().replace(/[\n\t]/g,"");
            continue;
        }
        if(obj[key] instanceof Object){
            newObj[key] = stringifyFunction(obj[key]);
        }
    }
    return newObj;
}

export function objectToString(obj){  // 用于替代JSON.stringify函数
    let _object = stringifyFunction(obj);  // 将对象中的函数转为字符串
    return JSON.stringify(_object)  // 将对象转为字符串
}


function stringToFunction(obj){  // 将对象中的函数字符串转化为函数
    for(let key in obj){
        if(obj[key] instanceof Object){
            stringToFunction(obj[key]);
        }else{

            if(typeof (obj[key])=='string' && obj[key].trim().startsWith("function")){ // 是一个函数
                try{
                    let params = obj[key].substring(obj[key].indexOf('(')+1,obj[key].indexOf(')'));
                    let operation = obj[key].substring(obj[key].indexOf("{")+1,obj[key].length-1);
                    obj[key] = new Function(params, operation);
                }catch(e){
                    console.log(e)
                }
            }
        }
    }
    return obj
}

export function stringToObject(string){  // 用于替代JSON.parse
    let obj = JSON.parse(string);  //将字符串转为对象
    return stringToFunction(obj)    // 将对象中的函数字符串转为函数
}

