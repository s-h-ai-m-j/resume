# 手动创建 GitHub Issues 指南

由于当前服务器环境无法访问 GitHub API，请通过以下任一方式创建 Issues。

---

## 方式一：使用 Python 脚本（推荐）

### 步骤

1. **克隆仓库到本地**
   ```bash
   git clone https://github.com/s-h-ai-m-j/resume.git
   cd resume
   ```

2. **设置 GitHub Token 并运行脚本**
   ```bash
   export GITHUB_TOKEN="your_github_token_here"
   python3 scripts/create_github_issues.py
   ```

3. **查看结果**
   - 脚本会自动创建 13 个 Issues
   - 成功后会打印每个 Issue 的 URL

---

## 方式二：使用 GitHub CLI

如果你本地安装了 `gh` 命令行工具：

```bash
# 登录 GitHub
gh auth login

# 切换到 resume 仓库目录
cd resume

# 批量创建 Issues
gh issue create --title "ISSUE-001: 初始化 Next.js 14 + Tailwind CSS + shadcn/ui 基础设施" --body-file docs/issues/ISSUE-001-init-project.md
gh issue create --title "ISSUE-002: 设计简历 JSON Schema 与 TypeScript 数据结构" --body-file docs/issues/ISSUE-002-data-schema.md
# ... 重复创建其他 Issues
```

---

## 方式三：GitHub 网页手动创建

访问 https://github.com/s-h-ai-m-j/resume/issues/new 逐个创建：

### Issue 列表

| # | 标题 | 标签 | 状态 |
|---|------|------|------|
| 1 | ISSUE-001: 初始化 Next.js 14 + Tailwind CSS + shadcn/ui 基础设施 | `enhancement` | ✅ |
| 2 | ISSUE-002: 设计简历 JSON Schema 与 TypeScript 数据结构 | `enhancement` | ✅ |
| 3 | ISSUE-003: 实现多份简历管理与 localStorage 自动保存 | `enhancement` | ✅ |
| 4 | ISSUE-004: 实现基础信息编辑模块 | `enhancement` | ✅ |
| 5 | ISSUE-005: 实现教育背景模块编辑 | `enhancement` | ✅ |
| 6 | ISSUE-006: 实现工作经历模块编辑 | `enhancement` | ✅ |
| 7 | ISSUE-007: 实现项目经历模块编辑 | `enhancement` | ✅ |
| 8 | ISSUE-008: 实现技能清单模块编辑 | `enhancement` | ✅ |
| 9 | ISSUE-009: 实现模块拖拽排序与显隐控制 | `enhancement` | ✅ |
| 10 | ISSUE-010: 实现模板系统与实时预览 | `enhancement` | ✅ |
| 11 | ISSUE-011: 实现 JSON 导入导出与 PDF 打印导出 | `enhancement` | ✅ |
| 12 | ISSUE-012: 完成 README / DEVELOPMENT / CHANGELOG 文档 | `documentation` | ✅ |
| 13 | ISSUE-013: 自测、问题修复与交付整理 | `testing` | ⏳ |

> ✅ 表示代码已完成，⏳ 表示待完成

每个 Issue 的详细内容请复制 `docs/issues/ISSUE-XXX.md` 文件内容。

---

## 验证

创建完成后，访问 https://github.com/s-h-ai-m-j/resume/issues 确认所有 13 个 Issues 已创建。
