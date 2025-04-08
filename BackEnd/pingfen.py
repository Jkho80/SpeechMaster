# Set the device with environment, default is cuda:0
# export SENSEVOICE_DEVICE=cuda:1

import os, re
from fastapi import FastAPI, File, Form, UploadFile, Request
from fastapi.responses import HTMLResponse, FileResponse
# from typing_extensions import Annotated
import random
from typing import List
from funasr import AutoModel
from enum import Enum
import torchaudio
from model import SenseVoiceSmall
from funasr.utils.postprocess_utils import rich_transcription_postprocess
# import asyncio
# import io
from io import BytesIO
# import uvicorn
from datetime import timedelta, datetime
import logging
import librosa
import numpy as np
# import difflib
# from pydub import AudioSegment
from random import choice
import ffmpeg
from torch import Tensor
import csv
# import tqdm
# import subprocess
import pandas as pd
import torch
# import wave
import psutil
import soundfile as sf  # 使用soundfile库来读取音频文件

selected_poem = ""
regex = r"<\|.*\|>"
script_dir = os.path.dirname(os.path.abspath(__file__))

debug = False
memory = psutil.virtual_memory()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Language(str, Enum):
    auto = "auto"
    zh = "zh"
    en = "en"
    yue = "yue"
    ja = "ja"
    ko = "ko"
    nospeech = "nospeech"

model_dir = "iic/SenseVoiceSmall"
# m = AutoModel(
#     model=model_dir,
#     trust_remote_code=True,
#     remote_code="./model.py",    
#     vad_model="fsmn-vad",
#     vad_kwargs={"max_single_segment_time": 30000},
#     device="cuda:0",
# )

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
device = "cuda:0"
ncpu = 4

# ASR 模型
m = AutoModel(model=asr_model_path,
                  model_revision=asr_model_revision,
                  vad_model=vad_model_path,
                  vad_model_revision=vad_model_revision,
                  vad_kwargs={"max_single_segment_time": 5000},
                  punc_model=punc_model_path,
                  punc_model_revision=punc_model_revision,
                #   spk_model=spk_model_path,
                #   spk_model_revision = spk_model_revision,
                  ngpu=ngpu,
                  ncpu=ncpu,
                  device=device,
                  disable_pbar=True,
                  disable_log=True,
                  disable_update=True
                  )



def to_date(milliseconds):
    """将时间戳转换为SRT格式的时间"""
    time_obj = timedelta(milliseconds=milliseconds)
    return f"{time_obj.seconds // 3600:02d}:{(time_obj.seconds // 60) % 60:02d}:{time_obj.seconds % 60:02d}.{time_obj.microseconds // 1000:03d}"


# m = AutoModel(model="paraformer-zh",                               
#               vad_model="fsmn-vad",
#               vad_kwargs={"max_single_segment_time": 8},
#               punc_model="ct-punc"
#                 )

# 普通话标准，吐字清楚、准确，语言生动，语气、语调、声音、节奏富于变化，
# 轻重缓急、抑扬顿挫切合诗歌朗诵的资料，能准确、恰当地表情达意，舒心悦耳，娓娓动听。


# 加载音频文件
def load_audio(filepath, sr=None):
    y, sr = librosa.load(filepath, sr=sr)
    return y, sr

# def load_audio_t(filepath):
#     waveform, sample_rate = torchaudio.load(filepath)
#     return waveform, sample_rate

# 估计节奏
def estimate_tempo(y, sr, start, end):
    # tempo = librosa.beat.tempo(y=y, sr=sr, hop_length=512)[0]
    start_idx = int(sr * start)
    end_idx = int(sr * end)
    tempo = librosa.beat.beat_track(y=y[start_idx:end_idx], sr=sr)[0][0]
    return tempo

    # fps = 100
    # hop_length = int(librosa.time_to_samples(1./fps,sr=sr)) # 441
    # # this Calculation is new to me
    # n_fft = 2048
    # # length of fft window
    # fmin = 27.5
    # fmax = 16000.
    # n_mels = 80

    # mel_spec = librosa.feature.melspectrogram(y, sr=sr, n_fft=n_fft,
    #                   hop_length=hop_length,
    #                   fmin=fmin, fmax=fmax,
    #                   n_mels=n_mels)
    
    # S = mel_spec # pre-computed (log-power) spectrogram
    # lag = 2 # time lag for computing differences
    # max_size = 3 # size (in frequency bins) of the local max filter， set to 1 to disable filtering
    # spectral_flux = librosa.onset.onset_strength(S=librosa.power_to_db(S, ref=np.max),
    #                         sr=sr, hop_length=hop_length,
    #                         lag=lag, max_size=max_size)

    # tempogram = librosa.feature.tempogram(onset_envelope=spectral_flux,
    #                 sr=sr, hop_length=hop_length)

    # tempo = librosa.beat.tempo(onset_envelope=spectral_flux, sr=sr,
    #            hop_length=hop_length)[0]
    
    # ac_global = librosa.autocorrelate(spectral_flux, max_size=tempogram.shape[0])
    # # Compute global onset autocorrelation
    # # max_size: maximum correlation lag
    # ac_global = librosa.util.normalize(ac_global)

    # freqs_bpm = librosa.tempo_frequencies(n_bins = tempogram.shape[0],
    #               hop_length=hop_length, sr=sr)


