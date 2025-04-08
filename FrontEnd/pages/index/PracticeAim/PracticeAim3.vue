<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans flex flex-col">
    <!-- Fixed Header -->
    <header class="fixed top-0 left-0 right-0 shadow-sm z-50 h-16 bg-white">
      <div class="mx-auto px-4 h-full">
        <div class="flex items-center justify-between h-full">
          <!-- Logo/Home Button -->
          <button 
            @click="navigateToHome"
            class="flex items-center focus:outline-none"
          >
            <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center transition-colors hover:bg-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span class="ml-3 text-xl font-bold text-indigo-900 hidden sm:block">SpeechMaster</span>
          </button>

          <!-- Navigation -->
          <nav class="flex items-center space-x-2 sm:space-x-4">
            <button 
              @click="scrollToAbout"
              class="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            >
              About
            </button>
            <a 
              href="#" 
              target="_blank"
              class="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm sm:text-base rounded-full shadow hover:shadow-md transition-all flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd" />
              </svg>
              <span class="hidden sm:inline">Support Us</span>
              <span class="sm:hidden">Donate</span>
            </a>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 pt-16 pb-12">
      <!-- Practice Section -->
      <section class="max-w-3xl mx-auto h-[calc(100vh-10rem)] overflow-hidden">
        <!-- Sentence Lines Container (scrollable) -->
<!-- 		<div 
		  class="h-full overflow-y-hidden space-y-6"
		  ref="sentenceContainer"
		  :class="{ 'scrolling-active': isScrolling }"
		  @scroll.passive="handleScroll"
		> -->
<!-- 		  <div 
			  class="h-full space-y-6"
			  ref="sentenceContainer"
			  :class="{ 
				'overflow-y-hidden': !isReviewMode,
				'overflow-y-auto': isReviewMode,
				'scrolling-active': isScrolling 
			  }"
			  @scroll.passive="handleScroll"
	  	  > -->
		  <div 
		    class="h-full space-y-6 pr-4"
		    ref="sentenceContainer"
		    :style="{ 'overflow-y': isReviewMode ? 'auto' : 'hidden', 
			 'scrolling-active': isScrolling ,
			 'padding-left': '1rem'
			 }"
			@scroll.passive="handleScroll"
		  >
		  
			<div 
			  v-for="(line, index) in sentenceLines" 
			  :key="index" 
			  class="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg"
			  :class="{ 
				'opacity-50': !isReviewMode && currentRecordingIndex !== null && currentRecordingIndex !== index,
				'border-2 border-indigo-300': isReviewMode
			  }"
			>
			  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<p class="text-lg sm:text-xl font-medium text-gray-800 flex-grow">
				  {{ line }}
				</p>
				
				
				<div class="flex items-center gap-3">
                <!-- Play Button -->
<!-- 				  <button 
					@click="playAudio(index)"
					class="w-12 h-12 flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 rounded-full transition-colors disabled:opacity-50"
					:class="{ 'bg-indigo-200': audioPlayIndex === index }"
					:disabled="isRecording"
				  >
				  </button> -->
				  
				  <button 
				    @click="playAudio(index)"
				    class="w-12 h-12 flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 rounded-full transition-colors disabled:opacity-50"
				    :class="{ 
				      'bg-indigo-200': audioPlayIndex === index,
				      'pointer-events-none': isPlaying && audioPlayIndex === index
				    }"
				    :disabled="isRecording"
				  >
				    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
				      <path v-if="audioPlayIndex !== index || !isPlaying" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
				      <path v-else fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
				    </svg>
				  </button>
					
				  <!-- Play/Record Button -->
					<button 
					  v-if="isReviewMode"
					  @click="playRecording(index)"
					  class="w-12 h-12 flex items-center justify-center rounded-full transition-colors"
					  :class="{
						'bg-green-100 hover:bg-green-200': currentlyPlayingIndex !== index,
						'bg-green-300': currentlyPlayingIndex === index
					  }"
					>
					  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
						<path v-if="currentlyPlayingIndex !== index" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
						<path v-else fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
					  </svg>
					</button>
				  
				  <button
					v-else
					@click="toggleRecording(index)"
					class="w-12 h-12 flex items-center justify-center rounded-full transition-colors relative overflow-hidden"
					:class="{
					  'bg-red-100 hover:bg-red-200': !(isRecording && activeRecordingIndex === index),
					  'bg-red-400 recording-pulse': isRecording && activeRecordingIndex === index,
					  'opacity-50 cursor-not-allowed': currentRecordingIndex !== index || !canRecord
					}"
					:disabled="currentRecordingIndex !== index || !canRecord"
				  >
					<!-- Record button SVG -->
				  </button>
				</div>
			  </div>
			  
			  <!-- Response Line -->
			  <div class="mt-4 pt-4 border-t border-gray-100">
				<p class="text-gray-600 italic mb-2">
				  {{ asrResponseLines[index] || 'Your pronunciation will appear here...' }}
				</p>
				
				<!-- Review Dropdown -->
				<div v-if="isReviewMode" class="mt-2">
				  <button 
					@click="toggleReviewDropdown(index)"
					class="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
				  >
					Review {{ showReviewDropdowns[index] ? '▲' : '▼' }}
				  </button>
				  
				  <div v-if="showReviewDropdowns[index]" class="mt-2 p-3 bg-gray-50 rounded-lg">
					<div class="grid grid-cols-2 gap-2 text-sm">
