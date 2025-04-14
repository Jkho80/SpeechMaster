import os
script_dir = os.path.dirname(os.path.abspath(__file__))

# saved_audios_30s = os.path.join(script_dir, "saved_audios", "saved_audio_30s")
# saved_audios_1min = os.path.join(script_dir, "saved_audios", "saved_audio_1min")
# saved_audios_2min = os.path.join(script_dir, "saved_audios", "saved_audio_2min")
# saved_audios_long = os.path.join(script_dir, "saved_audios", "saved_audio_long")

# saved_audio_list = os.listdir(saved_audios_30s) + os.listdir(saved_audios_1min) + os.listdir(saved_audios_2min) + os.listdir(saved_audios_long)

saved_audio_mix_dir = os.path.join(script_dir, 'saved_audios', 'saved_audio_mix')
saved_audio_list = sorted(os.listdir(saved_audio_mix_dir))

# print(saved_audio_list[0:30])

audio_txt_dir = os.path.join(script_dir, "unstandart_audio_txt")

audio_txt_list = os.listdir(audio_txt_dir)
audio_txt_list = sorted(audio_txt_list)

# print(audio_txt_list[0:30])

item_index = 1

train_wav_scp = os.path.join(script_dir, "data", "train_wav.scp")
valid_wav_scp = os.path.join(script_dir, "data", "valid_wav.scp")

train_text = os.path.join(script_dir, "data", "train_text.txt")
valid_text = os.path.join(script_dir, "data", "valid_text.txt")

train_ratio = 0.8
validation_ratio = 0.2

# 确定训练和验证数据的数量
num_train = int(len(saved_audio_list) * train_ratio)
num_validation = len(saved_audio_list) - num_train

# 分割文件名列表
train_audio_files = saved_audio_list[:num_train]
validation_audio_files = saved_audio_list[num_train:]

train_txt_files = audio_txt_list[:num_train]
validation_txt_files = audio_txt_list[num_train:]

# 创建SCP文件和JSONL文件
def write_scp_file(scp_path, file_list):
    with open(scp_path, 'w') as scp_file:
        for file_name in file_list:
            scp_file.write(f"{file_name[:-4]} {os.path.join(script_dir, 'saved_audios', 'saved_audio_mix',file_name)}\n")

def write_txt_file(jsonl_path, txt_list):
    with open(jsonl_path, 'w') as jsonl_file:
        for file_name in txt_list:
            jsonl_file.write(f"{(file_name[:-4])} {os.path.join(audio_txt_dir, file_name)}\n")

# 写入训练SCP文件
write_scp_file(train_wav_scp, train_audio_files)

# # 写入验证SCP文件
write_scp_file(valid_wav_scp, validation_audio_files)

# # 写入训练JSONL文件
write_txt_file(train_text, train_txt_files)

# # 写入验证JSONL文件
write_txt_file(valid_text, validation_txt_files)
