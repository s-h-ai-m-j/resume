# Resume MVP

一个基于 Next.js 14、TypeScript、Tailwind CSS 和 shadcn/ui 风格组件实现的简历生成项目 MVP。

## 项目介绍

本项目聚焦简历生成器的 Phase 1 能力，目标是在纯前端、本地优先的架构下，完成简历编辑、模板切换、实时预览、JSON 导入导出和浏览器打印导出 PDF 的闭环。

## 快速开始

> 当前仓库代码已完成，但由于执行环境 DNS 无法解析 `registry.npmjs.org`，依赖安装和构建验证需要在可联网环境中执行。

```bash
cd resume-mvp
npm install
npm run dev
```

访问 `http://localhost:3000` 即可使用。

## 技术栈

- Next.js 14（App Router）
- TypeScript
- Tailwind CSS
- shadcn/ui 风格组件结构
- localStorage 本地存储

## 功能列表

- 多份简历管理：新建、复制、删除、最近编辑记录
- 基本信息编辑：姓名、职位、电话、邮箱、地址、网站、简介
- 模块编辑：教育背景、工作经历、项目经历、技能清单
- 模块拖拽排序
- 模块显隐控制
- 模板系统：ATS 基础、专业商务、现代双栏
- 实时预览
- 导出 PDF：使用浏览器打印
- 导出 JSON
- 导入 JSON
- localStorage 自动保存

## 数据结构

- 类型定义：[src/types/resume.ts](/home/admin/openclaw/workspace/resume-mvp/src/types/resume.ts)
- JSON Schema：[src/schema/resume.schema.json](/home/admin/openclaw/workspace/resume-mvp/src/schema/resume.schema.json)

## 已知限制

- 当前 PDF 导出使用浏览器打印，不包含服务端渲染优化。
- 拖拽排序使用原生 HTML5 Drag and Drop，后续可升级为更细腻的交互库。
- 当前环境无法直接创建 GitHub 远程仓库与在线 Issues，已在本地 `docs/issues/` 生成对应 issue 草稿。