def count_chinese_char(text: str) -> int:
    uneffect_symbol = {' ', '。', '，', '？', '\n', '、'}
    uneffect_symbol_cnt = sum(1 for ch in text if ch not in uneffect_symbol)
    return uneffect_symbol_cnt


# 检测停顿
def detect_pauses(timestamp):
    """
    :param
    timestamp: list[[int, int]] 语音事件开始与结束 (ms)

    :return
    pauses: pauses 停顿次数 (次) 
    total_pauses_time: float 停顿时长 (s|秒)
    """
    
    pauses, total_pauses_time = 0, 0

    for i in range(1, len(timestamp)):
        pause_time = timestamp[i][0] - timestamp[i-1][1]
        if pause_time > 600:
            pauses += 1
            total_pauses_time += pause_time

    total_pauses_time = total_pauses_time / 1000 # 转换成 秒 | s
    
    return pauses, total_pauses_time

def detect_pauses_v2(sentence_info):
    """
    sentence_info: list[{
        text: str 识别出来的语音
        start: float 一段古诗朗读事件起始时间 (s)
        end: float 一段古诗朗读事件终止时间 (s)
        timestamp: list[[int, int]] 语音事件开始与结束 (ms)
    }]
    """
    pauses, total_pauses_time = [], []

    for i in range(1, len(sentence_info)):
        pause_time = sentence_info[i]['start'] - sentence_info[i-1]['end']
        if pause_time > 0.8:
            pauses += 1
            total_pauses_time += pause_time
    
    return pauses, total_pauses_time


# 计算语速 单位 (word|单词) / (s|秒) 
def calculate_speech_rate(text: str, total_pauses_time: float, duration: float):
    """
    :param
    text: str 本次输入字符串的长度
    total_pauses_time: float 本次停顿的时长 (s)
    duration: float 本次语音时长 (s)

    :return
    speech_rate: float 语速 (字/秒) (Word per Second)
    """

    chinese_char_len = count_chinese_char(text)

    speech_duration = duration - total_pauses_time # 转换为秒

    speech_rate = chinese_char_len / speech_duration
    return speech_rate

# 分析语调
def analyze_intonation(y, sr, start, end):
    """
    :param
    y: np.array 音频信号
    sr: int 采样率
    start: float 分析开始时间 (s)
    end: float 分析结束时间 (s)

    :return
    mean_f0: float 基频的平均值 (Hz)
    std_f0: float 基频的标准差 (Hz)

    分析指定时间段的音频信号的基频特性，计算基频的平均值和标准差
    """

    start_idx = int(sr * start)
    end_idx = int(sr * end)

    # pitches, magnitudes = librosa.piptrack(y=y[start_idx:end_idx], sr=sr, hop_length=512)
    # f: 80 是正常男声最低音，1000 是正常女生最高音
    pitches, magnitudes, _ = librosa.pyin(y=y[start_idx:end_idx], fmin=80, fmax=1000)
    # 取得非零的基频值 magnistudes <= 0 时就自动过滤 
    f0 = pitches[magnitudes]
    # f0 = pitches[magnitudes > 0]
    # 可以计算基频的平均值、标准差等统计量
    mean_f0 = np.mean(f0)
    std_f0 = np.std(f0)
    return mean_f0, std_f0

# 提取MFCC特征 （mfcc）
def extract_mfcc(y, sr, n_mfcc=13):
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    return mfcc

