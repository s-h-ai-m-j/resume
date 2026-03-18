# 快速开始 - 创建 GitHub Issues

## 当前状态

✅ 代码已推送：https://github.com/s-h-ai-m-j/resume
⏳ Issues 待创建（当前服务器无法访问 GitHub API）

## 最快解决方案（2 分钟）

### 方案 A：GitHub 网页批量创建

1. 访问 https://github.com/s-h-ai-m-j/resume/issues/new

2. 复制以下标题创建 13 个 Issues：

```
ISSUE-001: 初始化 Next.js 14 + Tailwind CSS + shadcn/ui 基础设施
ISSUE-002: 设计简历 JSON Schema 与 TypeScript 数据结构
ISSUE-003: 实现多份简历管理与 localStorage 自动保存
ISSUE-004: 实现基础信息编辑模块
ISSUE-005: 实现教育背景模块编辑
ISSUE-006: 实现工作经历模块编辑
ISSUE-007: 实现项目经历模块编辑
ISSUE-008: 实现技能清单模块编辑
ISSUE-009: 实现模块拖拽排序与显隐控制
ISSUE-010: 实现模板系统与实时预览
ISSUE-011: 实现 JSON 导入导出与 PDF 打印导出
ISSUE-012: 完成 README / DEVELOPMENT / CHANGELOG 文档
ISSUE-013: 自测、问题修复与交付整理
```

3. 正文内容：复制 `docs/issues/ISSUE-XXX.md` 文件内容

4. 标签：
   - ISSUE-001 到 ISSUE-011: `enhancement`
   - ISSUE-012: `documentation`
   - ISSUE-013: `testing`

---

### 方案 B：本地运行脚本

```bash
git clone https://github.com/s-h-ai-m-j/resume.git
cd resume
export GITHUB_TOKEN="your_token_here"
python3 scripts/create_github_issues.py
```

---

## 验证

访问：https://github.com/s-h-ai-m-j/resume/issues
