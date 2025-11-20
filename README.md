# 🎸 FretMaster - 指板大师

[English](#english) | [中文](#中文)

---

## 中文

### 📖 项目简介

**FretMaster（指板大师）** 是一个交互式的吉他/贝斯指板学习应用，帮助音乐爱好者快速掌握指板上的音符位置。通过多种练习模式和游戏化设计，让学习变得有趣且高效。

### ✨ 主要功能

- 🎯 **练习模式** - 系统化学习指板上每个音符的位置
- 🏆 **挑战模式** - 限时答题游戏，测试你的反应速度和准确度
- 🎵 **音效支持** - 点击播放音符，训练听音辨位能力
- 🥁 **节拍器** - 内置节拍器，辅助节奏练习（40-200 BPM）
- 🔄 **自动模式** - 自动切换音符，适合持续练习
- 🎸 **多乐器支持** - 吉他（6 弦）和贝斯（4 弦）标准调弦
- 📊 **难度分级** - 初级/中级/高级三种难度，循序渐进
- 🌐 **双语界面** - 中文/英文界面切换
- ♯♭ **升降号切换** - 支持升号（#）和降号（♭）记谱法

### 🚀 快速开始

#### 环境要求

- Node.js 18.0 或更高版本

#### 安装步骤

1. 克隆项目

```bash
git clone <repository-url>
cd fretmaster-ai
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 打开浏览器访问 `http://localhost:5173`

#### 构建生产版本

```bash
npm run build
npm run preview
```

### 🎮 使用说明

#### 练习模式

1. 选择乐器（吉他/贝斯）和难度级别
2. 查看屏幕上显示的目标音符
3. 点击"显示位置"查看该音符在指板上的所有位置
4. 点击音符旁的播放按钮可听到音高
5. 开启"自动模式"可自动循环显示音符

#### 挑战模式

1. 点击"挑战模式"按钮开始游戏
2. 在限定时间内（默认 60 秒）点击指板上的正确位置
3. 正确得分，错误不扣分但会震动提示
4. 游戏结束查看你的得分

#### 节拍器

- 点击节拍器按钮开启
- 调整 BPM（每分钟节拍数）
- 第一拍为重音，配合视觉指示点

### 🛠️ 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **UI 图标**: Lucide React
- **音频**: Web Audio API
- **样式**: Tailwind CSS (utility-first)

### 📁 项目结构

```
fretmaster-ai/
├── components/         # React 组件
│   └── Fretboard.tsx  # 指板可视化组件
├── services/          # 业务逻辑服务
│   ├── audioService.ts    # 音频播放服务
│   └── musicLogic.ts      # 音乐理论逻辑
├── App.tsx           # 主应用组件
├── constants.ts      # 常量配置
├── types.ts          # TypeScript 类型定义
├── translations.ts   # 多语言翻译
└── index.tsx         # 应用入口
```

### 📝 开发说明

- 支持标准吉他调弦：E-A-D-G-B-E
- 支持标准贝斯调弦：E-A-D-G
- 指板范围可根据难度自动调整（5 品/12 品/24 品）
- 使用 Web Audio API 生成音符音效

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 📄 许可证

MIT License

---

## English

### 📖 About

**FretMaster** is an interactive guitar/bass fretboard learning application that helps music enthusiasts quickly master note positions on the fretboard. Through various practice modes and gamified design, learning becomes fun and efficient.

### ✨ Key Features

- 🎯 **Practice Mode** - Systematically learn the position of each note on the fretboard
- 🏆 **Challenge Mode** - Timed quiz game to test your reaction speed and accuracy
- 🎵 **Sound Support** - Click to play notes, train your ear-to-position recognition
- 🥁 **Metronome** - Built-in metronome for rhythm practice (40-200 BPM)
- 🔄 **Auto Mode** - Automatically cycle through notes for continuous practice
- 🎸 **Multi-Instrument Support** - Guitar (6-string) and Bass (4-string) standard tuning
- 📊 **Difficulty Levels** - Beginner/Intermediate/Advanced for progressive learning
- 🌐 **Bilingual Interface** - Switch between Chinese/English
- ♯♭ **Sharp/Flat Toggle** - Support for both # and ♭ notation

### 🚀 Quick Start

#### Prerequisites

- Node.js 18.0 or higher

#### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd fretmaster-ai
```

2. Install dependencies

```bash
npm install
```

3. Start development server

```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

#### Build for Production

```bash
npm run build
npm run preview
```

### 🎮 How to Use

#### Practice Mode

1. Select instrument (Guitar/Bass) and difficulty level
2. View the target note displayed on screen
3. Click "Reveal Position" to see all positions of that note on the fretboard
4. Click the play button next to the note to hear its pitch
5. Enable "Auto Mode" for automatic note cycling

#### Challenge Mode

1. Click "Challenge Mode" button to start the game
2. Click the correct positions on the fretboard within the time limit (default 60s)
3. Correct answers earn points, wrong answers trigger a shake animation
4. View your score when the game ends

#### Metronome

- Click metronome button to activate
- Adjust BPM (beats per minute)
- First beat is accented, with visual beat indicators

### 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **UI Icons**: Lucide React
- **Audio**: Web Audio API
- **Styling**: Tailwind CSS (utility-first)

### 📁 Project Structure

```
fretmaster-ai/
├── components/         # React components
│   └── Fretboard.tsx  # Fretboard visualization component
├── services/          # Business logic services
│   ├── audioService.ts    # Audio playback service
│   └── musicLogic.ts      # Music theory logic
├── App.tsx           # Main application component
├── constants.ts      # Configuration constants
├── types.ts          # TypeScript type definitions
├── translations.ts   # Internationalization
└── index.tsx         # Application entry point
```

### 📝 Development Notes

- Supports standard guitar tuning: E-A-D-G-B-E
- Supports standard bass tuning: E-A-D-G
- Fretboard range automatically adjusts based on difficulty (5/12/24 frets)
- Uses Web Audio API to generate note sounds

### 🤝 Contributing

Issues and Pull Requests are welcome!

### 📄 License

MIT License