# def remove_tag(text):
#     # 使用正则表达式提取<|zh|>后的情感标签及其后面的文本
#     pattern = r'<\|zh\|><\|([A-Z]+)\|>.*?(\||$)'
#     matches = re.findall(pattern, text)


#     # 准备写入文件的内容
#     text = text.split('。')
#     file_content = []
#     i = 0

#     # 正则表达式模式，匹配以<开头，以>结尾的标签
#     pattern = r'<\|[^>]+\|>'

#     for match in matches:
#         emotion_tag = match[0]
#         cur = text[i].strip()
#         clean_text = re.sub(pattern, '', cur)
#         if clean_text != '':
#             file_content.append((clean_text, emotion_tag))
#         i += 1

#     return file_content
    
audio_text_dir = os.path.join(script_dir, "unstandart_audio_txt")

def get_score_and_save(files: list[str], score_file_dir: str, game_mode: str) -> None:
    """
    :param
    files: list[str] 包含音频文件路径的列表
    score_file_dir: str 保存音频文件综合评分的目录路径
    game_mode: str 评分模式 (full | split)

    该函数用于对 files 当中的 音频文件 进行处理，获得音频文件的
    开始时间(s), 结束时间(s), 停顿次数, 停顿时长(s), 语速(words per second), 节拍 (beats per minute), 语调 基频的平均值 (Hz), 语调 基频的方差 (Hz)
    并将上述数据保存至 score_file_dir 目录下, 文件名是 file_name + '.txt' [file_path.split('/')[-1][:-4] + '.txt' for file_path in files]
    """

    audio_fs = 16000  # FunASR 项目中的大部分模型底层框架都是使用 16000 的采样率
    encoder_chunk_look_back = 12 #number of chunks to lookback for encoder self-attention
    decoder_chunk_look_back = 4 #number of encoder chunks to lookback for decoder cross-attention

    for file in files:
        y, sr = load_audio(file)
        file_tensor = torch.tensor(y, dtype=torch.float32)



        # file_bytes = torch.load(BytesIO(file_bytes))
        # print(file_tensor.dtype)

        cur_file_name = os.path.basename(file)[:-4]


        res = m.generate(
            input=file_tensor,
            batch_size_s=600,
            batch_size=2,
            # key=cur_file_name[:-4],
            is_final=True, 
            # data_type=bytes,
            sentence_timestamp=True,
            encoder_chunk_look_back=encoder_chunk_look_back, 
            decoder_chunk_look_back=decoder_chunk_look_back,
            )

        res = res[0]

        if debug:
            print("识别结果 :", res)
            print("torch.cuda.memory_allocated: %fGB"%(torch.cuda.memory_allocated(0)/1024/1024/1024))
            print("torch.cuda.memory_reserved: %fGB"%(torch.cuda.memory_reserved(0)/1024/1024/1024))
            print("torch.cuda.max_memory_reserved: %fGB"%(torch.cuda.max_memory_reserved(0)/1024/1024/1024))


        file_name = os.path.join(score_file_dir, cur_file_name + ".txt")
        # recognized_text_list = res['text'].split('，')
        # total_text = sum([len(a) for a in recognized_text_list])

        # text_array = []
        # time_array = []
        # score_array = []
        with open(os.path.join(audio_text_dir, cur_file_name + ".txt"), 'r', encoding="utf-8") as scoreFile:
            text_data = scoreFile.read().strip().split('\n')


        version = 2

        with open(file_name, 'w', encoding='utf-8') as f:
            if version == 1:
                if game_mode == "split":
                    for text_item in res['sentence_info']:
                        text_item['start'] = text_item['start'] / 1000
                        text_item['end'] = text_item['end'] / 1000

                        pause, total_pause_time = detect_pauses(text_item['timestamp'])
                        
                        # 检测停顿 单位 ms|毫秒

                        # 计算语速
                        speech_rate = calculate_speech_rate(text_item['text'], total_pause_time, text_item['end'] - text_item['start'])

                        tempo = estimate_tempo(y, sr, text_item['start'], text_item['end'])

                        pitch_mean, pitch_std = analyze_intonation(y, sr, text_item['start'], text_item['end'])

                        # text_array.append(text_item['text'])
                        # time_array.append([text_item['start'], text_item['end']])
                        # score_array.append([pause, total_pause_time, speech_rate, tempo, pitch_mean, pitch_std])

                        try:
                            f.write(f"{text_item['text']}\n")
                            f.write(f"{text_item['start']}, {text_item['end']}\n")
                            f.write(f"{pause}, {total_pause_time:.3f}, {speech_rate:.3f}, {tempo:.3f}, {pitch_mean:.3f}, {pitch_std:.3f}\n")

                        except Exception as e:
                            print(f"An unexpected error occurred: {e}")
                
                elif game_mode == "full":
                    probe = ffmpeg.probe(file)
                    audio_duration = float(probe['format']['duration'])

                    pause, total_pause_time = detect_pauses(res['timestamp'])
                    
                    # 检测停顿 单位 ms|毫秒

                    # 计算语速
                    speech_rate = calculate_speech_rate(res['text'], total_pause_time, audio_duration)

                    tempo = estimate_tempo(y, sr, 0, audio_duration)

                    pitch_mean, pitch_std = analyze_intonation(y, sr, 0, audio_duration)


                    # text_array.append(text_item['text'])
                    # time_array.append([text_item['start'], text_item['end']])
                    # score_array.append([pause, total_pause_time, speech_rate, tempo, pitch_mean, pitch_std])

                    try:
                        f.write(f"{res['text']}\n")
                        f.write(f"0, {audio_duration}\n")
                        f.write(f"{pause}, {total_pause_time:.3f}, {speech_rate:.3f}, {tempo:.3f}, {pitch_mean:.3f}, {pitch_std:.3f}\n")

                    except Exception as e:
                        print(f"An unexpected error occurred: {e}")
            elif version == 2:
                if game_mode == "split":
                    cur_index = 0
                    for standart_text in text_data:
                        standart_text_char = count_chinese_char(standart_text)
                        if debug:
                            print('standart_text:', standart_text)
                            print(cur_index)
                            print(standart_text_char)
                        
                        if cur_index + standart_text_char <= len(res['timestamp']):
                            start_time: float = res['timestamp'][cur_index][0] / 1000.0
                            end_time: float = res['timestamp'][cur_index + standart_text_char - 1][1] / 1000.0
                            duration: float = (end_time - start_time)
                        else:
                            start_time: float = res['timestamp'][cur_index][0] / 1000.0
                            end_time: float = res['timestamp'][-1][1] / 1000.0
                            duration: float = (end_time - start_time)

                        pause, total_pause_time = detect_pauses(res['timestamp'][cur_index:cur_index + standart_text_char])
                        
                        # 检测停顿 单位 ms|毫秒

                        # 计算语速
                        speech_rate = calculate_speech_rate(standart_text, total_pause_time, duration)

                        tempo = estimate_tempo(y, sr, start_time, end_time)

                        pitch_mean, pitch_std = analyze_intonation(y, sr, start_time, end_time)

                        # text_array.append(text_item['text'])
                        # time_array.append([text_item['start'], text_item['end']])
                        # score_array.append([pause, total_pause_time, speech_rate, tempo, pitch_mean, pitch_std])

                        print(pause, total_pause_time, speech_rate, tempo, pitch_mean, pitch_std)
                        
                        try:
                            f.write(f"{standart_text}\n")
                            f.write(f"{start_time}, {end_time}\n")
                            f.write(f"{pause}, {total_pause_time:.3f}, {speech_rate:.3f}, {tempo:.3f}, {pitch_mean:.3f}, {pitch_std:.3f}\n")

                        except Exception as e:
                            print(f"An unexpected error occurred: {e}")

                        cur_index += standart_text_char
                
                elif game_mode == "full":
                    audio_duration = len(y) / sr

                    # 检测停顿 单位 ms|毫秒
                    pause, total_pause_time = detect_pauses(res['timestamp'])                    

                    # 计算语速
                    speech_rate = calculate_speech_rate(res['text'], total_pause_time, audio_duration)

                    tempo = estimate_tempo(y, sr, 0, audio_duration)

                    pitch_mean, pitch_std = analyze_intonation(y, sr, 0, audio_duration)

                    try:
                        f.write(f"{' '.join(line for line in text_data)}\n")
                        f.write(f"0, {audio_duration}\n")
                        f.write(f"{pause}, {total_pause_time:.3f}, {speech_rate:.3f}, {tempo:.3f}, {pitch_mean:.3f}, {pitch_std:.3f}\n")

                    except Exception as e:
                        print(f"An unexpected error occurred: {e}")


            # print(total_text)

        # if debug:
        #     print("识别结果 :", res)
        #     # print("识别结果 :", res['text'])
            # print("timestamp :", res['timestamp'])
            # print("识别结果 :", res['text'])
            # print(res.keys())
        

        
        
        
        # list_of_text_and_expression = remove_tag(recognized_text)
        # if debug:
        #    print(list_of_text_and_expression)

        # length_of_text = len(list_of_text_and_expression)
        # for text, expression in list_of_text_and_expression:



        # 分析语调

        # # 估计节奏

        # mfcc = extract_mfcc(y, sr)
    
        # if debug:
        #     print(file_name, length_of_text, speech_rate, pitch_mean, pitch_std, pause, tempo, mfcc)

        # try:
        #     with open(file_name, 'w', encoding='utf-8') as f:
        #         f.write(f"{length_of_text},{speech_rate},{pitch_mean},{pitch_std},{pause},{tempo},{np.array2string(mfcc, separator=',')}\n")
        #         for text, expression in list_of_text_and_expression:
        #             f.write(f"{expression}|{text}\n")

                

        # except Exception as e:
        #     print(f"An unexpected error occurred: {e}")

        # for file in files:
        #     with wave.open(file, 'rb') as f:
        #         # 获取音频文件的采样率
        #         audio_sr = f.getframerate()
                
        #         # 获取音频文件中的帧数（即音频数据的总长度）
        #         n_frames = f.getnframes()
                
        #         # 读取音频数据
        #         audio_bytes = f.readframes(n_frames)

        #         file_io = np.frombuffer(audio_bytes, dtype=np.int16)

        #         print(file_io)
        #         # file_io = np.frombuffer(audio_bytes, dtype=np.float32)

        #         # if isinstance(file_io, np.ndarray):
        #         #     # print(f'fs:{audio_sr}, input_wav: {file_io}')
        #         #     fs, input_wav = audio_sr, file_io
        #         #     input_wav = input_wav.astype(np.float32) / np.iinfo(np.int16).max
        #         #     if len(input_wav.shape) > 1:
        #         #         input_wav = input_wav.mean(-1)
        #         #     if fs != 16000:
        #         #         print(f"audio_fs: {fs}")
        #         #         resampler = torchaudio.transforms.Resample(fs, 16000)
        #         #         input_wav_t = torch.from_numpy(input_wav).to(torch.float32)
        #         #         file_io = resampler(input_wav_t[None, :])[0, :].numpy()
        #         # file_io = convert_audio_to_wav(audio_bytes, audio_sr) # Convert input to 16kHz WAV

        #         # print(file_io)
        #         # if not file_io.any():
        #         #     return {"error": "Failed to process audio file"}

        #         file_name = os.path.basename(file)
        #         print(f"file: {file_name}")

        #         file_io = file_io.astype(np.float32)
                
        #         merge_vad = False #False if selected_task == "ASR" else True
        #         print(f"language: 'zh', merge_vad: {merge_vad}")
        #         res = m.generate(input=file_io,
        #                             cache={},
        #                             language="zh",
        #                             # use_itn=True,
        #                             batch_size_s=6, merge_vad=merge_vad)
                
        #         print(res)

        #         for it in res: # res[0] 是第一个音频数据的识别（输入是一个列表输出亦是）
        #             it["raw_text"] = it["text"]
        #             it["clean_text"] = re.sub(regex, "", it["text"], 0, re.MULTILINE)
        #             it["text"] = rich_transcription_postprocess(it["raw_text"])

        #         # recognized_text.append(res[0]["text"])
        #         # recognized_raw_text.append(res[0]["raw_text"])
            
        #         avg_pitch, tempo = analyze_pitch_and_tempo(file_io, audio_fs)
        #         # avg_pitch, tempo = f'{avg_pitch:.3f}', f'{tempo:.3f}'

        #         pause = analyze_rhythm_and_pauses(file_io, audio_fs)
        #         # pause = f'{pause:.3f}'

        #         with io.BytesIO() as buffer:
        #             if isinstance(file_io, np.ndarray):
        #                 file_io = torch.from_numpy(file_io)
        #             # 确保 file_io 是一个 2D 张量
        #             if file_io.ndim == 1:
        #                 # 如果是单声道音频，添加一个新维度以使其成为 2D 张量
        #                 file_io = file_io.unsqueeze(0)  # 现在形状为 [样本数, 1]
        #             elif file_io.ndim == 2:
        #                 # 如果已经是 2D 的，则无需更改
        #                 pass
        #             else:
        #                 raise ValueError("file_io 应该是 1D 或 2D 的张量")

        #             torchaudio.save(os.path.join(audio_dir, file_name), file_io, audio_fs)
        #             buffer.seek(0)
        #             audios.append(buffer.read())
            
        #         # pitches.append(avg_pitch)
        #         # tempos.append(tempo)
        #         # pauses.append(pause)
        #         # audios.append(data)

        #         # for i, file in enumerate(tqdm.tqdm(files)):
        #         print(file.split('/')[-1], recognized_text, tempo, avg_pitch, pause, res[0]["raw_text"])
        #         try:
        #             writer.writerow([
        #                 file.split('/')[-1], 
        #                 res[0]['text'], 
        #                 "{:.3f}".format(tempo),  # 格式化为三位小数
        #                 "{:.3f}".format(avg_pitch),  # 格式化为三位小数
        #                 "{:.3f}".format(pause),   # 格式化为三位小数
        #                 res[0]['raw_text']
        #             ])
        #         # except IndexError as e:
        #         #     print(f"Error writing row {i}: {e}")
        #         except Exception as e:
        #             print(f"An unexpected error occurred: {e}")

