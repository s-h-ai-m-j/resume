# DEVELOPMENT

## 开发指南

### 本地运行

```bash
cd resume-mvp
npm install
npm run dev
```

### 构建与检查

```bash
npm run build
npm run lint
```

> 当前执行环境无法联网安装依赖，因此这里的命令未在本机完成验证。

## 目录结构

```text
resume-mvp/
├── src/
│   ├── app/                  # Next.js App Router 页面与全局样式
│   ├── components/           # 页面组件与 UI 组件
│   ├── lib/                  # 存储与工具函数
│   ├── schema/               # JSON Schema
│   └── types/                # TypeScript 类型定义
├── docs/issues/              # 本地 issue 草稿
├── CHANGELOG.md
├── DEVELOPMENT.md
└── README.md
```

## 组件说明

- `ResumeBuilder`
  - 项目主组件，负责整合编辑器、预览区、模板切换、导入导出和 localStorage 自动保存。
- `Button / Card / Input / Select / Switch / Textarea`
  - 采用 shadcn/ui 风格封装的轻量基础组件，当前为手工实现，便于离线环境先落地 MVP。
- `ResumePreview`
  - 通过同一份简历数据生成三套模板，保证预览与打印导出使用同一渲染源。

## 状态管理

- 使用 React `useState` 保存当前工作区状态。
- 使用 `useEffect` 在状态变化时同步到 localStorage。
- `ResumeWorkspace` 用于管理多份简历和最近编辑列表。

## 模板说明

- `ats`
  - 单栏、强调信息密度与 ATS 友好。
- `business`
  - 深色标题区 + 双栏内容，适合商务场景。
- `modern`
  - 彩色头图 + 双栏布局，适合视觉更强的求职材料。

## 后续建议

- 引入更成熟的拖拽库优化排序体验。
- 增加字段级校验和空态引导。
- 增加模板配置抽象层，避免模板逻辑继续堆在单文件组件中。
- 接入服务端 PDF 渲染和云端同步能力。
