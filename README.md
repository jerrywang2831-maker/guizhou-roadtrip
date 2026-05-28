# 🚗 武汉→贵州 15天自驾环线 · 互动地图

一条从武汉出发、15天环绕贵州黔西南+黔北的自驾路线互动地图，集景点、美食、住宿于一体。支持**国道优先/高速优先**一键切换。

**5人同行 · 5月30日出发 · 去程一天穿越湘西直达凤凰 · 回程恩施方向**

## ✨ 功能

- 🗺️ **高德地图交互**：完整行车路线，可缩放、拖动、点击
- 🔀 **路线切换**：国道优先 / 高速优先一键切换，路线信息动态更新
- 📋 **15天行程总览**：点击任一天自动定位到对应地点
- 🏞 **景点+美食+住宿**：每天详细列出，具体酒店名称
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

| 日期 | 行程 | 亮点 | 住宿 |
|------|------|------|------|
| Day 1 | 武汉 → 凤凰古城 | 一天穿湘西，沱江夜景 | 凤凰等你来·江景客栈 |
| Day 2 | 凤凰古城全天 | 沱江晨雾、沈从文故居 | 凤凰续住 |
| Day 3 | 凤凰 → 梵净山 | 沱江最后的晨雾 | 梵净山梵行客栈 |
| Day 4 | 梵净山全天 | 红云金顶、蘑菇石 | 梵净山续住 |
| Day 5 | 梵净山 → 西江苗寨 | 千户苗寨全景日落 | 西江998客栈 |
| Day 6 | 西江 → 贵阳 | 苗寨晨雾、贵阳小吃 | 7天优品(花果园店) |
| Day 7 | 贵阳全天休整 | 甲秀楼、青岩古镇 | 贵阳续住 |
| Day 8 | 贵阳 → 黄果树 | 黄果树大瀑布 | 黄果树开元颐居 |
| Day 9 | 龙宫 + 云峰屯堡 | 水溶洞、明代屯堡 | 旧州客栈 |
| Day 10 | 安顺 → 织金洞 → 遵义 | 溶洞之王、捞沙巷 | 7天酒店(遵义会址店) |
| Day 11 | 遵义 → 茅台 → 赤水 | 茅台酒香、赤水河谷 | 赤水丹霞客栈 |
| Day 12 | 赤水丹霞全天 | 十丈洞、佛光岩 | 赤水续住 |
| Day 13 | 赤水 → 恩施 | 穿重庆入鄂西 | 城市便捷(恩施火车站) |
| Day 14 | 恩施全天 | 土司城、女儿城 | 恩施续住 |
| Day 15 | 恩施 → 武汉 | 四渡河大桥、回家 | 🏠 |

**全程约 3100km · 预算约 ¥3,500/人**

## 🛠 技术栈

- 高德地图 JS API v2.0
- 纯 HTML/CSS/JS（零依赖、零构建）
- GitHub Pages 托管

## 📝 自定义

如需修改行程，编辑 `index.html` 中的以下数据：

- `STOPS`：途经地点及其坐标
- `SEGMENTS`：相邻地点之间的行车段
- `ITINERARY`：每天的详细行程（景点、美食、住宿、提示）
