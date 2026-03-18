# 创建 GitHub Issues 指南

由于当前环境网络限制，无法直接调用 GitHub API 创建 Issues。请手动创建或使用以下方法：

## 方法一：手动创建（推荐）

访问 https://github.com/s-h-ai-m-j/resume/issues/new 创建以下 Issues：

### Issue 列表

1. **ISSUE-001: 初始化 Next.js 14 + Tailwind CSS + shadcn/ui 基础设施**
   - 标签：`enhancement`
   - 状态：✅ 已完成

2. **ISSUE-002: 设计简历 JSON Schema 与 TypeScript 数据结构**
   - 标签：`enhancement`
   - 状态：✅ 已完成

3. **ISSUE-003: 实现多份简历管理与 localStorage 自动保存**
   - 标签：`enhancement`
   - 状态：✅ 已完成

4. **ISSUE-004: 实现基础信息编辑模块**
   - 标签：`enhancement`
   - 状态：✅ 已完成

5. **ISSUE-005: 实现教育背景模块编辑**
   - 标签：`enhancement`
   - 状态：✅ 已完成

6. **ISSUE-006: 实现工作经历模块编辑**
   - 标签：`enhancement`
   - 状态：✅ 已完成

7. **ISSUE-007: 实现项目经历模块编辑**
   - 标签：`enhancement`
   - 状态：✅ 已完成

8. **ISSUE-008: 实现技能清单模块编辑**
   - 标签：`enhancement`
   - 状态：✅ 已完成

9. **ISSUE-009: 实现模块拖拽排序与显隐控制**
   - 标签：`enhancement`
   - 状态：✅ 已完成

10. **ISSUE-010: 实现模板系统与实时预览**
    - 标签：`enhancement`
    - 状态：✅ 已完成

11. **ISSUE-011: 实现 JSON 导入导出与 PDF 打印导出**
    - 标签：`enhancement`
    - 状态：✅ 已完成

12. **ISSUE-012: 完成 README / DEVELOPMENT / CHANGELOG 文档**
    - 标签：`documentation`
    - 状态：✅ 已完成

13. **ISSUE-013: 自测、问题修复与交付整理**
    - 标签：`testing`
    - 状态：⏳ 待完成（需要可联网环境）

## 方法二：使用 GitHub CLI

如果你本地安装了 `gh` 命令行工具：

```bash
cd resume-mvp

# 登录 GitHub
gh auth login

# 创建 Issue
gh issue create --title "ISSUE-001: 初始化 Next.js 14 + Tailwind CSS + shadcn/ui 基础设施" --body-file docs/issues/ISSUE-001-init-project.md
# ... 重复创建其他 Issues
```

## 方法三：使用浏览器扩展

使用 GitHub Issue 批量创建工具或浏览器扩展。

---

## 详细 Issue 内容

每个 Issue 的详细内容已保存在 `docs/issues/` 目录中，可以直接复制使用。
