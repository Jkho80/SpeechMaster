import ffmpeg
from funasr.utils.postprocess_utils import rich_transcription_postprocess
import os
from funasr import AutoModel
import torch
import numpy as np
import librosa
import time
import torchaudio

script_dir = os.path.dirname(os.path.abspath(__file__))

# input_video = 'path/to/your/video.mp4'
# output_video = 'path/to/save/your/video.mp4'
# start_time = 0
# end_time = 100
# duration = end_time - start_time

# ffmpeg.input(input_video).filter('trim', start=start_time, end=end_time).output(output_video).run()


home_directory = os.path.expanduser("~")
asr_model_path = os.path.join(home_directory, ".cache", "modelscope", "hub", "models", "iic", "speech_seaco_paraformer_large_asr_nat-zh-cn-16k-common-vocab8404-pytorch")
asr_model_revision = "v2.0.4"
vad_model_path = os.path.join(home_directory, ".cache", "modelscope", "hub", "models", "iic", "speech_fsmn_vad_zh-cn-16k-common-pytorch")
vad_model_revision = "v2.0.4"
punc_model_path = os.path.join(home_directory, ".cache", "modelscope", "hub", "models", "iic", "punc_ct-transformer_zh-cn-common-vocab272727-pytorch")
punc_model_revision = "v2.0.4"
spk_model_path = os.path.join(home_directory, ".cache", "modelscope", "hub", "models", "iic", "speech_campplus_sv_zh-cn_16k-common")
spk_model_revision = "v2.0.4"
ngpu = 1
device = "cuda"
ncpu = 4

debug = False

# ASR 模型
m = AutoModel(
    model=asr_model_path,
    model_revision=asr_model_revision,
    # vad_model=vad_model_path,
    # vad_model_revision=vad_model_revision,
    # vad_kwargs={"max_single_segment_time": 5000},
    # punc_model=punc_model_path,
    # punc_model_revision=punc_model_revision,
  #   spk_model=spk_model_path,
  #   spk_model_revision = spk_model_revision,
    ngpu=ngpu,
    ncpu=ncpu,
    device=device,
    disable_pbar=True,
    disable_log=True,
    disable_update=True,
    vad_merge=True
    )


encoder_chunk_look_back = 12
decoder_chunk_look_back = 4 

uncut_audio_30s_dir = os.path.join(script_dir, "uncut_audio", "uncut_audio_30s")
uncut_audio_1min_dir = os.path.join(script_dir, "uncut_audio", "uncut_audio_1min")
uncut_audio_2min_dir = os.path.join(script_dir, "uncut_audio", "uncut_audio_2min")
uncut_audio_long_dir = os.path.join(script_dir, "uncut_audio", "uncut_audio_long")

saved_audio_30s_dir = os.path.join(script_dir, "saved_audios", "saved_audio_30s")
saved_audio_1min_dir = os.path.join(script_dir, "saved_audios", "saved_audio_1min")
saved_audio_2min_dir = os.path.join(script_dir, "saved_audios", "saved_audio_2min")
saved_audio_long_dir = os.path.join(script_dir, "saved_audios", "saved_audio_long")

uncut_audio_30s_files_list = [os.path.join(uncut_audio_30s_dir, file) for file in os.listdir(uncut_audio_30s_dir) if file.endswith('.wav')]
uncut_audio_1min_files_list = [os.path.join(uncut_audio_1min_dir, file) for file in os.listdir(uncut_audio_1min_dir) if file.endswith('.wav')]
uncut_audio_2min_files_list = [os.path.join(uncut_audio_2min_dir, file) for file in os.listdir(uncut_audio_2min_dir) if file.endswith('.wav')]
uncut_audio_long_files_list = [os.path.join(uncut_audio_long_dir, file) for file in os.listdir(uncut_audio_long_dir) if file.endswith('.wav')]

unstandart_audio_txt_dir = os.path.join(script_dir, "unstandart_audio_txt")

cuda_exist = torch.cuda.is_available()

for file_list, output_list in zip([uncut_audio_30s_files_list, uncut_audio_1min_files_list, uncut_audio_2min_files_list], [saved_audio_30s_dir, saved_audio_1min_dir, saved_audio_2min_dir]):
  for file_path in file_list:
    if debug:
      print(f"input_file_path : {file_path}")
    file_name = os.path.basename(file_path)

    if debug:
      start = time.time()

    # GPU方案
    if cuda_exist:
      waveform, sr = torchaudio.load(file_path)
      
      if sr != 16000:
          resampler = torchaudio.transforms.Resample(sr, 16000)
          waveform = resampler(waveform)

      waveform = waveform.mean(dim=0)  # 立体声 -> 单声道
      waveform = waveform / 32768.0    # 归一化（假设原始为int16）
      waveform = waveform.to("cuda")
    
    # CPU方案
    else:
      y, sr = librosa.load(file_path, sr=16000, mono=True)
      waveform = torch.tensor(y, dtype=torch.float32)
      

    if debug:
      print(f"数据 加载耗时: {time.time()-start:.4f}s")
    
    if debug:
      print("声音振幅数据 [-1.0 ~ 1.0] :", waveform)
      print(waveform.dtype)
      print(waveform.shape)

    cnt = 0

    uneffect_symbol = {' ', '。', '，', '？', '\n', '、'}
    uneffect_symbol_str = ' 。，？\n、'

    with open(os.path.join(unstandart_audio_txt_dir, file_name[:-4] + '.txt'), 'r', encoding="utf-8") as f:
        poem_texts = f.read()
        cnt = sum(1 for ch in poem_texts if ch not in uneffect_symbol)
        # trans_table = str.maketrans('', '', uneffect_symbol_str)  # 创建翻译表
        # cnt = len(poem_texts.translate(trans_table))  # 删除指定字符后取长度




    if debug:
      start = time.time()

    res = m.generate(
        input=waveform,
        sentence_timestamp=True,
        key=file_name[:-4],
        )
    
    if debug:
      print(f"模型识别耗时: {time.time()-start:.4f}s")
      print(res)
      print(f"word count : {cnt}")
      
    
    output_file_path = os.path.join(output_list, file_name)

    start_second: float = (res[0]['timestamp'][-cnt][0] / 1000) - 0.5 # 往前 0.5秒 开始 
    
    if debug:
      print(f"output_file_path : {output_file_path}")
      print(f"start_second : {start_second}s")

    ffmpeg.input(file_path, ss=start_second).output(output_file_path, format="wav", ar=16000, acodec="pcm_s16le").overwrite_output().run()

