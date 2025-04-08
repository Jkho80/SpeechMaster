<template>
  <div class="practice-aim">
	<div class="top-bar">
	  <img src="/static/home.png" class="home-icon" @click="navigateToHome" />
	  <a class="nav-link" href="" target="_blank">DonateLink</a>
	  <button class="nav-button" @click="scrollToAbout">About</button>
	</div>
	
    <!-- Display the fetched sentence and ASR response -->
    <div class="sentence-response">
      <div v-for="(line, index) in sentenceLines" :key="index" class="line">
        <p class="sentence-line">{{ line }}</p>
        <p class="asr-response-line">{{ asrResponseLines[index] || '...' }}</p>
      </div>
    </div>

    <!-- Recording button with frequency visualization -->
    <div class="recording-section">
      <div class="frequency-bars">
        <div
          v-for="(bar, index) in frequencyBars"
          :key="index"
          :style="{ height: bar + 'px' }"
          class="bar"
        ></div>
      </div>
      <button
        :class="['record-button', { recording: isRecording }]"
        @click="toggleRecording"
      >
        {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
      </button>
    </div>


    <!-- Display final score -->
    <div v-if="finalScore !== null" class="score">
      <h2>Your Score: {{ finalScore }}%</h2>
    </div>
	<div v-if="feedback !== null" class="feedback">
	  <h2>Feedback: {{ feedback }}</h2>
	</div>
  </div>
</template>

<script>
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg/dist/ffmpeg.min.js"
import { ref } from 'vue';
// import RecordApp from 'recorder-core/src/app-support/app'
export default {
  name: 'MedicAim',
  data() {
    return {
      sentence: '', // Fetched sentence from backend
      sentenceLines: [], // Sentence split into lines
      isRecording: false, // Recording state
      mediaRecorder: null, // MediaRecorder instance
      audioChunks: [], // Audio data chunks
      frequencyBars: Array(10).fill(10), // Frequency visualization bars
      asrResponseLines: [], // ASR response split into lines
      finalScore: null, // Final score from backend
      audioContext: null, // Web Audio API context
      analyzer: null, // Audio analyzer node
	  inputMessage: '',
	  audioUrl: "",
	  ffmpeg: null, // FFmpeg instance
	  feedback: null,
    };
  },
	async created() {
	  // Fetch the sentence when the component is created or refreshed
	  await this.fetchSentence();
	},
  methods: {
    // Fetch sentence from backend using uni.request
    async fetchSentence() {
      try {
        const res = await uni.request({
          url: 'http://localhost:7010/sentence', // Replace with your backend URL
          method: 'GET',
          header: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Fetch Sentence Response:', res); // Debugging log
        if (res.statusCode === 200) {
          this.sentence = res.data.message;
          this.sentenceLines = this.sentence.split('\n');
          this.asrResponseLines = this.sentenceLines.map(() => '');
        } else {
          console.error('Failed to fetch sentence:', res.statusCode, res.data);
        }
      } catch (error) {
        console.error('Error fetching sentence:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2)); // Log full error object
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
	
	    // Create an audio context with a sample rate of 16KHz
	    this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
	      sampleRate: 16000, // Set sample rate to 16KHz
	    });
	
	    const source = this.audioContext.createMediaStreamSource(stream);
	    this.analyzer = this.audioContext.createAnalyser();
	    source.connect(this.analyzer);
	
	    // Set up frequency data array
	    this.analyzer.fftSize = 256;
	    const bufferLength = this.analyzer.frequencyBinCount;
	    const dataArray = new Uint8Array(bufferLength);
	
	    // Update visualization continuously
	    const updateBars = () => {
	      if (!this.isRecording) return;
	      this.analyzer.getByteFrequencyData(dataArray);
	      this.frequencyBars = Array.from(dataArray.slice(0, 10)); // Use first 10 values
	      requestAnimationFrame(updateBars);
	    };
	
	    updateBars(); // Start the visualization loop
	
	    // Create a MediaRecorder with the resampled audio
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
		  
	      // Optionally, save file locally
	      this.saveAudioFile(audioBlob);
	      this.sendAudioToASR(audioBlob);
		  this.calculateFinalScore(audioBlob);
	    };
	
	    this.mediaRecorder.start();
	    this.isRecording = true;
	  } catch (error) {
	    console.error("Error starting recording:", error);
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

		// Create a download link
		const link = document.createElement("a");
		link.href = URL.createObjectURL(file);
		link.download = "recording.wav";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
    },
	
	async sendAudioToASR(audioBlob) {
	  try {
	    // Convert the Blob to an ArrayBuffer
	    const arrayBuffer = await audioBlob.arrayBuffer();
	
	    // Convert the ArrayBuffer to a Uint8Array (bytes)
	    const audioBytes = new Uint8Array(arrayBuffer);
	
	    // Create FormData and append the audio bytes
	    const formData = new FormData();
	    formData.append("files", new Blob([audioBytes], { type: "audio/wav" }), "recording.wav");
	    formData.append("keys", "key1,key2"); // Append the keys
	    formData.append("lang", "auto"); // Append the language
	
	    // Send the request using fetch
	    const response = await fetch("http://localhost:3090/api/v1/asr", {
	      method: "POST",
	      body: formData,
	    });
	
	    if (!response.ok) {
	      throw new Error(`Upload failed with status ${response.status}`);
	    }
	
	    const jsonResponse = await response.json();
	    console.log("Upload success:", jsonResponse);
	
	    // Process ASR response
	    if (jsonResponse.result && jsonResponse.result.length > 0) {
	      this.updateASRResponse(jsonResponse.result[0].text);
	    }
	  } catch (error) {
	    console.error("Error uploading audio:", error);
	  }
	},


	updateASRResponse(response) {
      const responseLines = response.split('\n');
      this.sentenceLines.forEach((_, index) => {
        if (responseLines[index]) {
          this.$set(this.asrResponseLines, index, responseLines[index]);
        }
      });
    },

    // Update frequency bars dynamically
    updateFrequencyBars() {
      if (!this.isRecording) return;

      const bufferLength = this.analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Get frequency data
      this.analyzer.getByteFrequencyData(dataArray);

      // Normalize the data for visualization
      this.frequencyBars = Array.from(dataArray).map((value) => value / 2);

      // Request the next animation frame
      requestAnimationFrame(this.updateFrequencyBars);
    },

    // Send audio chunk to ASR backend using uni.uploadFile
	async sendAudioToASR(audioBlob) {
	  try {
	    // Convert the Blob to an ArrayBuffer
	    const arrayBuffer = await audioBlob.arrayBuffer();
	
	    // Convert the ArrayBuffer to a Uint8Array (bytes)
	    const audioBytes = new Uint8Array(arrayBuffer);
	
	    // Create FormData and append the audio bytes
	    const formData = new FormData();
	    formData.append("files", new Blob([audioBytes], { type: "audio/wav" }), "recording.wav");
	    formData.append("keys", "key1,key2"); // Append the keys as a comma-separated string
	    formData.append("lang", "auto"); // Append the language
	
	    // Send the request using fetch
	    const response = await fetch("http://localhost:3090/api/v1/asr", {
	      method: "POST",
	      body: formData,
	      // Do not manually set Content-Type; let the browser handle it
	    });
	
	    if (!response.ok) {
	      throw new Error(`Upload failed with status ${response.status}`);
	    }
	
	    const jsonResponse = await response.json();
	    console.log("Upload success:", jsonResponse);
		// this.inputMessage = jsonResponse.result[0].text;
	
	    // Process ASR response
	    if (jsonResponse.result && jsonResponse.result.length > 0) {
	      this.updateASRResponse(jsonResponse.result[0].text);
	    }
	  } catch (error) {
	    console.error("Error uploading audio:", error);
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
      const responseLines = response.split('\n');
      this.sentenceLines.forEach((_, index) => {
        if (responseLines[index]) {
          this.$set(this.asrResponseLines, index, responseLines[index]);
        }
      });
    },

    // Calculate final score based on ASR responses
    async calculateFinalScore(audioBlob) {
	  try {
	    // Convert the Blob to an ArrayBuffer
	    const arrayBuffer = await audioBlob.arrayBuffer();
	  	
	    // Convert the ArrayBuffer to a Uint8Array (bytes)
	    const audioBytes = new Uint8Array(arrayBuffer);
	  	
	    // Create FormData and append the audio bytes
	    const formData = new FormData();
	    formData.append("files", new Blob([audioBytes], { type: "audio/wav" }), "recording.wav");
	    formData.append("keys", "key1,key2"); // Append the keys as a comma-separated string
	    formData.append("lang", "auto"); // Append the language
		formData.append("poem",this.sentence);
	  	
	    // Send the request using fetch
	    const response = await fetch("http://localhost:3090/api/v1/reading_score", {
	      method: "POST",
	      body: formData,
	      // Do not manually set Content-Type; let the browser handle it
	    });
	  	
	    if (!response.ok) {
	      throw new Error(`Upload failed with status ${response.status}`);
	    }
	  	
	    const jsonResponse = await response.json();
	    console.log("Upload success:", jsonResponse);
	  	this.finalScore = jsonResponse.score;
		this.feedback = jsonResponse.feedback;
	  } catch (error) {
	    console.error("Error uploading audio:", error);
	  }
	  
	  
      // let correctLines = 0;
      // this.sentenceLines.forEach((line, index) => {
      //   if (line.toLowerCase() === this.asrResponseLines[index].toLowerCase()) {
      //     correctLines++;
      //   }
      // });

      // this.finalScore = ((correctLines / this.sentenceLines.length) * 100).toFixed(2); // Final score as percentage
    },
  },
};
</script>

<style scoped>
	@import url('style.css');
</style>