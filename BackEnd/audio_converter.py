import ffmpeg
import os
import shutil
from pydub import AudioSegment
from pydub.utils import mediainfo


script_dir = os.path.dirname(os.path.abspath(__file__))
audio_convert_dir = os.path.join(script_dir, "unstandart_audio")
# audio_wav_directory = os.path.join(script_dir, "saved_audios", "saved_audio_")
audio_wav_directory = os.path.join(script_dir, "uncut_audio", "uncut_audio_")

# 创建分类目录
audio_convert_wav_30s = audio_wav_directory + '30s'
audio_convert_wav_1min = audio_wav_directory + '1min'
audio_convert_wav_2min = audio_wav_directory + '2min'
audio_convert_wav_long = audio_wav_directory + 'long'

files_path = [os.path.join(audio_convert_dir, file) for file in os.listdir(audio_convert_dir) if file.endswith('.wav') or file.endswith('.mp3')]
# files_path = [os.path.join(audio_directory, file) for file in os.listdir(audio_directory) if file.endswith('.wav')]

for idx, item in enumerate(files_path):
    print(f"{idx + 1}. {item}")
    file_name = os.path.basename(item)

    # ffmpeg 获取音频时长
    # probe = ffmpeg.probe(item)
    # audio_duration = float(probe['format']['duration'])

    audio_info = mediainfo(item)
    audio_duration = float(audio_info["duration"])


    # 根据时长分类
    if audio_duration < 30:
        output_dir = audio_convert_wav_30s
    elif audio_duration < 60:
        output_dir = audio_convert_wav_1min
    elif audio_duration < 120:
        output_dir = audio_convert_wav_2min
    else:
        output_dir = audio_convert_wav_long

    output_file_name = os.path.join(output_dir, file_name[:-4] + '.wav')
    print("new file name :", output_file_name)

    process = ffmpeg.input(item).output(output_file_name, format="wav", ar=16000, ac=1, acodec="pcm_s16le").overwrite_output().run()

    os.remove(item)
