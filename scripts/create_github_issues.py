#!/usr/bin/env python3
"""
GitHub Issues 批量创建脚本
使用方法：
1. 设置环境变量：export GITHUB_TOKEN="your_token_here"
2. 运行脚本：python3 scripts/create_github_issues.py

或者直接在脚本中修改 TOKEN 变量
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

# ========== 配置区域 ==========
# 方法 1: 使用环境变量（推荐）
TOKEN = os.getenv("GITHUB_TOKEN", "")

# 方法 2: 或者直接在这里填写 Token
# TOKEN = "ghp_xxx"  # 替换为你的 GitHub Personal Access Token

OWNER = "s-h-ai-m-j"
REPO = "resume"
# =============================

if not TOKEN:
    print("❌ 错误：请设置 GITHUB_TOKEN 环境变量或在脚本中填写 Token")
    print("   使用方法：export GITHUB_TOKEN=\"ghp_xxx\"")
    sys.exit(1)

BASE = f"https://api.github.com/repos/{OWNER}/{REPO}/issues"
FILES = [
    "docs/issues/ISSUE-001-init-project.md",
    "docs/issues/ISSUE-002-data-schema.md",
    "docs/issues/ISSUE-003-local-storage.md",
    "docs/issues/ISSUE-004-basic-info.md",
    "docs/issues/ISSUE-005-education.md",
    "docs/issues/ISSUE-006-experience.md",
    "docs/issues/ISSUE-007-projects.md",
    "docs/issues/ISSUE-008-skills.md",
    "docs/issues/ISSUE-009-section-order-visibility.md",
    "docs/issues/ISSUE-010-templates-preview.md",
    "docs/issues/ISSUE-011-import-export.md",
    "docs/issues/ISSUE-012-docs.md",
    "docs/issues/ISSUE-013-qa.md",
]

opener = urllib.request.build_opener()
headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "codex-issue-creator",
}

print(f"开始创建 Issues 到 {OWNER}/{REPO}...")
print("=" * 60)

results = []
errors = []

for path_str in FILES:
    path = Path(path_str)
    if not path.exists():
        print(f"⚠️  跳过：{path_str} (文件不存在)")
        errors.append((path_str, "file not found"))
        continue
    
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    
    if not lines or not lines[0].startswith("# "):
        errors.append((path_str, "missing title line"))
        continue
    
    title = lines[0][2:].strip()
    body = "\n".join(lines[1:]).lstrip("\n")
    payload = json.dumps({"title": title, "body": body}, ensure_ascii=False).encode("utf-8")
    
    last_err = None
    for attempt in range(1, 6):
        req = urllib.request.Request(BASE, data=payload, headers=headers, method="POST")
        try:
            with opener.open(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                url = data.get("html_url")
                number = data.get("number")
                print(f"✅ {path.name}: #{number} {url}")
                results.append((path_str, number, url))
                last_err = None
                break
        except urllib.error.HTTPError as e:
            body_text = e.read().decode("utf-8", errors="replace")
            last_err = f"HTTP {e.code}: {body_text[:500]}"
            if e.code == 422:  # Issue already exists
                print(f"⚠️  {path.name}: Issue 可能已存在 ({e.code})")
                errors.append((path_str, last_err))
                break
            if e.code in {500, 502, 503, 504, 429} and attempt < 5:
                print(f"⏳ {path.name}: 重试 {attempt+1}/5...")
                time.sleep(2 * attempt)
                continue
            break
        except Exception as e:
            last_err = repr(e)
            if attempt < 5:
                print(f"⏳ {path.name}: 重试 {attempt+1}/5 ({last_err[:50]}...)")
                time.sleep(2 * attempt)
                continue
            break
    
    if last_err:
        print(f"❌ {path.name}: {last_err[:100]}")
        errors.append((path_str, last_err))
    
    # 避免触发 API 限流
    time.sleep(0.5)

print("=" * 60)
print(f"完成！成功：{len(results)}, 失败：{len(errors)}")

if results:
    print("\n📋 已创建的 Issues:")
    for path, num, url in results:
        print(f"   - {url}")

if errors:
    print("\n⚠️  失败的 Issues:")
    for path, err in errors:
        print(f"   - {path}: {err[:80]}")
    sys.exit(1)

print("\n🎉 所有 Issues 创建成功！")
sys.exit(0)
