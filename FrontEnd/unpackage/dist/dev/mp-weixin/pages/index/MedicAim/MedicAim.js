"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "MedicAim",
  data() {
    return {
      sentence: "",
      // Fetched sentence from backend
      sentenceLines: [],
      // Sentence split into lines
      isRecording: false,
      // Recording state
      mediaRecorder: null,
      // MediaRecorder instance
      audioChunks: [],
      // Audio data chunks
      frequencyBars: Array(10).fill(10),
      // Frequency visualization bars
      asrResponseLines: [],
      // ASR response split into lines
      finalScore: null,
      // Final score from backend
      audioContext: null,
      // Web Audio API context
      analyzer: null,
      // Audio analyzer node
      inputMessage: "",
      audioUrl: "",
      ffmpeg: null,
      // FFmpeg instance
      feedback: null
    };
  },
  async created() {
    await this.fetchSentence();
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
        common_vendor.index.__f__("log", "at pages/index/MedicAim/MedicAim.vue:79", "Fetch Sentence Response:", res);
        if (res.statusCode === 200) {
          this.sentence = res.data.message;
          this.sentenceLines = this.sentence.split("\n");
          this.asrResponseLines = this.sentenceLines.map(() => "");
        } else {
          common_vendor.index.__f__("error", "at pages/index/MedicAim/MedicAim.vue:85", "Failed to fetch sentence:", res.statusCode, res.data);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/MedicAim/MedicAim.vue:88", "Error fetching sentence:", error);
        common_vendor.index.__f__("error", "at pages/index/MedicAim/MedicAim.vue:89", "Full error object:", JSON.stringify(error, null, 2));
      }
    },
    // Start or stop recording
    async toggleRecording() {
      if (this.isRecording) {
        this.isRecording = false;
        this.stopRecording();
      } else {
        this.isRecording = true;
        await this.startRecording();
      }
    },
    async startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 16e3
          // Set sample rate to 16KHz
        });
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyzer = this.audioContext.createAnalyser();
        source.connect(this.analyzer);
        this.analyzer.fftSize = 256;
        const bufferLength = this.analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const updateBars = () => {
          if (!this.isRecording)
            return;
          this.analyzer.getByteFrequencyData(dataArray);
          this.frequencyBars = Array.from(dataArray.slice(0, 10));
          requestAnimationFrame(updateBars);
        };
        updateBars();
        const audioDestination = this.audioContext.createMediaStreamDestination();
        source.connect(audioDestination);
        this.mediaRecorder = new MediaRecorder(audioDestination.stream);
        this.audioChunks = [];
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
        this.mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
          this.audioUrl = URL.createObjectURL(audioBlob);
          this.saveAudioFile(audioBlob);
          this.sendAudioToASR(audioBlob);
          this.calculateFinalScore(audioBlob);
        };
        this.mediaRecorder.start();
        this.isRecording = true;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/MedicAim/MedicAim.vue:156", "Error starting recording:", error);
      }
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.isRecording = false;
      }
    },
    saveAudioFile(audioBlob) {
      const file = new File([audioBlob], "recording.wav", { type: "audio/wav" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "recording.wav";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async sendAudioToASR(audioBlob) {
      try {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBytes = new Uint8Array(arrayBuffer);
        const formData = new FormData();
        formData.append("files", new Blob([audioBytes], { type: "audio/wav" }), "recording.wav");
        formData.append("keys", "key1,key2");
        formData.append("lang", "auto");
        const response = await fetch("http://localhost:3090/api/v1/asr", {
          method: "POST",
          body: formData
        });
        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`);
        }
        const jsonResponse = await response.json();
        common_vendor.index.__f__("log", "at pages/index/MedicAim/MedicAim.vue:202", "Upload success:", jsonResponse);
        if (jsonResponse.result && jsonResponse.result.length > 0) {
          this.updateASRResponse(jsonResponse.result[0].text);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/MedicAim/MedicAim.vue:209", "Error uploading audio:", error);
      }
    },
    updateASRResponse(response) {
      const responseLines = response.split("\n");
      this.sentenceLines.forEach((_, index) => {
        if (responseLines[index]) {
          this.$set(this.asrResponseLines, index, responseLines[index]);
        }
      });
    },
    // Update frequency bars dynamically
    updateFrequencyBars() {
      if (!this.isRecording)
        return;
      const bufferLength = this.analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyzer.getByteFrequencyData(dataArray);
      this.frequencyBars = Array.from(dataArray).map((value) => value / 2);
      requestAnimationFrame(this.updateFrequencyBars);
    },
    // Send audio chunk to ASR backend using uni.uploadFile
    async sendAudioToASR(audioBlob) {
      try {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBytes = new Uint8Array(arrayBuffer);
        const formData = new FormData();
        formData.append("files", new Blob([audioBytes], { type: "audio/wav" }), "recording.wav");
        formData.append("keys", "key1,key2");
        formData.append("lang", "auto");
        const response = await fetch("http://localhost:3090/api/v1/asr", {
          method: "POST",
          body: formData
          // Do not manually set Content-Type; let the browser handle it
        });
        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`);
        }
        const jsonResponse = await response.json();
        common_vendor.index.__f__("log", "at pages/index/MedicAim/MedicAim.vue:267", "Upload success:", jsonResponse);
        if (jsonResponse.result && jsonResponse.result.length > 0) {
          this.updateASRResponse(jsonResponse.result[0].text);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/MedicAim/MedicAim.vue:275", "Error uploading audio:", error);
      }
    },
    fileToTempPath(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          const blob = new Blob([arrayBuffer], { type: file.type });
          const url = URL.createObjectURL(blob);
          resolve(url);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    // Update ASR response lines
    updateASRResponse(response) {
      const responseLines = response.split("\n");
      this.sentenceLines.forEach((_, index) => {
        if (responseLines[index]) {
          this.$set(this.asrResponseLines, index, responseLines[index]);
        }
      });
    },
    // Calculate final score based on ASR responses
    async calculateFinalScore(audioBlob) {
      try {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBytes = new Uint8Array(arrayBuffer);
        const formData = new FormData();
        formData.append("files", new Blob([audioBytes], { type: "audio/wav" }), "recording.wav");
        formData.append("keys", "key1,key2");
        formData.append("lang", "auto");
        formData.append("poem", this.sentence);
        const response = await fetch("http://localhost:3090/api/v1/reading_score", {
          method: "POST",
          body: formData
          // Do not manually set Content-Type; let the browser handle it
        });
        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`);
        }
        const jsonResponse = await response.json();
        common_vendor.index.__f__("log", "at pages/index/MedicAim/MedicAim.vue:333", "Upload success:", jsonResponse);
        this.finalScore = jsonResponse.score;
        this.feedback = jsonResponse.feedback;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/MedicAim/MedicAim.vue:337", "Error uploading audio:", error);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.sentenceLines, (line, index, i0) => {
      return {
        a: common_vendor.t(line),
        b: common_vendor.t($data.asrResponseLines[index] || "..."),
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
    f: $data.finalScore !== null
  }, $data.finalScore !== null ? {
    g: common_vendor.t($data.finalScore)
  } : {}, {
    h: $data.feedback !== null
  }, $data.feedback !== null ? {
    i: common_vendor.t($data.feedback)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ac61a61f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/index/MedicAim/MedicAim.js.map
