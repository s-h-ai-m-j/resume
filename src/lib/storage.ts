import { ResumeDocument, ResumeWorkspace, createDefaultWorkspace, createId } from '@/types/resume'

const STORAGE_KEY = 'resume-mvp-workspace-v1'

/**
 * 读取本地工作区数据，并在异常时自动兜底。
 */
export function loadWorkspace(): ResumeWorkspace {
  if (typeof window === 'undefined') {
    return createDefaultWorkspace()
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const seeded = createDefaultWorkspace()
    saveWorkspace(seeded)
    return seeded
  }

  try {
    const parsed = JSON.parse(raw) as ResumeWorkspace
    if (!parsed.resumes?.length) {
      const seeded = createDefaultWorkspace()
      saveWorkspace(seeded)
      return seeded
    }

    return {
      resumes: parsed.resumes,
      activeResumeId: parsed.activeResumeId ?? parsed.resumes[0].id,
      recentResumeIds: parsed.recentResumeIds ?? [],
    }
  } catch (error) {
    console.error('读取工作区失败，已回退默认数据:', error)
    return createDefaultWorkspace()
  }
}

/**
 * 保存工作区到 localStorage。
 */
export function saveWorkspace(workspace: ResumeWorkspace): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace))
}

/**
 * 导出单份简历为 JSON 文件。
 */
export function exportResumeJson(resume: ResumeDocument): void {
  const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${resume.name || 'resume'}.json`
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * 从文件导入简历，并补齐必要字段。
 */
export async function importResumeJson(file: File): Promise<ResumeDocument> {
  const raw = await file.text()
  const parsed = JSON.parse(raw) as Partial<ResumeDocument>
  const now = new Date().toISOString()

  return {
    id: createId('resume'),
    name: parsed.name || '导入简历',
    template: parsed.template || 'ats',
    createdAt: parsed.createdAt || now,
    updatedAt: now,
    basicInfo: parsed.basicInfo || {
      fullName: '',
      headline: '',
      phone: '',
      email: '',
      address: '',
      website: '',
      summary: '',
    },
    sectionOrder: parsed.sectionOrder || ['education', 'experience', 'projects', 'skills'],
    sections:
      parsed.sections || [
        { id: 'education', label: '教育背景', visible: true },
        { id: 'experience', label: '工作经历', visible: true },
        { id: 'projects', label: '项目经历', visible: true },
        { id: 'skills', label: '技能清单', visible: true },
      ],
    education: parsed.education || [],
    experience: parsed.experience || [],
    projects: parsed.projects || [],
    skills: parsed.skills || [],
  }
}
