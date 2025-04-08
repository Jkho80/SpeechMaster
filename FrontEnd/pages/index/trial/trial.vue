<template>
  <div class="practice-aim">
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
  </div>
</template>



<script>
	import Recorder from 'recorder-core';
	import RecordApp from 'recorder-core/src/app-support/app';
	import '@/uni_modules/Recorder-UniCore/app-uni-support.js';
	
	// #ifdef MP-WEIXIN
	    import 'recorder-core/src/app-support/app-miniProgram-wx-support.js'
	// #endif
	
	// #ifdef H5 || MP-WEIXIN
	    //按需引入你需要的录音格式支持文件，如果需要多个格式支持，把这些格式的编码引擎js文件统统引入进来即可
	    import 'recorder-core/src/engine/mp3'
	    import 'recorder-core/src/engine/mp3-engine' //如果此格式有额外的编码引擎（*-engine.js）的话，必须要加上
	
	    //可选的插件支持项，把需要的插件按需引入进来即可
	    import 'recorder-core/src/extensions/waveview'
	// #endif
	
	export default {
		data() {
			return {
				sentence: '', // Fetched sentence from backend
				sentenceLines: [], // Sentence split into lines
				frequencyBars: Array(10).fill(10), // Frequency visualization bars
				isRecording: false,
			}
		},
		async created() {
			await this.fetchSentence();
		},
		mounted() {
			this.isMounted = true;
			RecordApp.UniPageOnShow(this);
		},
		onShow() {
			if (this.isMounted) RecordApp.UniPageOnShow(this);
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
				RecordApp.UniWebViewActivate(this);
				RecordApp.RequestPermision(() => {
					console.log("疑惑的录音权限");
				}, (msg,isUserNotAllow) => {
					if (isUserNotAllow) {
						
					}
					console.error("请求录音权限失败: " + msg);
				});
			},
			
			recStart() {
				var set={
					type:"mp3",sampleRate:16000,bitRate:16,
					onProcess:(buffers, powerLevel, duration, sampleRate, newBufferIdx, asyncEnd)=> {
						if(this.waveView) this.waveView.input(buffers[buffers.length-1],powerLevel,sampleRate);
					},
					onProcess_renderjs:`function(buffers,powerLevel,duration,sampleRate,newBufferIdx,asyncEnd){
						//App中在这里修改buffers会改变生成的音频文件，但注意：buffers会先转发到逻辑层onProcess后才会调用本方法，因此在逻辑层的onProcess中需要重新修改一遍
						//本方法可以返回true，renderjs中的onProcess将开启异步模式，处理完后调用asyncEnd结束异步，注意：这里异步修改的buffers一样的不会在逻辑层的onProcess中生效
						//App中是在renderjs中进行的可视化图形绘制，因此需要写在这里，this是renderjs模块的this（也可以用This变量）；如果代码比较复杂，请直接在renderjs的methods里面放个方法xxxFunc，这里直接使用this.xxxFunc(args)进行调用
						if(this.waveView) this.waveView.input(buffers[buffers.length-1],powerLevel,sampleRate);
		
						/*和onProcess中一样进行释放清理内存，用于支持长时间录音
						if(this.clearBufferIdx>newBufferIdx){ this.clearBufferIdx=0 } //重新录音了就重置
						for(var i=this.clearBufferIdx||0;i<newBufferIdx;i++) buffers[i]=null;
						this.clearBufferIdx=newBufferIdx; */
					}`
					,onProcessBefore_renderjs:`function(buffers,powerLevel,duration,sampleRate,newBufferIdx){
						//App中本方法会在逻辑层onProcess之前调用，因此修改的buffers会转发给逻辑层onProcess，本方法没有asyncEnd参数不支持异步处理
						//一般无需提供本方法只用onProcess_renderjs就行，renderjs的onProcess内部调用过程：onProcessBefore_renderjs -> 转发给逻辑层onProcess -> onProcess_renderjs
					}`
		
					,takeoffEncodeChunk:true?null:(chunkBytes)=>{
						//全平台通用：实时接收到编码器编码出来的音频片段数据，chunkBytes是Uint8Array二进制数据，可以实时上传（发送）出去
						//App中如果未配置RecordApp.UniWithoutAppRenderjs时，建议提供此回调，因为录音结束后会将整个录音文件从renderjs传回逻辑层，由于uni-app的逻辑层和renderjs层数据交互性能实在太拉跨了，大点的文件传输会比较慢，提供此回调后可避免Stop时产生超大数据回传
		
						//App中使用原生插件时，可方便的将数据实时保存到同一文件，第一帧时append:false新建文件，后面的append:true追加到文件
						//RecordApp.UniNativeUtsPluginCallAsync("writeFile",{path:"xxx.mp3",append:回调次数!=1, dataBase64:RecordApp.UniBtoa(chunkBytes.buffer)}).then(...).catch(...)
					}
					,takeoffEncodeChunk_renderjs:true?null:`function(chunkBytes){
						//App中这里可以做一些仅在renderjs中才生效的事情，不提供也行，this是renderjs模块的this（也可以用This变量）
					}`
		
					,start_renderjs:`function(){
						//App中可以放一个函数，在Start成功时renderjs中会先调用这里的代码，this是renderjs模块的this（也可以用This变量）
						//放一些仅在renderjs中才生效的事情，比如初始化，不提供也行
					}`
					,stop_renderjs:`function(arrayBuffer,duration,mime){
						//App中可以放一个函数，在Stop成功时renderjs中会先调用这里的代码，this是renderjs模块的this（也可以用This变量）
						//放一些仅在renderjs中才生效的事情，不提供也行
					}`
				};
				
				RecordApp.UniWebViewActivate(this); //App环境下必须先切换成当前页面WebView
				RecordApp.Start(set,()=>{
					console.log("已开始录音");
					//【稳如老狗WDT】可选的，监控是否在正常录音有onProcess回调，如果长时间没有回调就代表录音不正常
					//var wdt=this.watchDogTimer=setInterval ... 请参考示例Demo的main_recTest.vue中的watchDogTimer实现
		
					//创建音频可视化图形绘制，App环境下是在renderjs中绘制，H5、小程序等是在逻辑层中绘制，因此需要提供两段相同的代码
					//view里面放一个canvas，canvas需要指定宽高（下面style里指定了300*100）
					//<canvas type="2d" class="recwave-WaveView" style="width:300px;height:100px"></canvas>
					RecordApp.UniFindCanvas(this,[".recwave-WaveView"],`
						this.waveView=Recorder.WaveView({compatibleCanvas:canvas1, width:300, height:100});
					`,(canvas1)=>{
						this.waveView=Recorder.WaveView({compatibleCanvas:canvas1, width:300, height:100});
					});
				},(msg)=>{
					console.error("开始录音失败："+msg);
				});
			},
			
			recPause(){
				if(RecordApp.GetCurrentRecOrNull()){
					RecordApp.Pause();
					console.log("已暂停");
				}
			},
			
			recResume(){
				if(RecordApp.GetCurrentRecOrNull()){
					RecordApp.Resume();
					console.log("继续录音中...");
				}
			},
			
			recStop(){
				//RecordApp.UniNativeUtsPluginCallAsync("androidNotifyService",{ close:true }) //关闭Android App后台录音保活服务
		
				RecordApp.Stop((arrayBuffer,duration,mime)=>{
					//全平台通用：arrayBuffer是音频文件二进制数据，可以保存成文件或者发送给服务器
					//App中如果在Start参数中提供了stop_renderjs，renderjs中的函数会比这个函数先执行
		
					//注意：当Start时提供了takeoffEncodeChunk后，你需要自行实时保存录音文件数据，因此Stop时返回的arrayBuffer的长度将为0字节
		
					//如果是H5环境，也可以直接构造成Blob/File文件对象，和Recorder使用一致
					// #ifdef H5
						var blob=new Blob([arrayBuffer],{type:mime});
						console.log(blob, (window.URL||webkitURL).createObjectURL(blob));
						var file=new File([arrayBuffer],"recorder.mp3");
						//uni.uploadFile({file:file, ...}) //参考demo中的test_upload_saveFile.vue
					// #endif
		
					//如果是App、小程序环境，可以直接保存到本地文件，然后调用相关网络接口上传
					// #ifdef APP || MP-WEIXIN
						RecordApp.UniSaveLocalFile("recorder.mp3",arrayBuffer,(savePath)=>{
							console.log(savePath); //app保存的文件夹为`plus.io.PUBLIC_DOWNLOADS`，小程序为 `wx.env.USER_DATA_PATH` 路径
							//uni.uploadFile({filePath:savePath, ...}) //参考demo中的test_upload_saveFile.vue
						},(errMsg)=>{ console.error(errMsg) });
					// #endif
				},(msg)=>{
					console.error("结束录音失败："+msg);
				});
			}
		}
	}
</script>

<style>
	@import url(style.css);
</style>
