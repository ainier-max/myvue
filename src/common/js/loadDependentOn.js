export const loadDependentOn = {
  //导入依赖
  importModule(dependentOnObj) {
    for (let key in dependentOnObj) {
      if (key == "FFCesium") {
        import("@/thirdPlugIn/FFCesium/FFCesium.confuse.min.js").then(
          (module) => {
            dependentOnObj[key] = module.default;
          }
        );
      } else if (key == "echarts") {
        import("echarts").then((module) => {
          dependentOnObj[key] = module;
        });
      }
    }
  },
  //是否加成完成
  isLoadEnd(dependentOnObj) {
    let isLoadEndFlag = true;
    for (let key in dependentOnObj) {
      if (!dependentOnObj[key]) {
        isLoadEndFlag = false;
        return isLoadEndFlag;
      }
    }
    return isLoadEndFlag;
  },
};
