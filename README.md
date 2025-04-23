# SpeechMaster 古诗朗读评分

诗词作为中华文化集大成之作，向来是华人以及汉语学习者最感兴趣的方面。但出于口音和各方面的问题，拼音，声调和顿挫点等时常困扰着诗歌学习者。 SpeechMaster 是一款专为诗词学习者设计的诗词诵读评分软件。系统内置经典诗词库，通过声波比对与AI语音建模，针对学习者常见的平仄混淆、儿化音缺失、声调偏差、停顿点等问题，提供多维度分析的评分。使用者不断尝试的过程中，不仅能纠正语音，还能解析诗词韵律规则，让学习者在矫正发音过程中同步领悟汉语声韵之美。

使用音频处理库来处理与提取用户语音特征，调用阿里的语音大模型完成语音转写，并开发前端网页调用后端获取诗词库与朗诵范例供用户使用以及录入个人录音。

**开源代码使用说明：**

- 本项目使用了阿里巴巴的开源语音识别模型 _FunASR: paraformer-zh_ 

- 本项目使用了 librosa 用于处理音频数据
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15006942.svg)](https://doi.org/10.5281/zenodo.15006942)

---

首先，需要把这个项目下载下来，在命令行输入
``` shell
git clone https://github.com/Jkho80/SpeechMaster.git
```

> 这个后端是在 wsl 上开发的，或许会有 文件路径 或者 机制 不相互兼容，需要自己修改

打开 BackEnd/ 文件夹，在里面打开命令行输入

``` shell
cd BackEnd
```


通过 pip 或者 conda 创建环境并通过 req.txt 下载 python 相关依赖
``` python
pip install -r req.txt
```
``` python
# 这个代码是一键创建新的conda环境
conda create --name <your_env_name> --file req.txt
```

下面是使用说明，

---

**第一步**. 需要先运行 `download_model.py` 用于下载已训练的 FunASR 的语音识别模型, 可通过直接运行 python 代码 或者 通过命令行类似以下命令来运行
```shell
python ./download_model.py
```
---
**第二步**. 逐步运行 `crawl.py` 和 `crawl2.py` 来获取数据集链接保存至 gushiwen_poems.csv 再将音频和内容下载至 unstandart_audio/ 和 unstandart_audio_txt/，
当然如果你自己有数据集也可以直接将 音频 保存至 unstandart_audio/ 和将 文本内容 保存至 unstandart_audio_txt/

*注：音频文件名和文本文件名必须保持一致 (静夜思.wav, 静夜思.txt)*

---

**第三步**. 运行 `audio_converter.py` 用于转换之前的音频数据编码和采样率 让 FunASR 模型能够有效的识别，同时对音频时长进行识别并分类，最终结果保存至 uncut/

这个类别分为 4 种：
* <= 30秒
* <= 1分钟
* <= 2分钟
* \> 2分钟 
---

**第四步**. 运行 `cut.py` 用于识别开头语句，切剪 开头等不必要的音频并将他们保存至 saved_audios/

---

**第五步**. 运行 `pingfen.py` 用于对 saved_audios/ 数据集进行综合特征提取，之后的评分机制便是与这些 特征 做比较来获取分数

这个类别分为 2 种模式 和 4 种时间类别，分别保存在：
* full_mode/
* split_mode/
---

**第六步**. 运行 `api.py` 用于开启最终的古诗朗读评分后端服务

其中：

## 一、语音识别评分接口 `/api/v1/asr`

### 1. 接口规范
| 属性        | 说明                          |
|-------------|-------------------------------|
| **Endpoint** | `/api/v1/asr`  |
| 请求方法     | POST                          |
| 内容类型     | multipart/form-data           |
| 功能描述     | 音频转文字+多维语音评分        |

### 2. 请求参数
```python
files: UploadFile   # 音频文件（支持wav/mp3，16KHz采样率）
file_name: str      # 标准音频文件名（用于匹配评分基准）
game_mode: str      # 模式选择（"full"|"split"，默认full）
time_mode: str      # 时长类型（"30s"|"1min"|"2min"|"long"，默认30s）
index: int          # 段落索引（split模式时有效）
```

### 3. 返回数据
```
{
  "text": "识别文本",
  "text_score": 85,        // 文本匹配度(0-100)
  "duration_score": 90,    // 时长匹配度 
  "pause_score": 75,       // 停顿质量
  "tempo_score": 80,       // 节奏匹配
  "pitch_score": 88        // 音调匹配
}
```

## 二、诗歌素材获取接口 `/api/v1/get_random_poem`

### 1. 接口规范
| 属性        | 值                          |
|-------------|----------------------------|
| **Endpoint** | `/api/v1/get_random_poem`  |
| 方法        | POST                       |
| 内容类型    | application/json           |
| 功能描述    | 获取随机诗歌素材及评分基准   |

### 2. 请求参数
```python
game_mode: str      # 模式选择（"full"|"split"，默认full）
time_mode: str      # 时长类型（"30s"|"1min"|"2min"|"long"，默认30s）
```

### 3. 返回数据
```
{
  "txt_content": "静夜思\n0.0, 5.2\n85.3, 1.2, 4.5, 120, 210.5, 15.3\n...",
  "file_name": "静夜思.wav"
}
```

## 三、诗歌素材获取接口 `/api/v1/get_audio_bytes`

### 1. 接口规范
| 属性        | 值                          |
|-------------|----------------------------|
| **Endpoint** | `/api/v1/get_audio_bytes`  |
| 方法        | POST                       |
| 内容类型    | application/json           |
| 功能描述    | 获取诗歌音频数据             |

### 2. 请求参数
```python
file_name: str      # 标准音频文件名（用于匹配评分基准）
time_mode: str      # 时长类型（"30s"|"1min"|"2min"|"long"，默认30s）
```

### 3. 返回数据
```
{
  "time_mode": "2min",              // 必填，需与file_name匹配
  "file_name": "静夜思.wav"  // 必填，来自get_random_poem的响应
}
```


---


**第七步**. 运行 `FrontEnd/` 中的代码，通过 npm 或者 yarn 来安装依赖并运行 FrontEnd 前端网页

也可以通过使用 Hbuilder 打开 `FrontEnd/` 文件夹 直接运行

---

## 微调

运行完前面的所有指令后只需要运行 `finetune.sh` 即可开始微调模型，微调完成后便可通过输入模型权重路径使用新的模型进行评分。

> *注：* 需要将 finetune.sh 中的scp文件路径换成用户自己的路径。

```python
import os

script_dir = os.path.dirname(os.path.abspath(__file__))

# 该路径是 finetune.sh 当中的 $output_dir, 可根据需要自己将 $output_dir = './models' 换成自己的路径想要的
model_dir = os.path.join(script_dir, 'models')

model = AutoModel(model=model_dir)

result = model.generate(
    input=input,
    batch_size_s=1, ****
    is_final=True, 
    sentence_timestamp=True,
)
```
