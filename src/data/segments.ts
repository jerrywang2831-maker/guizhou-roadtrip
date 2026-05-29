import type { Segment } from '../types';

export const SEGMENTS: Segment[] = [
  { from: 0, to: 1 },   // 武汉→常德
  { from: 1, to: 2 },   // 常德→凤凰
  { from: 2, to: 3 },   // 凤凰→梵净山
  { from: 3, to: 4 },   // 梵净山→西江苗寨
  { from: 4, to: 5 },   // 西江→荔波
  { from: 5, to: 6 },   // 荔波→贵阳
  { from: 6, to: 7 },   // 贵阳→黄果树
  { from: 7, to: 8 },   // 黄果树→龙宫
  { from: 8, to: 9 },   // 龙宫→云峰屯堡
  { from: 9, to: 7 },   // 云峰屯堡→安顺(返回)
  { from: 7, to: 10 },  // 安顺→织金洞
  { from: 10, to: 11 }, // 织金洞→遵义
  { from: 11, to: 12 }, // 遵义→茅台
  { from: 12, to: 13 }, // 茅台→恩施
  { from: 13, to: 0 },  // 恩施→武汉
];
