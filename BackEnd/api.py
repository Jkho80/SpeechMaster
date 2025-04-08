# Set the device with environment, default is cuda:0

import os, re
from fastapi import FastAPI, File, Form, UploadFile, Request
from fastapi.responses import HTMLResponse, FileResponse, Response
from typing_extensions import Annotated
from typing import List
from funasr import AutoModel
from enum import Enum
import torchaudio
import io
from io import BytesIO
import uvicorn
import logging
import librosa
import numpy as np
import difflib
from pydub import AudioSegment
import random
from random import choice
import soundfile as sf

import ffmpeg
import torch
from torch import Tensor
import time

script_dir = os.path.dirname(os.path.abspath(__file__))
Debug = False


AudioSegment.ffmpeg = "/usr/bin/ffmpeg"
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



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

# ASR 模型
m = AutoModel(model=asr_model_path,
                  model_revision=asr_model_revision,
                  vad_model=vad_model_path,
                  vad_model_revision=vad_model_revision,
                  vad_kwargs={"max_single_segment_time": 10000},
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

regex = r"<\|.*\|>"
from fastapi.middleware.cors import CORSMiddleware 
app = FastAPI()
app.add_middleware(CORSMiddleware, 
    allow_origins=["*"], # 允许所有域名，也可以指定特定的域名 
    allow_credentials=True, # 允许发送cookie
    allow_methods=["*"], # 允许所有HTTP方法 
    allow_headers=["*"], # 允许所有请求头 
)

rand_max_idx = 1e8

audio_30s_files_dir = os.listdir(os.path.join(script_dir, "saved_audios", "saved_audio_30s"))
audio_1min_files_dir = os.listdir(os.path.join(script_dir, "saved_audios", "saved_audio_1min"))
audio_2min_files_dir = os.listdir(os.path.join(script_dir, "saved_audios", "saved_audio_2min"))
audio_long_files_dir = os.listdir(os.path.join(script_dir, "saved_audios", "saved_audio_long"))

split_30s_score_dir = os.listdir(os.path.join(script_dir, "split_mode", "score_30s"))
split_1min_score_dir = os.listdir(os.path.join(script_dir, "split_mode", "score_1min"))
split_2min_score_dir = os.listdir(os.path.join(script_dir, "split_mode", "score_2min"))
split_long_score_dir = os.listdir(os.path.join(script_dir, "split_mode", "score_long"))

full_30s_score_dir = os.listdir(os.path.join(script_dir, "full_mode", "score_30s"))
full_1min_score_dir = os.listdir(os.path.join(script_dir, "full_mode", "score_1min"))
full_2min_score_dir = os.listdir(os.path.join(script_dir, "full_mode", "score_2min"))
full_long_score_dir = os.listdir(os.path.join(script_dir, "full_mode", "score_long"))

matched_files_split_30s = [f for f in audio_30s_files_dir if f.replace('.wav', '.txt') in split_30s_score_dir]
matched_files_full_30s = [f for f in audio_30s_files_dir if f.replace('.wav', '.txt') in full_30s_score_dir]
matched_files_split_1min = [f for f in audio_1min_files_dir if f.replace('.wav', '.txt') in split_1min_score_dir]
matched_files_full_1min = [f for f in audio_1min_files_dir if f.replace('.wav', '.txt') in full_1min_score_dir]
matched_files_split_2min = [f for f in audio_2min_files_dir if f.replace('.wav', '.txt') in split_2min_score_dir]
matched_files_full_2min = [f for f in audio_2min_files_dir if f.replace('.wav', '.txt') in full_2min_score_dir]
matched_files_split_long = [f for f in audio_long_files_dir if f.replace('.wav', '.txt') in split_long_score_dir]
matched_files_full_long = [f for f in audio_long_files_dir if f.replace('.wav', '.txt') in full_long_score_dir]

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset=utf-8>
            <title>Api information</title>
        </head>
        <body>
            <a href='./docs'>Documents of API</a>
        </body>
    </html>
    """


def convert_audio_to_wav(input_bytes: bytes) -> BytesIO:
    """Converts input audio (MP3/WAV/etc.) to WAV format with PCM_S16LE codec and 16kHz sample rate."""
    process = ffmpeg.input(input_bytes) \
        .output("pipe:0", format="wav", acodec="pcm_s16le", ar="16000") \
        .run_async(pipe_stdin=True, pipe_stdout=True, pipe_stderr=True)
    
    output_bytes, _ = process.communicate(input_bytes)
    return BytesIO(output_bytes)


def clean_text(text: str) -> str:
    num = len(text)
    i = 0
    while i < num:
        if text[i] in ['，', '。', '？']:
            text = text[:i] + text[i+1:]
            num -= 1
        else:
            i += 1

    if Debug:
        print(f"clean_text : {text}")

    return text

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

    uneffect_symbol = {' ', '。', '，', '？', '\n', '、'}
    uneffect_symbol_cnt = sum(1 for ch in text if ch not in uneffect_symbol)

    speech_duration = duration - total_pauses_time # 转换为秒

    speech_rate = (len(text) - uneffect_symbol_cnt) / speech_duration
    return speech_rate


# 估计节奏
def estimate_tempo(y, sr, start, end):
    start_idx = int(sr * start)
    end_idx = int(sr * end)
    tempo = librosa.beat.beat_track(y=y[start_idx:end_idx], sr=sr)[0]
    return tempo


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


def get_score(asr_result: dict, audio_byte: bytes, game_mode: str, time_mode: str, file_name: str, index: int):
    y, sr = librosa.load(audio_byte, sr=16000)

    with open(os.path.join(script_dir, game_mode + "_mode", "score_" + time_mode, file_name[:-4] + ".txt"), encoding="utf-8") as f:
        score_file = f.read()


    score_file = list(score_file.strip().split('\n'))

    text = score_file[index * 3]
    std_start_time, std_end_time = map(float, score_file[index * 3 + 1].split(', '))
    std_audio_duration = std_end_time - std_start_time

    std_pause, std_total_pause_time, std_speech_rate, std_tempo, std_pitch_mean, std_pitch_std = map(float, score_file[index * 3 + 2].split(', '))


    audio_duration = (asr_result['sentence_info'][-1]['end'] - asr_result['sentence_info'][0]['start']) / 1000
    pause, total_pause_time = detect_pauses(asr_result['timestamp'])

    if Debug:
        print(f"User Text : {asr_result['text']}")
        print(f"Standart Audio Text : {text}")
        print(f"User Audio Duration : {audio_duration}")
        print(f"Standart Audio Duration : {std_audio_duration}")
        
    # 检测停顿 单位 ms|毫秒

    # 计算语速
    speech_rate = calculate_speech_rate(asr_result['text'], total_pause_time, audio_duration)

    tempo = estimate_tempo(y, sr, 0, audio_duration)

    pitch_mean, pitch_std = analyze_intonation(y, sr, 0, audio_duration)
    
    cleared_text = clean_text(text)
    cleared_user_text = clean_text(asr_result['text'])

    user_text_diff = text_similiarity(cleared_user_text, cleared_text)

    if Debug:
        print(f"User Audio Data")
        print(f"Speech Rate : {speech_rate}")
        print(f"Tempo : {tempo}")
        print(f"Pitch Mean : {pitch_mean}")
        print(f"Pitch Std : {pitch_std}")
        print(f"User Same text len : {user_text_diff}")
        
    text_score: float = calculate_score(user_text_diff, len(cleared_text))
    duration_score: float = calculate_score(asr_result["timestamp"][-1][-1] / 1000, std_audio_duration)
    pause_score: float = calculate_score(pause + 5, std_pause + 5) * 0.4 + calculate_score(total_pause_time, std_total_pause_time) * 0.3 + calculate_score(speech_rate, std_speech_rate) * 0.3
    tempo_score: float = calculate_score(tempo, std_tempo)
    pitch_score: float = calculate_score(pitch_mean, std_pitch_mean) * 0.5 + calculate_score(pitch_std, std_pitch_std) * 0.5

    return text_score, duration_score, pause_score, tempo_score, pitch_score

def text_similiarity(user_text, score_text) -> int:
    len_b = len(score_text)

    dp = [0]*(len_b + 1)

    for i in user_text:
        pre = 0
        for idx, j in enumerate(score_text):
            tmp = dp[idx + 1]
            dp[idx + 1] = pre + 1 if i == j else max(dp[idx + 1], dp[idx]) 
            pre = tmp

    return dp[-1]



def calculate_score(value, standard) -> int:
    difference = abs(value - standard)
    # difference_percentage
    if standard != 0:
        difference_percentage = min(difference / standard, 0.7) * 100
    elif standard == 0:
        difference_percentage = (standard - difference) * 50

    if difference_percentage <= 10:
        return 100
    elif difference_percentage <= 20:
        return 80
    elif difference_percentage <= 30:
        return 60
    elif difference_percentage <= 45:
        return 40
    elif difference_percentage <= 60:
        return 20
    else:
        return 0
    

def binary_to_audio(binary_data, output_file, rand_int):
    # 将二进制文件写入临时文件
        temp_file = "temp"+ str(rand_int) +".bin"
        while os.path.exists(temp_file):
            i = random.randint(1, rand_max_idx)
            temp_file = "temp" + str(i) + ".bin"
        
        with open(temp_file, "wb") as f:
            f.write(binary_data)

        # 使用pydub读取临时文件
        audio_segment = AudioSegment.from_file(temp_file)

        # 删除临时文件
        os.remove(temp_file)

        # 将音频保存为目标文件
        audio_segment.export(output_file, format="wav")


@app.post("/api/v1/asr")
async def turn_audio_to_text(
    files: Annotated[UploadFile, File(description="wav or mp3 audios in 16KHz")],
    file_name: Annotated[str, Form(description="name of audio file")], 
    game_mode: Annotated[str, Form(description="language of audio content")] = "full",
    time_mode: Annotated[str, Form(description="language of audio content")] = "30s",
    index: Annotated[int, Form(description="language of audio content")] = 0
):
    """
    :param
    files: bytes 需要转换的音频流


    :return
    text: str 音频流转换的文本

    单纯的将音频转换成文本
    """
    logger.info("Received a new transcription request.")

    file_bytes = await files.read()

    if time_mode.lower() == "long":
        time_mode = "2min"

    if Debug:
        print(f"输入: {file_name}, {game_mode}, {time_mode}, {index}")
    
    rand_int = random.randint(1, rand_max_idx)
    rand_name = "test" + str(rand_int) + ".wav"
    
    if Debug:
        print("abcd")

    while os.path.exists(rand_name):
        rand_int = random.randint(1, rand_max_idx)
        rand_name = "test" + str(rand_int) + ".wav"

    binary_to_audio(file_bytes, rand_name, rand_int)

    try:
        res = m.generate(
            input=rand_name, 
            batch_size_s=600, 
            is_final=True, 
            sentence_timestamp=True,
            # data_type=bytes,
            )

        res = res[0]

        
        if res['text'] == "":
            return {
                "text": "",
                "text_score" : 0,
                "duration_score" : 0, 
                "pause_score": 0,
                "tempo_score": 0, 
                "pitch_score": 0
            }

        if Debug:
            print(res)
            print("xyz")

        text_score, duration_score, pause_score, tempo_score, pitch_score = get_score(res, rand_name, game_mode, time_mode, file_name, index)
        
        if Debug:
            print("cdf")


        os.remove(rand_name)

        if Debug:
            print("识别结果",res)
            print(text_score, duration_score, pause_score, tempo_score, pitch_score)
        else:
            logger.info("Transcription completed successfully.")

        return {
                "text": res['text'],
                "text_score" : text_score,
                "duration_score" : duration_score, 
                "pause_score": pause_score,
                "tempo_score": tempo_score, 
                "pitch_score": pitch_score
            }
    
    except (FileNotFoundError, IndexError, AttributeError, TypeError) as e:
        logger.error("An error occurred: %s", e)
        return {
                "text": "",
                "text_score" : 0,
                "duration_score" : 0, 
                "pause_score": 0,
                "tempo_score": 0, 
                "pitch_score": 0
            }
    
    except Exception as e:
        logger.error("An unexpected error occurred: %s", e)
        return {
            "text": "",
            "text_score" : 0,
            "duration_score" : 0, 
            "pause_score": 0,
            "tempo_score": 0, 
            "pitch_score": 0
            }


@app.post("/api/v1/get_random_poem")
async def get_random_poem(request: Request):
    """
    :param 
    game_mode: str 游戏玩法 (full | split)
    time_mode: str 游戏时长 (30s | 1min | 2min | long)

    :return
    txt_content: str 音频的文本数据 
    第一行是文本, 第二行是时长(开始和结束时间 (s|秒)), 第三行是该音频的各类指标(前端不必理会)
    第四行还是文本, 以此类推
    注; game_mode==full 的情况下只有一行文本, 第二行也只有一个时间 (s|秒)

    file_name: str 该古诗的文件名

    // 通过返回的 file_name 调用 POST /api/v1/get_audio_bytes 来获取以下返回值
    // wav_file_bytes: bytes 完整的音频流
    // 前端需要根据txt_content[1:end:3] 来截取对应的声音起始终止时间
    """
    data = await request.json()
    game_mode = data.get('game_mode').lower()
    time_mode = data.get('time_mode').lower()

    if time_mode == "long":
        time_mode = "2min"
    
    logger.info(f"get_random_poem got params: {game_mode} and {time_mode}")

    # files_path = os.path.join(script_dir, "saved_audios", "saved_audio_" + time_mode)
    score_dir = os.path.join(script_dir, game_mode + "_mode", "score_" + time_mode)
    # global selected_poem
    # # 获取files_path和score_dir目录下所有文件的列表
    # wav_files = [f for f in os.listdir(files_path) if f.endswith('.wav')]
    # txt_files = [f for f in os.listdir(score_dir) if f.endswith('.txt')]

    # 确保.wav和.txt文件名匹配
    # matched_files = [f for f in wav_files if f.replace('.wav', '.txt') in txt_files]
    
    if game_mode == "split":
        if time_mode == "30s":
            matched_files = choice(matched_files_split_30s)
        elif time_mode == "1min":
            matched_files = choice(matched_files_split_1min)
        elif time_mode == "2min":
            matched_files = choice(matched_files_split_2min)
        elif time_mode == "long":
            matched_files = choice(matched_files_split_2min)
        
    elif game_mode == "full":
        if time_mode == "30s":
            matched_files = choice(matched_files_full_30s)
        elif time_mode == "1min":
            matched_files = choice(matched_files_full_1min)
        elif time_mode == "2min":
            matched_files = choice(matched_files_full_2min)
        elif time_mode == "long":
            matched_files = choice(matched_files_full_2min)

    # 随机选择一个匹配的文件
    selected_poem = matched_files

    # 读取.wav和.txt文件
    # wav_file_path = os.path.join(files_path, selected_poem)
    txt_file_path = os.path.join(score_dir, selected_poem.replace('.wav', '.txt'))

    # 读取文件内容
    with open(txt_file_path, 'r', encoding='utf-8') as file:
        txt_content = file.read()

    return {
        "txt_content": txt_content,
        "file_name": selected_poem
    }

@app.post("/api/v1/get_audio_bytes")
async def get_audio_bytes_by_filename(request: Request):
    """
    :param 
    request: Request({
        time_mode: str 游戏时长 (30s | 1min | 2min | long)
        file_name: str 古诗的文件名, 用于查看音频的评分
    })

    :return
    wav_file_bytes: bytes 完整的音频流
    前端需要根据txt_content[1:end:3] 来截取对应的声音起始终止时间
    """
    data = await request.json()
    time_mode = data.get('time_mode').lower()
    file_name = data.get('file_name')

    if time_mode == "long":
        time_mode = "2min"

    wav_file_path = os.path.join(script_dir, "saved_audios", "saved_audio_" + time_mode, file_name)

    with open(wav_file_path, 'rb') as wav_file:
        wav_file_bytes = wav_file.read()

    return Response(content=wav_file_bytes, media_type="audio/wav")


if __name__ == "__main__":
    debug_code = input("是否进入调式模式？(y/n):")
    # debug_code = True
    if debug_code.startswith('y'):
        Debug = True

    uvicorn.run("api:app", host="0.0.0.0", port=3090, reload=True)