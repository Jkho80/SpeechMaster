"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "Index",
  data() {
    return {
      href: "https://uniapp.dcloud.io/component/README?id=uniui"
    };
  },
  methods: {
    navigateToMedicAim() {
      common_vendor.index.navigateTo({
        url: "/pages/index/MedicAim/MedicAim"
      });
    },
    navigateToPracticeAim() {
      common_vendor.index.navigateTo({
        url: "/pages/index/PracticeAim/PracticeAim"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.navigateToMedicAim && $options.navigateToMedicAim(...args)),
    b: common_vendor.o((...args) => $options.navigateToPracticeAim && $options.navigateToPracticeAim(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
