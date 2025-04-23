import os
import random
from funasr import AutoModel

script_dir = os.path.dirname(os.path.abspath(__file__))

model_dir = os.path.join(script_dir, 'models')

model = AutoModel(model=model_dir)

wav_file_dir = os.path.join(script_dir, "saved_audios", "saved_audio_mix")
wav_file_name = random.choice(os.listdir(wav_file_dir))

wav_file_path = os.path.join(wav_file_dir, wav_file_name)

res = model.generate(
    input=wav_file_path,
    batch_size_s=1, 
    is_final=True, 
    sentence_timestamp=True,
    )

wav_file_text = os.path.join(script_dir, "unstandart_audio_txt", wav_file_name[:-4] + ".txt")

with open(wav_file_text) as f:
    text = f.read()

print(f"随机获取音频文件: {wav_file_name}")
print(f"随机音频文件内容: {text}")

print()
print(f"模型识别结果: {res[0]}")