def get_random_poem(files_path: str, score_dir: str):
    global selected_poem
    # 获取files_path和score_dir目录下所有文件的列表
    wav_files = [f for f in os.listdir(files_path) if f.endswith('.wav')]
    txt_files = [f for f in os.listdir(score_dir) if f.endswith('.txt')]

    # 确保.wav和.txt文件名匹配
    matched_files = [f for f in wav_files if f.replace('.wav', '.txt') in txt_files]

    # 随机选择一个匹配的文件
    selected_poem = random.choice(matched_files)

    # 读取.wav和.txt文件
    wav_file_path = os.path.join(files_path, selected_poem)
    txt_file_path = os.path.join(score_dir, selected_poem.replace('.wav', '.txt'))

    # 读取文件内容
    with open(txt_file_path, 'r', encoding='utf-8') as file:
        txt_content = file.read()

    # 返回文件路径，而不是文件内容
    return txt_content, wav_file_path
    

if __name__ == "__main__":
    # debug_code = input("是否显示输出值？ (y/n):").lower()
    debug_code = "n"

    if debug_code != "" and debug_code[0] == "y":
        debug = True

    mode_list = ["30s", "1min", "2min", "long"]
    
    # mode = input("输入游戏时长 (30s | 1min | 2min | long): ").lower()
    mode = "2min"

    if mode not in mode_list:
        print("输入错误的时长选项")
        exit(0)
    
    game_mode_list = ["split", "full"]

    # game_mode = input("输入模式(split | full):").lower()
    game_mode = "full"

    if game_mode not in game_mode_list:
        print("输入错误的游戏模式选项")
        exit(0)


    audio_directory = os.path.join("/home/jkho80/python_project/SenseVoice/saved_audios/saved_audio_" + mode)
    # target_dir = "/home/jkho80/python_project/SenseVoice/audio_file_2min"
    score_dir = os.path.join("/home/jkho80/python_project/SenseVoice/" + game_mode + "_mode", "score_" + mode)
    
    # files_path = [os.path.join(audio_directory, file) for file in os.listdir(audio_directory) if file.endswith('.wav') or file.endswith('.mp3')]
    files_path = [os.path.join(audio_directory, file) for file in os.listdir(audio_directory) if file.endswith('.wav')]

    # score_code = input("是否进行评分？(y/n): ").lower()
    score_code = "y"
    if score_code != "" and score_code[0] == "y":
        if debug:
            print('音频文件名：')
            for idx, item in enumerate(files_path):
                print(f"{idx + 1}. {item}")

        get_score_and_save(files_path, score_dir, game_mode)


    
    # get_rand_code = input("是否进行随机获取测试？(y/n): ")
    get_rand_code = "y"
    if get_rand_code != "" and get_rand_code[0].lower() == "y":
        sound_score_and_data, audio_path = get_random_poem(audio_directory, score_dir)
        
        if debug:
            print("sound_score_and_data :\n", sound_score_and_data)
            print("audio_path :", audio_path)
        # print("selected_poem :", selected_poem)





