import os
import requests
import pandas as pd
from pydub import AudioSegment

script_dir = os.path.dirname(os.path.abspath(__file__))

unstandart_audio_dir = os.path.join(script_dir, 'unstandart_audio')
unstandart_audio_txt_dir = os.path.join(script_dir, 'unstandart_audio_txt')
# 确保目标目录存在
os.makedirs(unstandart_audio_dir, exist_ok=True)
os.makedirs(unstandart_audio_txt_dir, exist_ok=True)

# 读取CSV文件
df = pd.read_csv('gushiwen_poems.csv')

# df = df.iloc[0:2]

def binary_to_audio(binary_data_file, output_file):
        # 使用pydub读取临时文件
        audio_segment = AudioSegment.from_file(binary_data_file)

        # 删除临时文件
        os.remove(binary_data_file)

        # 将音频保存为目标文件
        audio_segment.export(output_file, format="wav")

# 遍历每一行的audio_url
for index, row in df.iterrows():
    audio_name = row['title']
    audio_content = row['content']
    audio_url = row['audio_url']
    if pd.isna(audio_url):  # 跳过空URL
        continue

    try:
        # 从URL获取文件名
        filename = os.path.basename(audio_name)
        save_path = os.path.join(unstandart_audio_dir, audio_name + '.wav')
        txt_save_path = os.path.join(unstandart_audio_txt_dir, audio_name + '.txt')

        
        # # 下载文件
        # response = requests.get(audio_url, stream=True)
        # response.raise_for_status()  # 检查请求是否成功

        # music = response.content
        
        # with open("temp.mp3", 'wb') as f:
        #     f.write(music)
        #     f.flush()

        with open(txt_save_path, 'w', encoding='utf-8') as f:
            f.write(audio_content)
            f.close()

        # binary_to_audio("temp.mp3", save_path)
        
        print(f"成功下载: {save_path}")

    except Exception as e:
        print(f"下载失败 {audio_url}: {str(e)}")

print("所有文件处理完成")