<!-- 					  <div>Accuracy: <span class="font-medium">{{ reviewScores[index]?.text_score || 0 }}%</span></div>
					  <div>Fluency: <span class="font-medium">{{ reviewScores[index]?.fluency_score || 0 }}%</span></div>
					  <div>Pacing: <span class="font-medium">{{ reviewScores[index]?.tempo_score || 0 }}%</span></div>
					  <div>Pitch: <span class="font-medium">{{ reviewScores[index]?.pitch_score || 0 }}%</span></div> -->
					  
					  <div>Text Score: <span class="font-medium">{{ textScores[index] }}%</span></div>
					  <div>Duration Score: <span class="font-medium">{{ durationScores[index] }}%</span></div>
					  <div>Pause Score: <span class="font-medium">{{ pauseScores[index] }}%</span></div>
					  <div>Tempo Score: <span class="font-medium">{{ tempoScores[index] }}%</span></div>
					  <div>Pitch Score: <span class="font-medium">{{ pitchScores[index] }}%</span></div>
					</div>
					<p v-if="reviewScores[index]?.feedback" class="mt-2 text-xs text-gray-600">
					  {{ reviewScores[index].feedback }}
					</p>
				  </div>
				</div>
			  </div>
			</div>
        </div>
        
		<!-- Results Popup -->
		<div v-if="popupVisible" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
		  <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
		    <!-- Close Button -->
		    <button @click="popupVisible = false" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
		      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
		      </svg>
		    </button>
		
		    <h2 class="text-2xl font-bold text-center mb-4 text-indigo-800">
		      Practice Results: <span class="text-indigo-600">{{ finalScore }}%</span>
		    </h2>
		    
		    <div class="flex flex-col space-y-4 mt-6">
		      <button 
		        @click="enterReviewMode"
		        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
		      >
		        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
		          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
		          <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
		        </svg>
		        Review Details
		      </button>
		      
		      <button 
		        @click="navigateToHome" 
		        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
		      >
		        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
		          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
		        </svg>
		        Try Other Modes
		      </button>
		    </div>
		  </div>
		</div>
		
        <!-- Final Score and Feedback -->
        <div 
          v-if="finalScore !== null" 
          class="mt-8 bg-white rounded-xl shadow-md p-6"
        >
          <h2 class="text-2xl font-bold text-center mb-4 text-gray-800">
            Your Score: <span class="text-indigo-600">{{ finalScore }}%</span>
          </h2>
          
          <div 
            v-if="feedback !== null" 
            class="mt-4 p-4 bg-indigo-50 rounded-lg"
          >
            <h3 class="font-semibold text-indigo-800 mb-2">Feedback:</h3>
            <p class="text-gray-700">{{ feedback }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>

export default {
  name: 'PracticeAim',
  data() {
    return {
      sentence: '', // Fetched sentence from backend
      sentenceLines: [], // Sentence split into lines
	  startEndTimeList: [],
      isRecording: false, // Recording state
      activeRecordingIndex: null, // Index of the currently recording line
      mediaRecorder: null, // MediaRecorder instance
      audioContext: null, // Audio data chunks
	  audioPlayIndex: -1,
      frequencyBars: Array(5).fill(5), // Frequency visualization bars (smaller for button)
      asrResponseLines: [], // ASR response split into lines
      finalScore: null, // Final score from backend
      audioRecord: null, // Web Audio API context
	  audioSrc: null,
      analyzer: null, // Audio analyzer node
      feedback: null, // Feedback from backend
      allRecordings: [], // Store all recorded audio blobs
	  fileName: null,
	  gameMode: 'split',
	  timeMode: 'long',
	  textScore: 0,
	  durationScore: 0,
	  pauseScore: 0,
	  tempoScore: 0,
	  pitchScore: 0,
	  // currentRecordingIndex: null, // Track which line should be recorded next
	  sentenceContainer: null, // Reference to scroll container
	  currentRecordingIndex: 0, // Start with first line enabled
	  canRecord: true, // Controls whether recording is allowed
	  recordingTimeout: null,
	  isScrolling: false, 
	  isReviewMode: false,
	  showReviewDropdowns: {}, // Track which review dropdowns are open
	  reviewScores: {}, // Store review data for each line
	  popupVisible: false,
	  currentlyPlayingIndex: null,
	  audioElements: {} ,// Store audio elements for each recording
	  audioContext: null,
	  audioBuffer: null,
	  audioSource: null,
	  currentlyPlayingIndex: null,
	  audioStartTime: 0,
	  audioChunks: {},
	  isPlaying: false, // Track if audio is currently playing
	  playTimeout: null,
	  textScores: [],
	  durationScores: [],
	  pauseScores: [],
	  tempoScores: [],
	  pitchScores: []
    };
  },
  onLoad (options){
	console.log('OnLoad')
	this.gameMode = options.gameMode || 'split';
	this.timeMode = options.timeMode || 'long';
	console.log("Loaded from URL:", this.gameMode, this.timeMode);
  	this.getRandomPoem();
	this.disablePageScroll();
  },
  onUnload() {
	this.enablePageScroll();
	uni.$off('practiceSettings');
  },
  mounted() {
	this.sentenceContainer = this.$refs.sentenceContainer;
	// Disable page scrolling
	document.body.style.overflow = 'hidden';
  },
  beforeDestroy() {
      // Re-enable page scrolling when component is destroyed
      document.body.style.overflow = '';
  },
  methods: {
    // Navigate to home
    navigateToHome() {
	  this.enablePageScroll();
      uni.navigateTo({
        url: '/pages/index/index',
      });
    },
	
	disablePageScroll() {
	  document.body.style.overflow = 'hidden';
	  // For iOS devices
	  document.body.style.position = 'fixed';
	  document.body.style.width = '100%';
	},
	enablePageScroll() {
	  document.body.style.overflow = '';
	  document.body.style.position = '';
	  document.body.style.width = '';
	},
	
	showResultsPopup() {
		this.popupVisible = true;
		this.enablePageScroll(); // Allow scrolling when popup is visible
	},

	enterReviewMode() {
	  this.isReviewMode = true;
	  this.popupVisible = false;
	  
	  console.log(this.textScores, this.durationScores, this.pauseScores, this.tempoScores, this.pitchScores);
	  
	  // Reset any scroll locking
	  document.body.style.overflow = '';
	  document.body.style.position = '';
	  document.body.style.width = '';
	  
	  // Ensure the container allows scrolling
	  this.$nextTick(() => {
		if (this.$refs.sentenceContainer) {
		  this.$refs.sentenceContainer.style.overflowY = 'auto';
		  this.$refs.sentenceContainer.style.touchAction = 'pan-y';
		}
	  });
	  
	  // Process review scores for each line
	  this.sentenceLines.forEach((_, index) => {
		this.$set(this.showReviewDropdowns, index, false);
		this.$set(this.reviewScores, index, {
		  text_score: Math.floor(Math.random() * 30) + 70,
		  fluency_score: Math.floor(Math.random() * 30) + 70,
		  tempo_score: Math.floor(Math.random() * 30) + 70,
		  pitch_score: Math.floor(Math.random() * 30) + 70,
		  feedback: this.generateFeedback(index)
		});
	  });
	},
	
	exitReviewMode() {
	  this.isReviewMode = false;
	  this.$nextTick(() => {
	    if (this.$refs.sentenceContainer) {
	      this.$refs.sentenceContainer.style.overflowY = 'hidden';
	    }
	  });
	},

	toggleReviewDropdown(index) {
		this.$set(this.showReviewDropdowns, index, !this.showReviewDropdowns[index]);
		},

		generateFeedback(index) {
		const feedbacks = [
		  "Good pronunciation but could work on pacing.",
		  "Excellent clarity, try varying your pitch more.",
		  "Watch your consonant endings - they're getting dropped.",
		  "Nearly perfect! Just a slight accent detectable.",
		  "Good effort, but some words need clearer articulation."
		];
		/*feedback should be based on 5 params from server*/
		return feedbacks[index % feedbacks.length];
	},
	
	playRecording(index) {
	  // If clicking the currently playing item, stop it
	  if (this.currentlyPlayingIndex === index) {
	    if (this.audioElements[index]) {
	      this.audioElements[index].pause();
	      this.audioElements[index].currentTime = 0;
	    }
	    this.currentlyPlayingIndex = null;
	    return;
	  }
	
	  // Stop any currently playing audio
	  if (this.currentlyPlayingIndex !== null && this.audioElements[this.currentlyPlayingIndex]) {
	    this.audioElements[this.currentlyPlayingIndex].pause();
	  }
	
	  // Start new playback
	  if (this.allRecordings[index]) {
	    // Create new audio element if it doesn't exist
	    if (!this.audioElements[index]) {
	      const audioURL = URL.createObjectURL(this.allRecordings[index].blob);
	      this.audioElements[index] = new Audio(audioURL);
	      
	      // Clean up when playback ends
	      this.audioElements[index].onended = () => {
	        this.currentlyPlayingIndex = null;
	      };
	    }
	    
	    this.audioElements[index].play();
	    this.currentlyPlayingIndex = index;
	  } else {
	    uni.showToast({
	      title: 'No recording found for this line',
	      icon: 'none'
	    });
	  }
	},

	async getRandomPoem() {
	  try {
		  console.log("Try GetRandomPoem")
		// 发送POST请求获取随机诗歌和音频文件
		const response = await uni.request({
		  url: 'http://localhost:3090/api/v1/get_random_poem', // 你的API端点
		  method: 'POST',
		  data: {
			"game_mode": this.gameMode, // 根据实际情况修改
			"time_mode": this.timeMode// 根据实际情况修改
		  },
		  header: { 
			  'Content-Type': 'application/json'  // 指定 JSON 格式
			},
		});
		
		console.log('request')
		
		if (response && response.statusCode === 200) {
		  console.log('request success:', response);
		  const {txt_content, file_name} = response.data;
		  const text_content_lines = txt_content.trim().split('\n');
		  
		  this.sentenceLines = text_content_lines.filter((line, index) => index % 3 == 0) // 设置诗歌内容
		  this.startEndTimeList = text_content_lines.filter((line, index) => index % 3 == 1).map(line => line.split(', ')); 
		  this.fileName = file_name;
		  this.allRecordings = Array(this.sentenceLines.length).fill(null);
		  this.textScores = Array(this.sentenceLines.length).fill(null);
		  this.durationScores = Array(this.sentenceLines.length).fill(null);
		  this.tempoScores = Array(this.sentenceLines.length).fill(null);
		  this.pitchScores = Array(this.sentenceLines.length).fill(null);

	  	  console.log("Initialized allRecordings:", this.allRecordings);
		  console.log(file_name);
		  console.log("this.sentenceLines:", this.sentenceLines)
		  console.log("this.startEndTImeList:", this.startEndTimeList)
		  
		} else {
		  console.error('获取随机诗歌失败:', response);
		}
		
		
		const wavBytesResponse = await uni.request({
		  url: 'http://localhost:3090/api/v1/get_audio_bytes', // 你的API端点
		  method: 'POST',
		  data: {
			"time_mode": this.timeMode,
			"file_name": this.fileName
		  },
		  header: { 
			  'Content-Type': 'application/json'  // 指定 JSON 格式
			},
		  responseType: "arraybuffer",
		  success: (res) => {
			if (res.statusCode === 200) {
				const blob = new Blob([res.data], { type: 'audio/wav' });
	
				const audioUrl = URL.createObjectURL(blob);
	
				this.audioSrc = audioUrl;
				console.log("Audio Src :", this.audioSrc)
				
				this.audioContext = uni.createInnerAudioContext();
				this.audioContext.src = this.audioSrc;
				 
				// 监听音频事件
				this.audioContext.onPlay(() => {
					console.log('音频播放开始');
				});
 
				this.audioContext.onPause(() => {
					console.log('音频暂停');
				});
				
				// In your getRandomPoem method where you set up the audio context:
				this.audioContext.onStop(() => {
				  console.log('音频播放结束');
				  this.isPlaying = false;
				  this.audioPlayIndex = -1;
				  if (this.playTimeout) {
				    clearTimeout(this.playTimeout);
				    this.playTimeout = null;
				  }
				});
				
				this.audioContext.onError((res) => {
				  console.error('音频播放错误:', res.errMsg);
				  this.isPlaying = false;
				  this.audioPlayIndex = -1;
				  if (this.playTimeout) {
				    clearTimeout(this.playTimeout);
				    this.playTimeout = null;
				  }
				});
			}
		  },
		  fail: (err) => {
				console.error('请求失败:', err);
		  }
		
		});
		
		
	  } catch (error) {
		console.error('请求出错:', error);
	  }
	},

    // Play audio for a specific line
    playAudio(index) {
		// Toggle if clicking the same line
		if (this.audioPlayIndex === index && this.isPlaying) {
			this.audioContext.stop();
			// this.audioPlayIndex = -1;
			return;
		}
		
		if (this.isPlaying) {
			this.stopCurrentAudio();
		}
			
		let curStartTime = parseFloat(this.startEndTimeList[index][0]) - 0.5;
		let curEndTime = parseFloat(this.startEndTimeList[index][1]) + 0.5;
		let duration = curEndTime - curStartTime ;
		  
		console.log("EndTime, StartTime:", curEndTime, curStartTime)
		
		
		console.log('Play audio for line:', index);
		console.log('Play index :', this.audioPlayIndex);
		if (this.audioPlayIndex !== index) {
			this.audioContext.stop();
		}
		
		this.audioPlayIndex = index;
		this.isPlaying = true;
		this.audioContext.seek(curStartTime);
		this.audioContext.play();
		
		setTimeout(() => {
		    this.audioContext.stop();
		}, duration * 1000);
    },

	stopCurrentAudio() {
	  if (this.audioContext) {
	    this.audioContext.stop();
	  }
	  this.isPlaying = false;
	  this.audioPlayIndex = -1;
	  if (this.playTimeout) {
	    clearTimeout(this.playTimeout);
	    this.playTimeout = null;
	  }
	},

    // Start or stop recording for a specific line
	// Updated toggleRecording method
	async toggleRecording(index) {
	  if (this.isRecording) {
		this.stopRecording();
	  } else {
		if (this.audioPlayIndex !== -1) {
		  this.audioContext.stop();
		}
		
		if (index === this.currentRecordingIndex && this.canRecord) {
		  this.activeRecordingIndex = index;
		  await this.startRecording(index);
		}
	  }
	},

    async startRecording(index) {
      try {
		this.canRecord = false;
		
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		this.audioRecord = new (window.AudioContext || window.webkitAudioContext)({
		  sampleRate: 16000,
		});
        const source = this.audioRecord.createMediaStreamSource(stream);
        this.analyzer = this.audioRecord.createAnalyser();
        source.connect(this.analyzer);
    
        // Set up frequency data array
        this.analyzer.fftSize = 256;
        const bufferLength = this.analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
    
        // Update frequency bars
        const updateBars = () => {
          if (!this.isRecording) return; // Stop updating if not recording
          this.analyzer.getByteFrequencyData(dataArray); // Get frequency data
          this.frequencyBars = Array.from(dataArray.slice(0, 5)); // Use first 5 values
          requestAnimationFrame(updateBars); // Continuously update bars
        };
        updateBars(); // Start the visualization loop
    
        // Start recording
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
		
		this.mediaRecorder.onstop = async () => {
		  const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
		  
		  // Store the recording at its correct index position
		  this.$set(this.allRecordings, index, { 
		    index, 
		    blob: audioBlob 
		  });
		  await this.sendAudioToASR(audioBlob, index);
		  
		  await this.calculateScore(index);
		  // If all recordings are done (no null values left), calculate the final score
		  // if (this.allRecordings.every(recording => recording !== null)) {
		  //   await this.calculateFinalScore();
		  // }
		};
		

        this.mediaRecorder.start();
		this.isRecording = true;
		this.canRecord = true; // Re-enable recording controls
		let curStartTime = parseFloat(this.startEndTimeList[index][0]) - 0.5;
		let curEndTime = parseFloat(this.startEndTimeList[index][1]) + 0.5;
		let duration = curEndTime - curStartTime;
		
		// setTimeout(() => {
		//     this.stopRecording();
		// 	console.log("setTimeout()");
		// }, duration * 1000);
		
      } catch (error) {
        console.error('Error starting recording:', error);
		this.canRecord = true; // Ensure we re-enable on error
      }
    },

	stopRecording() {
		if (this.mediaRecorder && this.isRecording) {
			console.log("stopRecording()");
			// clearTimeout(this.recordingTimeout);
			this.mediaRecorder.stop();
			this.isRecording = false;
			this.activeRecordingIndex = null;
			
			if (this.currentRecordingIndex < this.sentenceLines.length - 1) {
			  this.currentRecordingIndex++;
			  this.$nextTick(() => {
				this.autoScrollToCurrentLine();
			  });
			}
		}
	},

	// Add this method
  handleScroll() {
    // Prevent user scrolling by resetting position
	if (this.isReviewMode) return;
	
    if (this.$refs.sentenceContainer && this.currentRecordingIndex !== null) {
      const container = this.$refs.sentenceContainer;
      const targetElement = container.children[this.currentRecordingIndex];
      if (targetElement) {
        const targetPosition = targetElement.offsetTop - (container.clientHeight / 2) + (targetElement.clientHeight / 2);
        container.scrollTop = targetPosition;
      }
    }
  },
  
	autoScrollToCurrentLine() {
		this.$nextTick(() => {
		  const container = this.$refs.sentenceContainer;
		  if (!container || !container.children) return;
		  
		  const targetElement = container.children[this.currentRecordingIndex];
		  if (!targetElement) return;
		  
		  // Calculate target scroll position (centering the element)
		  const containerHeight = container.clientHeight;
		  const targetPosition = targetElement.offsetTop - (containerHeight / 2) + (targetElement.clientHeight / 2);
		  
		  // Use requestAnimationFrame for smoother animation
		  const startTime = performance.now();
		  const startPosition = container.scrollTop;
		  const distance = targetPosition - startPosition;
		  const duration = 500; // milliseconds
		  
		  const animateScroll = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easeProgress = this.easeInOutQuad(progress);
			
			container.scrollTop = startPosition + (distance * easeProgress);
			
			if (progress < 1) {
			  requestAnimationFrame(animateScroll);
			}
		  };
		  
		  requestAnimationFrame(animateScroll);
		});
	},

	
	scrollToLine(index) {
		this.$nextTick(() => {
		  const container = this.$refs.sentenceContainer;
		  if (!container || !container.children) return;
		  
		  const targetElement = container.children[index];
		  if (!targetElement) return;
		  
		  // Calculate target position (center of container)
		  const containerHeight = container.clientHeight;
		  const targetPosition = targetElement.offsetTop - (containerHeight / 2) + (targetElement.clientHeight / 2);
		  
		  // Smooth scroll animation
		  container.scrollTo({
			top: targetPosition,
			behavior: 'smooth'
		  });
		  
		  // Highlight the failed line briefly
		  targetElement.classList.add('bg-red-50');
		  setTimeout(() => {
			targetElement.classList.remove('bg-red-50');
		  }, 2000);
		});
	},


	// Easing function for smooth acceleration/deceleration
	easeInOutQuad(t) {
	return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	},

    // // Scroll to the next sentence line
    // scrollToNextLine() {
    //   const nextLine = this.$el.querySelector(`.sentence-line:nth-child(${this.activeRecordingIndex + 2})`);
    //   if (nextLine) {
    //     nextLine.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //   }
    // },

    // Navigate to home and scroll to About section
	// scrollToAbout() {
	//   uni.navigateTo({
	// 	url: '/pages/index/index',
	// 	success: () => {
	// 	  // Scroll to the About section after navigation
	// 	  setTimeout(() => {
	// 		const aboutSections = document.getElementsByClassName('aboutWork');
	// 		if (aboutSections && aboutSections.length > 0) {
	// 		  const aboutSection = aboutSections[0]; // Get the first element
	// 		  aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
	// 		} else {
	// 		  console.error('About section not found');
	// 		}
	// 	  }, 100); // Small delay to ensure the page is loaded
	// 	},
	//   });
	// },

	scrollToAbout() {
	  this.enablePageScroll();
	  uni.navigateTo({
		url: '/pages/index/index',
		success: () => {
		  // Wait for the page to load and Vue to mount
		  setTimeout(() => {
			// Get the current pages instance
			const pages = getCurrentPages();
			if (pages.length > 0) {
			  // Get the last page (which should be the index page)
			  const currentPage = pages[pages.length - 1];
			  
			  // Get the component instance
			  const vm = currentPage.$vm;
			  
			  // Check if the ref exists
			  if (vm && vm.$refs.aboutWork) {
				vm.$refs.aboutWork.scrollIntoView({ 
				  behavior: 'smooth', 
				  block: 'start' 
				});
			  } else {
				console.error('About section ref not found');
			  }
			}
		  }, 300); // Increased delay to ensure page is fully loaded
		},
		fail: (err) => {
		  console.error('Navigation failed:', err);
		}
	  });
	},
	
    // async sendAudioToASR(audioBlob, index) {
    //   try {
    //     const formData = new FormData();
    //     formData.append('files', audioBlob, 'recording.wav');

    //     const response = await fetch('http://localhost:3090/api/v1/asr', {
    //       method: 'POST',
    //       body: formData,
    //     });
    //     const jsonResponse = await response.json();
    //     if (jsonResponse.text) {
    //       this.$set(this.asrResponseLines, index, jsonResponse.text); // Directly map response to index
    //     }
    //   } catch (error) {
    //     console.error('Error uploading audio:', error);
    //   }
    // },
	
	async sendAudioToASR(audioBlob, index) {
	  try {
	    const formData = new FormData();
	    formData.append('files', audioBlob, 'recording.wav');
	    formData.append('file_name', this.fileName);
		formData.append('game_mode', this.gameMode);
		formData.append('time_mode', this.timeMode);
		formData.append('index', index);
	
	    const response = await fetch('http://localhost:3090/api/v1/asr', {
	      method: 'POST',
	      body: formData,
	    });
	    const jsonResponse = await response.json();
	    if (jsonResponse.text) {
	      this.$set(this.asrResponseLines, index, jsonResponse.text); // Directly map response to index
			this.textScore.push(jsonResponse.text_score);
			this.durationScore.push(jsonResponse.duration_score);
			this.pauseScore.push(jsonResponse.pause_score);
			this.tempoScore.push(jsonResponse.tempo_score);
			this.pitchScore.push(jsonResponse.pitch_score);
		}
	  } catch (error) {
	    console.error('Error uploading audio:', error);
	  }
	},
	
	calculateAvarage(arr){
		const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
		return sum / arr.length;
	},

	async calculateFinalScore() {
	    try {
			this.finalScore = this.calculateAvarage(this.textScore) + this.calculateAvarage(this.durationScore) + this.calculateAvarage(this.pauseScore) + this.calculateAvarage(this.tempoScore) + this.calculateAvarage()(this.pitchScore);
			this.showResultsPopup();
		} catch (error) {
	      console.error('Error calculating score:', error);
	    }
	  },
	
	// calculateFinalScore() {
	// 	let n = this.textScores.length;
		
	// 	for (let i = 0 ; i < n ; i++) {
	// 		this.textScore += this.textScores[i];
	// 		this.durationScore += this.durationScores[i];
	// 		this.pauseScore += this.pauseScores[i];
	// 		this.tempoScore += this.tempoScores[i];
	// 		this.pitchScore += this.pitchScores[i];
	// 	}
		
	// 	this.textScore /= n;
	// 	this.durationScore /= n;
	// 	this.pauseScore /= n;
	// 	this.tempoScore /= n;
	// 	this.pitchScore /= n;
		
		
		
	// },
    // Calculate final score (called only once at the end)
  //   async calculateFinalScore() {
  //     try {
  //       // Sort recordings by index to ensure correct order
  //       this.allRecordings.sort((a, b) => a.index - b.index);

  //       // Concatenate all audio blobs into one
  //       const concatenatedBlob = new Blob(
  //         this.allRecordings.map((recording) => recording.blob),
  //         { type: 'audio/wav' }
  //       );
		
		

  //       // Send the concatenated audio to the backend
  //       const formData = new FormData();
		// console.log(concatenatedBlob, this.allRecordings.length);
  //       formData.append('files', concatenatedBlob, 'concatenated_recording.wav');
  //       formData.append('file_name', this.fileName);
  //       formData.append('game_mode', this.gameMode);
  //       formData.append('time_mode', this.timeMode);

  //       const response = await fetch('http://localhost:3090/api/v1/reading_score', {
  //         method: 'POST',
  //         body: formData,
  //       });
  //       const jsonResponse = await response.json();
  // //       this.textScore = jsonResponse.text_score;
		// // this.durationScore = jsonResponse.duration_score;
		// // this.pauseScore = jsonResponse.pause_score;
		// // this.tempoScore = jsonResponse.tempo_score;
		// // this.pitchScore = jsonResponse.pitch_score;
		// let textScore = jsonResponse.text_score;
		// let durationScore = jsonResponse.duration_score;
		// let pauseScore = jsonResponse.pause_score;
		// let tempoScore = jsonResponse.tempo_score;
		// let pitchScore = jsonResponse.pitch_score;
		
		// this.finalScore = textScore + durationScore + pauseScore + tempoScore + pitchScore;
		
		// console.log(this.finalScore);
		    
		// // Store individual line scores (modify according to your actual API response)
		// this.sentenceLines.forEach((_, index) => {
		//   this.$set(this.reviewScores, index, {
		// 	text_score: Math.floor(textScore / this.sentenceLines.length),
		// 	fluency_score: Math.floor(durationScore / this.sentenceLines.length),
		// 	tempo_score: Math.floor(tempoScore / this.sentenceLines.length),
		// 	pitch_score: Math.floor(pitchScore / this.sentenceLines.length),
		// 	feedback: jsonResponse.feedback?.[index] || "No specific feedback available"
		//   });
		// });
		
		// this.showResultsPopup();
		
  //     } catch (error) {
  //       console.error('Error calculating score:', error);
  //     }
  //   },
  },
};
</script>