# def analyze_pitch_and_tempo(audio_data: Tensor, sample_rate: int):
#     """Analyze the pitch and tempo of an audio file using librosa."""
#     # Convert tensor to numpy array
#     waveform = audio_data.numpy()

#     # Extract pitch using librosa.pyin (more robust than piptrack)
#     pitches, _, _ = librosa.pyin(waveform, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'), sr=sample_rate)
#     avg_pitch = np.nanmean(pitches)  # Ignore NaN values

#     # Estimate tempo using energy envelope (simpler than beat_track)
#     energy = np.abs(waveform)
#     tempo = np.mean(energy) * 100  # Arbitrary scaling for analysis

#     return avg_pitch, tempo

# def analyze_rhythm_and_pauses(audio_data: Tensor, sample_rate: int, silence_threshold: float = 0.01):
#     """Detect rhythm and pauses by analyzing silence duration."""
#     # Convert tensor to numpy array
#     waveform = audio_data.numpy()

#     # Detect silent regions using librosa
#     non_silent_regions = librosa.effects.split(waveform, top_db=30)  # Adjust top_db as needed
#     total_silence = sum(end - start for start, end in non_silent_regions)
#     pause_ratio = total_silence / len(waveform)

#     return pause_ratio

# def get_score_and_save(files, audio_dir):
#     audios = []
#     recognized_text = []
#     recognized_raw_text = []
#     tempos = []
#     pitches = []
#     pauses = []

