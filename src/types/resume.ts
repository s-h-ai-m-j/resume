/**
 * 简历模板标识。
 */
export type ResumeTemplate = 'ats' | 'business' | 'modern'

/**
 * 模块标识。
 */
export type ResumeSection = 'education' | 'experience' | 'projects' | 'skills'

/**
 * 基本信息。
 */
export interface BasicInfo {
  fullName: string
  headline: string
  phone: string
  email: string
  address: string
  website: string
  summary: string
}

/**
 * 教育背景条目。
 */
export interface EducationItem {
  id: string
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
  location: string
  highlights: string
}

/**
 * 工作经历条目。
 */
export interface ExperienceItem {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  location: string
  highlights: string
}

/**
 * 项目经历条目。
 */
export interface ProjectItem {
  id: string
  name: string
  role: string
  startDate: string
  endDate: string
  link: string
  highlights: string
}

/**
 * 技能条目。
 */
export interface SkillItem {
  id: string
  name: string
  level: string
  detail: string
}

/**
 * 模块配置。
 */
export interface SectionConfig {
  id: ResumeSection
  label: string
  visible: boolean
}

/**
 * 单份简历的完整结构。
 */
export interface ResumeDocument {
  id: string
  name: string
  template: ResumeTemplate
  createdAt: string
  updatedAt: string
  basicInfo: BasicInfo
  sectionOrder: ResumeSection[]
  sections: SectionConfig[]
  education: EducationItem[]
  experience: ExperienceItem[]
  projects: ProjectItem[]
  skills: SkillItem[]
}

/**
 * 浏览器中的简历仓库结构。
 */
export interface ResumeWorkspace {
  resumes: ResumeDocument[]
  activeResumeId: string | null
  recentResumeIds: string[]
}

/**
 * 模板名称映射。
 */
export const TEMPLATE_LABELS: Record<ResumeTemplate, string> = {
  ats: 'ATS 基础',
  business: '专业商务',
  modern: '现代双栏',
}

/**
 * 模块名称映射。
 */
export const SECTION_LABELS: Record<ResumeSection, string> = {
  education: '教育背景',
  experience: '工作经历',
  projects: '项目经历',
  skills: '技能清单',
}

/**
 * 生成稳定 ID，供本地编辑使用。
 */
export function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

/**
 * 生成默认示例简历，保证首次进入就可预览。
 */
export function createDefaultResume(name = '我的简历'): ResumeDocument {
  const now = new Date().toISOString()

  return {
    id: createId('resume'),
    name,
    template: 'ats',
    createdAt: now,
    updatedAt: now,
    basicInfo: {
      fullName: '张三',
      headline: '前端开发工程师',
      phone: '138-0000-0000',
      email: 'zhangsan@example.com',
      address: '上海市浦东新区',
      website: 'https://portfolio.example.com',
      summary:
        '专注于 Web 产品体验与工程效率建设，熟悉 React / Next.js / TypeScript 技术栈，能够独立完成从需求分析到上线交付的前端闭环。',
    },
    sectionOrder: ['education', 'experience', 'projects', 'skills'],
    sections: [
      { id: 'education', label: '教育背景', visible: true },
      { id: 'experience', label: '工作经历', visible: true },
      { id: 'projects', label: '项目经历', visible: true },
      { id: 'skills', label: '技能清单', visible: true },
    ],
    education: [
      {
        id: createId('edu'),
        school: '复旦大学',
        degree: '本科',
        major: '软件工程',
        startDate: '2017-09',
        endDate: '2021-06',
        location: '上海',
        highlights: '主修数据结构、软件工程与人机交互，连续两年获得奖学金。',
      },
    ],
    experience: [
      {
        id: createId('exp'),
        company: '示例科技有限公司',
        role: '前端开发工程师',
        startDate: '2022-03',
        endDate: '至今',
        location: '上海',
        highlights:
          '负责企业级运营平台前端架构升级，推动组件库标准化与性能优化，首屏加载时间下降 35%。',
      },
    ],
    projects: [
      {
        id: createId('proj'),
        name: '简历生成器 MVP',
        role: '项目负责人',
        startDate: '2026-03',
        endDate: '2026-03',
        link: 'https://demo.example.com',
        highlights:
          '设计统一 JSON Schema，实现多模板渲染、模块拖拽排序、模块显隐与浏览器打印导出。',
      },
    ],
    skills: [
      {
        id: createId('skill'),
        name: 'TypeScript',
        level: '熟练',
        detail: '具备复杂业务建模、表单状态管理与前端工程化落地经验。',
      },
      {
        id: createId('skill'),
        name: 'Next.js',
        level: '熟练',
        detail: '能够基于 App Router 构建内容型与工具型 Web 产品。',
      },
    ],
  }
}

/**
 * 默认工作区。
 */
export function createDefaultWorkspace(): ResumeWorkspace {
  const firstResume = createDefaultResume()
  return {
    resumes: [firstResume],
    activeResumeId: firstResume.id,
    recentResumeIds: [firstResume.id],
  }
}
