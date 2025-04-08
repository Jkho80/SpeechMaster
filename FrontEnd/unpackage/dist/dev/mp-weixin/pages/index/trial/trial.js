"use strict";
const common_vendor = require("../../../common/vendor.js");
require("../../../uni_modules/Recorder-UniCore/app-uni-support.js");
const _sfc_main = {
  data() {
    return {
      sentence: "",
      // Fetched sentence from backend
      sentenceLines: [],
      // Sentence split into lines
      frequencyBars: Array(10).fill(10),
      // Frequency visualization bars
      isRecording: false
    };
  },
  async created() {
    await this.fetchSentence();
  },
  mounted() {
    this.isMounted = true;
    common_vendor.RecordApp.UniPageOnShow(this);
  },
  onShow() {
    if (this.isMounted)
      common_vendor.RecordApp.UniPageOnShow(this);
  },
  methods: {
    // Fetch sentence from backend using uni.request
    async fetchSentence() {
      try {
        const res = await common_vendor.index.request({
          url: "http://localhost:7010/sentence",
          // Replace with your backend URL
          method: "GET",
          header: {
            "Content-Type": "application/json"
          }
        });
        common_vendor.index.__f__("log", "at pages/index/trial/trial.vue:87", "Fetch Sentence Response:", res);
        if (res.statusCode === 200) {
          this.sentence = res.data.message;
          this.sentenceLines = this.sentence.split("\n");
          this.asrResponseLines = this.sentenceLines.map(() => "");
        } else {
          common_vendor.index.__f__("error", "at pages/index/trial/trial.vue:93", "Failed to fetch sentence:", res.statusCode, res.data);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/trial/trial.vue:96", "Error fetching sentence:", error);
        common_vendor.index.__f__("error", "at pages/index/trial/trial.vue:97", "Full error object:", JSON.stringify(error, null, 2));
      }
    },
    async toggleRecording() {
      if (this.isRecording) {
        this.isRecording = false;
        await this.recStop();
      } else {
        await this.recReq();
        this.isRecording = true;
        await this.recStart();
      }
    },
    recReq() {
      common_vendor.RecordApp.UniWebViewActivate(this);
      common_vendor.RecordApp.RequestPermision(() => {
        common_vendor.index.__f__("log", "at pages/index/trial/trial.vue:115", "疑惑的录音权限");
      }, (msg, isUserNotAllow) => {
        common_vendor.index.__f__("error", "at pages/index/trial/trial.vue:120", "请求录音权限失败: " + msg);
      });
    },
    recStart() {
      var set = {
        type: "mp3",
        sampleRate: 16e3,
        bitRate: 16,
        onProcess: (buffers, powerLevel, duration, sampleRate, newBufferIdx, asyncEnd) => {
          if (this.waveView)
            this.waveView.input(buffers[buffers.length - 1], powerLevel, sampleRate);
        },
        onProcess_renderjs: `function(buffers,powerLevel,duration,sampleRate,newBufferIdx,asyncEnd){
						//App中在这里修改buffers会改变生成的音频文件，但注意：buffers会先转发到逻辑层onProcess后才会调用本方法，因此在逻辑层的onProcess中需要重新修改一遍
						//本方法可以返回true，renderjs中的onProcess将开启异步模式，处理完后调用asyncEnd结束异步，注意：这里异步修改的buffers一样的不会在逻辑层的onProcess中生效
						//App中是在renderjs中进行的可视化图形绘制，因此需要写在这里，this是renderjs模块的this（也可以用This变量）；如果代码比较复杂，请直接在renderjs的methods里面放个方法xxxFunc，这里直接使用this.xxxFunc(args)进行调用
						if(this.waveView) this.waveView.input(buffers[buffers.length-1],powerLevel,sampleRate);
		
						/*和onProcess中一样进行释放清理内存，用于支持长时间录音
						if(this.clearBufferIdx>newBufferIdx){ this.clearBufferIdx=0 } //重新录音了就重置
						for(var i=this.clearBufferIdx||0;i<newBufferIdx;i++) buffers[i]=null;
						this.clearBufferIdx=newBufferIdx; */
					}`,
        onProcessBefore_renderjs: `function(buffers,powerLevel,duration,sampleRate,newBufferIdx){
						//App中本方法会在逻辑层onProcess之前调用，因此修改的buffers会转发给逻辑层onProcess，本方法没有asyncEnd参数不支持异步处理
						//一般无需提供本方法只用onProcess_renderjs就行，renderjs的onProcess内部调用过程：onProcessBefore_renderjs -> 转发给逻辑层onProcess -> onProcess_renderjs
					}`,
        takeoffEncodeChunk: null,
        takeoffEncodeChunk_renderjs: null,
        start_renderjs: `function(){
						//App中可以放一个函数，在Start成功时renderjs中会先调用这里的代码，this是renderjs模块的this（也可以用This变量）
						//放一些仅在renderjs中才生效的事情，比如初始化，不提供也行
					}`,
        stop_renderjs: `function(arrayBuffer,duration,mime){
						//App中可以放一个函数，在Stop成功时renderjs中会先调用这里的代码，this是renderjs模块的this（也可以用This变量）
						//放一些仅在renderjs中才生效的事情，不提供也行
					}`
      };
      common_vendor.RecordApp.UniWebViewActivate(this);
      common_vendor.RecordApp.Start(set, () => {
        common_vendor.index.__f__("log", "at pages/index/trial/trial.vue:169", "已开始录音");
        common_vendor.RecordApp.UniFindCanvas(this, [".recwave-WaveView"], `
						this.waveView=Recorder.WaveView({compatibleCanvas:canvas1, width:300, height:100});
					`, (canvas1) => {
          this.waveView = common_vendor.Recorder.WaveView({ compatibleCanvas: canvas1, width: 300, height: 100 });
        });
      }, (msg) => {
        common_vendor.index.__f__("error", "at pages/index/trial/trial.vue:182", "开始录音失败：" + msg);
      });
    },
    recPause() {
      if (common_vendor.RecordApp.GetCurrentRecOrNull()) {
        common_vendor.RecordApp.Pause();
        common_vendor.index.__f__("log", "at pages/index/trial/trial.vue:189", "已暂停");
      }
    },
    recResume() {
      if (common_vendor.RecordApp.GetCurrentRecOrNull()) {
        common_vendor.RecordApp.Resume();
        common_vendor.index.__f__("log", "at pages/index/trial/trial.vue:196", "继续录音中...");
      }
    },
    recStop() {
      common_vendor.RecordApp.Stop((arrayBuffer, duration, mime) => {
        common_vendor.RecordApp.UniSaveLocalFile("recorder.mp3", arrayBuffer, (savePath) => {
          common_vendor.index.__f__("log", "at pages/index/trial/trial.vue:220", savePath);
        }, (errMsg) => {
          common_vendor.index.__f__("error", "at pages/index/trial/trial.vue:222", errMsg);
        });
      }, (msg) => {
        common_vendor.index.__f__("error", "at pages/index/trial/trial.vue:225", "结束录音失败：" + msg);
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.sentenceLines, (line, index, i0) => {
      return {
        a: common_vendor.t(line),
        b: common_vendor.t(_ctx.asrResponseLines[index] || "..."),
        c: index
      };
    }),
    b: common_vendor.f($data.frequencyBars, (bar, index, i0) => {
      return {
        a: index,
        b: bar + "px"
      };
    }),
    c: common_vendor.t($data.isRecording ? "Stop Recording" : "Start Recording"),
    d: common_vendor.n({
      recording: $data.isRecording
    }),
    e: common_vendor.o((...args) => $options.toggleRecording && $options.toggleRecording(...args)),
    f: _ctx.finalScore !== null
  }, _ctx.finalScore !== null ? {
    g: common_vendor.t(_ctx.finalScore)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/index/trial/trial.js.map