#     audio_fs = 16000  # Target sample rate

#     item = []

#     for file in files:
#         with open(file, 'rb') as f:
#             file_bytes = f.read()

#         file_io = convert_audio_to_wav(file_bytes) # Convert input to 16kHz WAV
#         # file_io = convert_audio_to_wav(file) # Convert input to 16kHz WAV
#         if not file_io:
#             return {"error": "Failed to process audio file"}

#         file_name = os.path.basename(file)
        
#         print(f"file: {file_name}")

#         data, _ = torchaudio.load(file_io)  # Load audio as tensor
#         # print(data.size())
        
#         # data = data.mean(0, keepdim=True)  # Convert stereo to mono if needed
#         # data = data.mean(1, keepdim=True)  # Convert stereo to mono if needed
#         # print(data.size())

#         res = m.inference(
#             data_in=data,
#             language="auto",
#             use_itn=False,
#             ban_emo_unk=False,
#             key=file_name,
#             fs=audio_fs,
#             **kwargs,
#         )


        # for it in res[0]: # res[0] 是 返回值, res[0][0] 是第一个音频数据的识别（输入是一个列表输出亦是）
        #     it["raw_text"] = it["text"]
        #     it["clean_text"] = re.sub(regex, "", it["text"], 0, re.MULTILINE)
        #     it["text"] = rich_transcription_postprocess(it["raw_text"])
        
