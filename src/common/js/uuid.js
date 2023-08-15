//生成uuid,如：emmbqwqwic1665479288115
export function uuid() {
    let wordArr=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    let newStr="";
    for(let i=0;i<10;i++){
        let random=Math.floor(Math.random() * 25);
        newStr=newStr+wordArr[random]
    }
    let nowDate=new Date();
    return newStr+nowDate.getTime();
}
