# ISSUE-002 设计简历 JSON Schema 与 TypeScript 数据结构

## 目标

- 定义简历主数据结构
- 覆盖基本信息、教育背景、工作经历、项目经历、技能、模块顺序和显隐
- 输出 TypeScript 类型与 JSON Schema

## 验收标准

- 存在统一的 `ResumeDocument` 类型
- 存在 `resume.schema.json`
- 默认简历可直接生成演示数据
