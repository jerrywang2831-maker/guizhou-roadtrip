# 🚗 武汉→贵州 13天国道自驾环线 · 互动地图

一条从武汉出发、13天环绕贵州黔西南+黔北的国道自驾路线互动地图，集景点、美食、住宿于一体。

**5人同行 · 5月30日出发 · 去程湘西/凤凰 · 回程恩施 · 国道为主**

## ✨ 功能

- 🗺️ **高德地图交互**：完整行车路线，可缩放、拖动、点击
- 📋 **14天行程总览**：点击任一天自动定位到对应地点
- 🏞 **景点+美食+住宿**：每天详细列出，点击查看
- ⌨️ **键盘导航**：← → 方向键切换上/下一天
- 📱 **响应式设计**：桌面端左右分栏，移动端自动适配

## 🚀 快速开始

### 1. 获取高德地图 API Key

访问 [高德开放平台](https://console.amap.com/dev/key/app) 免费申请一个 **JS API** 的 Key：

1. 注册/登录高德开放平台
2. 创建应用 → 添加 Key
3. 服务平台选择「Web端(JS API)」
4. 复制生成的 Key

### 2. 配置 Key

打开 `index.html`，将第 232 行左右的 `YOUR_AMAP_KEY_HERE` 替换为你的 Key：

```javascript
const AMAP_KEY = 'YOUR_AMAP_KEY_HERE';  // ← 改成你的 Key
```

### 3. 打开

用浏览器打开 `index.html` 即可使用。

## 🌐 发布到 GitHub Pages

```bash
# 1. 创建 GitHub 仓库
#    在 GitHub 上新建仓库，例如 guizhou-roadtrip

# 2. 推送代码
git init
git add index.html README.md
git commit -m "Add interactive Guizhou roadtrip map"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/guizhou-roadtrip.git
git push -u origin main

# 3. 启用 GitHub Pages
#    仓库 Settings → Pages → Source: main branch → Save
#    稍后访问 https://YOUR_USERNAME.github.io/guizhou-roadtrip/
```

## 📋 行程总览

| 日期 | 行程 | 路线 | 里程 | 亮点 |
|------|------|------|------|------|
| Day 1 | 武汉 → 常德 | G318→G207→G319 | 430km | 柳叶湖、常德诗墙 |
| Day 2 | 常德 → 凤凰古城 | G319→G209 | 280km | 沱江夜景、吊脚楼 |
| Day 3 | 凤凰 → 梵净山 | G354 | 150km | 沱江晨雾、出发梵净山 |
| Day 4 | 梵净山全天 | — | — | 红云金顶、蘑菇石 |
| Day 5 | 梵净山 → 西江苗寨 | G320国道 | 270km | 千户苗寨全景日落 |
| Day 6 | 西江 → 贵阳 | G320国道 | 230km | 苗寨晨雾、贵阳美食 |
| Day 7 | 贵阳 → 黄果树 | G320贵黄公路 | 140km | 黄果树大瀑布 |
| Day 8 | 龙宫 + 云峰屯堡 | X007→S209 | 55km | 水溶洞、明代屯堡 |
| Day 9 | 安顺 → 织金洞 → 遵义 | S209→G321→G326 | 300km | 溶洞之王、捞沙巷 |
| Day 10 | 遵义 → 茅台 → 赤水 | G326→G212 | 220km | 茅台酒香、赤水夜景 |
| Day 11 | 赤水丹霞全天 | — | — | 十丈洞瀑布、佛光岩 |
| Day 12 | 赤水 → 恩施 | G546→G318→G209 | 520km | 恩施土司城 |
| Day 13 | 恩施 → 武汉 | G318→G50 | 530km | 四渡河大桥、回家 |

**全程约 2930km · 预算约 ¥3,200/人**

## 🛠 技术栈

- 高德地图 JS API v2.0
- 纯 HTML/CSS/JS（零依赖、零构建）
- GitHub Pages 托管

## 📝 自定义

如需修改行程，编辑 `index.html` 中的以下数据：

- `STOPS`：途经地点及其坐标
- `SEGMENTS`：相邻地点之间的行车段
- `ITINERARY`：每天的详细行程（景点、美食、住宿、提示）