#         recognized_text.append(res[0][0]["text"])
#         recognized_raw_text.append(res[0][0]["raw_text"])

#         avg_pitch, tempo = analyze_pitch_and_tempo(data, audio_fs)
#         # avg_pitch, tempo = f'{avg_pitch:.3f}', f'{tempo:.3f}'

#         pause = analyze_rhythm_and_pauses(data, audio_fs)
#         # pause = f'{pause:.3f}'

#         with io.BytesIO() as buffer:
#             torchaudio.save(os.path.join(audio_dir, file_name), data, audio_fs)
#             buffer.seek(0)
#             audios.append(buffer.read())
    
#         pitches.append(avg_pitch)
#         tempos.append(tempo)
#         pauses.append(pause)
#         audios.append(data)

#         file_io.close()

#     with open('/home/jkho80/python_project/SenseVoice/scores.csv', 'w', newline='') as csvfile:
#         writer = csv.writer(csvfile)
#         writer.writerow(['filename', 'text', 'tempo', 'pitch', 'pause', 'raw_text'])
#         for i, file in enumerate(tqdm.tqdm(files)):
#             # print(file.split('/')[-1], recognized_text[i], tempos[i], pitches[i], pauses[i], recognized_raw_text[i])
#             try:
#                 writer.writerow([
#                     file.split('/')[-1], 
#                     recognized_text[i], 
#                     "{:.3f}".format(tempos[i]),  # 格式化为三位小数
#                     "{:.3f}".format(pitches[i]),  # 格式化为三位小数
#                     "{:.3f}".format(pauses[i]),   # 格式化为三位小数
#                     recognized_raw_text[i]
#                 ])
#             except IndexError as e:
#                 print(f"Error writing row {i}: {e}")
#             except Exception as e:
#                 print(f"An unexpected error occurred: {e}")