2025012345-02 素材与源码
├── BackEnd  后端文件夹
│   ├── __pycache__ Python  缓存文件目录
│   ├── api.py  后端 API 接口的定义与实现
│   ├── audio_converter.py  音频编码转换
│   ├── crawl.py  获取音频文件 url
│   ├── crawl2.py  获取音频数据
│   ├── cut.py  音频切割
│   ├── data  训练数据文件路径
│   ├── data_preprocess.py  训练数据准备程序
│   ├── demo.py  微调后的模型使用示例  
│   ├── deepspeed_conf  训练数据参数
│   ├── download_model.py  下载模型
│   ├── environtment.yml  conda 环境列表
│   ├── finetune.sh  微调脚本
│   ├── full_mode  full 模式下的音频数据
│   ├── gushiwen_poems.csv  crawl.py 获取的音频文件信息
│   ├── models 微调后模型权重
│   ├── pingfen.py  评分标准数据
│   ├── req.txt  python 环境列表
│   ├── saved_audios  无开头音频数据
│   ├── split_mode  split 模式下的音频数据
│   ├── train_ds.py  训练脚本
│   ├── uncut_audio  有标题和开头的音频数据
│   ├── unstandart_audio  未处理的音频
│   └── unstandart_audio_txt  音频的内容
├── FrontEnd  前端文件夹（基于Vue+uni-app的跨端应用）
│   ├── .gitignore  Git排除规则
│   ├── .vscode  VS Code编辑器配置
│   ├── App.vue  应用根组件
│   ├── index.html  主入口HTML文件
│   ├── main.js  Vue初始化入口
│   ├── manifest.json  应用配置清单
│   ├── package-lock.json  依赖树锁定文件
│   ├── package.json  NPM依赖配置
│   ├── pages  页面组件目录
│   ├── pages.json  页面路由配置
│   ├── static  静态资源目录（图片/字体等）
│   ├── tailwind.config.js  TailwindCSS配置
│   ├── uni.scss  全局样式变量
│   ├── uni_modules  uni-app插件市场模块
│   ├── unpackage  编译生成目录
│   └── vue.config.js  Vue编译配置
├── README.md  项目部署文档
└── readme.txt  后端文件夹结构说明