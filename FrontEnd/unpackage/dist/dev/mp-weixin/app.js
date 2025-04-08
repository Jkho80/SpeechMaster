"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
require("./uni_modules/Recorder-UniCore/app-uni-support.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/index/MedicAim/MedicAim.js";
  "./pages/index/PracticeAim/PracticeAim.js";
  "./pages/index/trial/trial.js";
}
const _sfc_main = {
  name: "App",
  onLaunch: function() {
    common_vendor.index.__f__("warn", "at App.vue:38", "当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！");
    common_vendor.index.__f__("log", "at App.vue:39", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:42", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:45", "App Hide");
  }
};
if (!Array) {
  const _component_router_view = common_vendor.resolveComponent("router-view");
  _component_router_view();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