<style scoped>
	/* import '@dcloudio/uni-components/style/audio.css'; */
	@import url('style.css');
	@import url('/pages/css/globalStyle.css');
	
	.recording-animation {
	  animation: pulse 1.5s infinite;
	}
	
	@keyframes pulse {
	  0% { opacity: 0.6; }
	  50% { opacity: 1; }
	  100% { opacity: 0.6; }
	}
	
	.recording-pulse {
	  animation: pulse 1.5s infinite;
	}
	
	@keyframes pulse {
	  0% { transform: scale(1); }
	  50% { transform: scale(1.05); }
	  100% { transform: scale(1); }
	}
	
	.smooth-scroll-container {
	  scroll-behavior: smooth;
	  transition: scroll-top 0.5s ease-out;
	}
	
	/* Ensure the container is properly sized */
	.sentence-container {
	  height: calc(100vh - 12rem); /* Adjust based on your header/footer */
	  overflow-y: auto;
	}
	
	.sentence-container {
	  height: calc(100vh - 12rem);
	  overflow-y: hidden;
	  scroll-behavior: smooth;
	  -webkit-overflow-scrolling: touch; /* For smooth scrolling on iOS */
	}
	
	.sentence-container > * {
	  pointer-events: none; /* Disable pointer events on children */
	}
	
	.sentence-container > .active-line {
	  pointer-events: auto; /* Enable pointer events only on active line */
	}
	
	/* Disable touch scrolling */
	.no-scroll {
	  touch-action: none;
	  -ms-touch-action: none;
	}
	
	.sentence-container {
	  height: calc(100vh - 12rem);
	  overflow-y: hidden;
	  scroll-behavior: smooth;
	  -webkit-overflow-scrolling: touch;
	  will-change: scroll-position; /* Hint to browser for optimization */
	}
	
	.sentence-line {
	  transition: transform 0.3s ease, opacity 0.3s ease;
	}
	
	/* Disable pointer events during animation */
	.scrolling-active {
	  pointer-events: none;
	}
	.highlight-failed {
		animation: pulse-highlight 2s ease-in-out;
		border-left: 4px solid #ef4444;
	}

	@keyframes pulse-highlight {
		0% { background-color: rgba(239, 68, 68, 0.1); }
		50% { background-color: rgba(239, 68, 68, 0.3); }
		100% { background-color: rgba(239, 68, 68, 0.1); }
	}
	
	.recording-pulse {
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0% { transform: scale(1); }
		50% { transform: scale(1.05); }
		100% { transform: scale(1); }
	}

	.smooth-scroll {
		scroll-behavior: smooth;
	}

	.review-highlight {
		box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
	}
	
	.sentence-container {
	  height: calc(100vh - 12rem);
	  scroll-behavior: smooth;
	  -webkit-overflow-scrolling: touch;
	}
	
	/* When not in review mode, disable scrolling */
	.overflow-y-hidden {
	  overflow-y: hidden !important;
	}
	
	/* When in review mode, enable natural scrolling */
	.overflow-y-auto {
	  overflow-y: auto !important;
	  touch-action: pan-y;
	  -ms-touch-action: pan-y;
	}
	
	/* Disable pointer events during animation */
	.scrolling-active {
	  pointer-events: none;
	}
	
	.sentence-container {
	  height: calc(100vh - 10rem);
	  width: 100%;
	  scrollbar-width: thin; /* For Firefox */
	  scrollbar-color: #c7d2fe #f5f3ff; /* For Firefox */
	}
	
	/* Custom scrollbar for WebKit browsers */
	.sentence-container::-webkit-scrollbar {
	  width: 8px;
	}
	
	.sentence-container::-webkit-scrollbar-track {
	  background: #f5f3ff;
	}
	
	.sentence-container::-webkit-scrollbar-thumb {
	  background-color: #c7d2fe;
	  border-radius: 4px;
	}
	
	/* Ensure content doesn't get hidden behind scrollbar */
	.sentence-content {
	  padding-right: 16px; /* Same as the scrollbar width + some spacing */
	}
</style>