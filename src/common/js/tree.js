//方法1
//按elemenui tree的数据结构去构造数据
export function getListData(objects, otherParams) {
  var dataArray = [];
  for (var i = 0; i < objects.length; i++) {
    let parentId = objects[i].pid;
    if (parentId === null) {
      let objTemp = {
        id: objects[i].id,
        label: objects[i].name,
        pid: objects[i].pid,
      };
      for (let j = 0; j < otherParams.length; j++) {
        objTemp[otherParams[j]] = objects[i][otherParams[j]];
      }
      dataArray.push(objTemp);
    }
  }
  return data2treeDG(objects, dataArray, otherParams);
}
//递归children
export function data2treeDG(datas, dataArray, otherParams) {
  for (let j = 0; j < dataArray.length; j++) {
    let dataArrayIndex = dataArray[j];
    let childrenArray = [];
    let Id = dataArrayIndex.id;
    for (let i = 0; i < datas.length; i++) {
      let data = datas[i];
      let parentId = data.pid;
      if (parentId == Id) {
        //判断是否为儿子节点
        let objTemp = {
          id: data.id,
          label: data.name,
          pid: data.pid,
        };
        for (let j = 0; j < otherParams.length; j++) {
          objTemp[otherParams[j]] = data[otherParams[j]];
        }
        childrenArray.push(objTemp);
      }
    }
    dataArrayIndex.children = childrenArray;
    if (childrenArray.length > 0) {
      data2treeDG(datas, childrenArray, otherParams);
    }
  }
  return dataArray;
}
//方法2
//数组和树结构数据相互转换
export function translateDataToTree(datas) {
  //没有父节点的数据
  let parents = datas.filter(
    (value) => value.pid == "undefined" || value.pid == null
  );
  //有父节点的数据
  let childrens = datas.filter(
    (value) => value.pid !== "undefined" && value.pid != null
  );
  //定义转换方法的具体实现
  let translator = (parents, childrens) => {
    //遍历父节点数据
    parents.forEach((parent) => {
      //遍历子节点数据
      childrens.forEach((current, index) => {
        //此时找到父节点对应的一个子节点
        if (current.pid === parent.id) {
          //对子节点数据进行深复制，这里只支持部分类型的数据深复制，对深复制不了解的童靴可以先去了解下深复制
          let temp = JSON.parse(JSON.stringify(childrens));
          //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
          temp.splice(index, 1);
          //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
          translator([current], temp);
          //把找到子节点放入父节点的childrens属性中
          typeof parent.children !== "undefined"
            ? parent.children.push(current)
            : (parent.children = [current]);
        }
      });
    });
  };
  //调用转换方法
  translator(parents, childrens);
  //返回最终的结果
  return parents;
}

// 根据id查找节点
export function findNodeById(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const foundNode = findNodeById(node.children, id);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null;
}

//data：要遍历的数据， target：查找目标， result用于装查找结果的数组
export function findParent(data, target, result) {
  for (let item of data) {
    if (item.id === target.id) {
      //将查找到的目标数据加入结果数组中
      //可根据需求unshift(item.id)或unshift(item)
      result.unshift(item);
      return result;
    }
    if (item.children && item.children.length > 0) {
      //根据查找到的结果往上找父级节点
      let isFind = findParent(item.children, target, result);
      if (isFind) {
        result.unshift(item);
        return result;
      }
    }
  }
  //走到这说明没找到目标
  return [];
}
//根据id删除节点
export function deleteNode(nodes, id) {
  for (let i = 0; i < nodes.length;i++) {
    if (nodes[i].id === id) {
      nodes.splice(i, 1); //会修改原数组
      break;
    }
    if (nodes[i].children) {
      deleteNode(nodes[i].children, id);
    }
  }
}

//树节点转数组
export function treeToArray(nodes, array) {
  for (const node of nodes) {
    array.push(node);
    if (node.children) {
      treeToArray(node.children, array);
    }
  }
  return array;
}
