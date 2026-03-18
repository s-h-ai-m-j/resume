'use client'

import { ChangeEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { exportResumeJson, importResumeJson, loadWorkspace, saveWorkspace } from '@/lib/storage'
import { cn } from '@/lib/utils'
import {
  BasicInfo,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeDocument,
  ResumeSection,
  ResumeWorkspace,
  SECTION_LABELS,
  SkillItem,
  TEMPLATE_LABELS,
  createId,
} from '@/types/resume'

type CollectionKey = 'education' | 'experience' | 'projects' | 'skills'
type CollectionMap = {
  education: EducationItem
  experience: ExperienceItem
  projects: ProjectItem
  skills: SkillItem
}

/**
 * 主编辑器组件，整合数据管理、编辑器、模板预览和导出能力。
 */
export function ResumeBuilder() {
  const [workspace, setWorkspace] = useState<ResumeWorkspace>(() => loadWorkspace())
  const [draggingSection, setDraggingSection] = useState<ResumeSection | null>(null)
  const [statusText, setStatusText] = useState('本地自动保存已启用')
  const importInputRef = useRef<HTMLInputElement | null>(null)

  const activeResume = useMemo(() => {
    return workspace.resumes.find((resume) => resume.id === workspace.activeResumeId) || workspace.resumes[0]
  }, [workspace])

  useEffect(() => {
    saveWorkspace(workspace)
    setStatusText(`最近保存：${new Date().toLocaleTimeString('zh-CN')}`)
  }, [workspace])

  if (!activeResume) {
    return null
  }

  /**
   * 更新当前选中的简历。
   */
  const updateActiveResume = (updater: (resume: ResumeDocument) => ResumeDocument) => {
    setWorkspace((current) => {
      const resumes = current.resumes.map((resume) => {
        if (resume.id !== activeResume.id) {
          return resume
        }

        return updater({ ...resume, updatedAt: new Date().toISOString() })
      })

      return {
        ...current,
        resumes,
        recentResumeIds: [activeResume.id, ...current.recentResumeIds.filter((id) => id !== activeResume.id)].slice(0, 5),
      }
    })
  }

  /**
   * 创建新简历。
   */
  const createResume = () => {
    const nextResume = createDefaultResume(`我的简历 ${workspace.resumes.length + 1}`)
    setWorkspace((current) => ({
      resumes: [nextResume, ...current.resumes],
      activeResumeId: nextResume.id,
      recentResumeIds: [nextResume.id, ...current.recentResumeIds].slice(0, 5),
    }))
  }

  /**
   * 复制当前简历。
   */
  const duplicateResume = () => {
    const now = new Date().toISOString()
    const duplicated: ResumeDocument = {
      ...JSON.parse(JSON.stringify(activeResume)),
      id: createId('resume'),
      name: `${activeResume.name} 副本`,
      createdAt: now,
      updatedAt: now,
    }

    setWorkspace((current) => ({
      resumes: [duplicated, ...current.resumes],
      activeResumeId: duplicated.id,
      recentResumeIds: [duplicated.id, ...current.recentResumeIds].slice(0, 5),
    }))
  }

  /**
   * 删除当前简历，至少保留一份。
   */
  const deleteResume = () => {
    if (workspace.resumes.length <= 1) {
      return
    }

    setWorkspace((current) => {
      const resumes = current.resumes.filter((resume) => resume.id !== activeResume.id)
      return {
        resumes,
        activeResumeId: resumes[0]?.id || null,
        recentResumeIds: current.recentResumeIds.filter((id) => id !== activeResume.id),
      }
    })
  }

  /**
   * 更新基础信息。
   */
  const updateBasicInfo = (basicInfo: BasicInfo) => {
    updateActiveResume((resume) => ({
      ...resume,
      basicInfo,
    }))
  }

  /**
   * 更新列表型模块。
   */
  const updateCollection = <K extends CollectionKey>(key: K, items: CollectionMap[K][]) => {
    updateActiveResume((resume) => ({
      ...resume,
      [key]: items,
    }) as ResumeDocument)
  }

  /**
   * 为列表型模块追加一条数据。
   */
  const addCollectionItem = <K extends CollectionKey>(key: K) => {
    const nextItemMap: CollectionMap = {
      education: {
        id: createId('edu'),
        school: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        location: '',
        highlights: '',
      },
      experience: {
        id: createId('exp'),
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        location: '',
        highlights: '',
      },
      projects: {
        id: createId('proj'),
        name: '',
        role: '',
        startDate: '',
        endDate: '',
        link: '',
        highlights: '',
      },
      skills: {
        id: createId('skill'),
        name: '',
        level: '',
        detail: '',
      },
    }

    updateActiveResume((resume) => ({
      ...resume,
      [key]: [...resume[key], nextItemMap[key]],
    }) as ResumeDocument)
  }

  /**
   * 删除列表型模块中的指定条目。
   */
  const removeCollectionItem = <K extends CollectionKey>(key: K, id: string) => {
    updateActiveResume((resume) => ({
      ...resume,
      [key]: resume[key].filter((item) => item.id !== id),
    }) as ResumeDocument)
  }

  /**
   * 切换模块显隐。
   */
  const toggleSectionVisibility = (sectionId: ResumeSection, visible: boolean) => {
    updateActiveResume((resume) => ({
      ...resume,
      sections: resume.sections.map((section) => (section.id === sectionId ? { ...section, visible } : section)),
    }))
  }

  /**
   * 拖拽完成后更新模块顺序。
   */
  const moveSection = (targetSection: ResumeSection) => {
    if (!draggingSection || draggingSection === targetSection) {
      return
    }

    updateActiveResume((resume) => {
      const nextOrder = [...resume.sectionOrder]
      const fromIndex = nextOrder.indexOf(draggingSection)
      const toIndex = nextOrder.indexOf(targetSection)
      nextOrder.splice(fromIndex, 1)
      nextOrder.splice(toIndex, 0, draggingSection)
      return {
        ...resume,
        sectionOrder: nextOrder,
      }
    })

    setDraggingSection(null)
  }

  /**
   * 导入 JSON 文件并生成一份新简历。
   */
  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const imported = await importResumeJson(file)
    setWorkspace((current) => ({
      resumes: [imported, ...current.resumes],
      activeResumeId: imported.id,
      recentResumeIds: [imported.id, ...current.recentResumeIds].slice(0, 5),
    }))
    event.target.value = ''
  }

  const visibleSections = activeResume.sectionOrder.filter((sectionId) => {
    return activeResume.sections.find((section) => section.id === sectionId)?.visible
  })

  return (
    <main className="min-h-screen px-4 py-6 md:px-6 xl:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
        <section className="rounded-[32px] border border-[rgba(23,32,51,0.12)] bg-white/72 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[#d97706] px-3 py-1 text-xs font-semibold text-white">
                Resume MVP / Phase 1
              </span>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">本地优先的简历生成器</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6777]">
                  基于 Next.js 14、TypeScript、Tailwind CSS 与 shadcn/ui 风格组件搭建，支持简历编辑、多模板切换、实时预览、本地自动保存和 JSON 导入导出。
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 no-print">
              <Button onClick={createResume}>新建简历</Button>
              <Button variant="secondary" onClick={duplicateResume}>
                复制简历
              </Button>
              <Button variant="outline" onClick={() => exportResumeJson(activeResume)}>
                导出 JSON
              </Button>
              <Button variant="outline" onClick={() => importInputRef.current?.click()}>
                导入 JSON
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                导出 PDF
              </Button>
              <Button variant="danger" disabled={workspace.resumes.length <= 1} onClick={deleteResume}>
                删除简历
              </Button>
              <input ref={importInputRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
            </div>
          </div>
          <p className="mt-4 text-sm text-[#5f6777]">{statusText}</p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[300px_minmax(420px,1fr)_minmax(520px,0.95fr)]">
          <Card className="h-fit no-print">
            <CardHeader>
              <CardTitle>简历列表</CardTitle>
              <CardDescription>新建、复制、删除简历，并查看最近编辑记录。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {workspace.resumes.map((resume) => {
                const isActive = resume.id === activeResume.id
                const isRecent = workspace.recentResumeIds.includes(resume.id)
                return (
                  <button
                    key={resume.id}
                    type="button"
                    onClick={() =>
                      setWorkspace((current) => ({
                        ...current,
                        activeResumeId: resume.id,
                        recentResumeIds: [resume.id, ...current.recentResumeIds.filter((id) => id !== resume.id)].slice(0, 5),
                      }))
                    }
                    className={cn(
                      'w-full rounded-2xl border p-4 text-left transition',
                      isActive ? 'border-[#0f6c7f] bg-[#0f6c7f]/6' : 'border-[rgba(23,32,51,0.12)] bg-white/80 hover:bg-white',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{resume.name}</span>
                      {isRecent ? (
                        <span className="rounded-full bg-[#efe5d3] px-3 py-1 text-xs font-medium">最近编辑</span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-[#5f6777]">
                      模板：{TEMPLATE_LABELS[resume.template]} · 更新于{' '}
                      {new Date(resume.updatedAt).toLocaleString('zh-CN')}
                    </p>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          <div className="space-y-6 no-print">
            <BasicInfoPanel
              resume={activeResume}
              onTemplateChange={(template) =>
                updateActiveResume((resume) => ({
                  ...resume,
                  template,
                }))
              }
              onBasicInfoChange={updateBasicInfo}
              onNameChange={(name) =>
                updateActiveResume((resume) => ({
                  ...resume,
                  name,
                }))
              }
            />

            <Card>
              <CardHeader>
                <CardTitle>模块管理</CardTitle>
                <CardDescription>拖拽调整模块顺序，并控制模块显隐。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeResume.sectionOrder.map((sectionId) => {
                  const section = activeResume.sections.find((item) => item.id === sectionId)
                  if (!section) {
                    return null
                  }

                  return (
                    <div
                      key={sectionId}
                      draggable
                      onDragStart={() => setDraggingSection(sectionId)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => moveSection(sectionId)}
                      className="flex items-center justify-between rounded-2xl border border-[rgba(23,32,51,0.12)] bg-white/75 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#5f6777]">::</span>
                        <span className="font-medium">{section.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-[#5f6777]">{section.visible ? '显示中' : '已隐藏'}</span>
                        <Switch checked={section.visible} onCheckedChange={(checked) => toggleSectionVisibility(sectionId, checked)} />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <CollectionEditor
              title="教育背景"
              description="支持教育经历的新增、编辑和删除。"
              items={activeResume.education}
              onAdd={() => addCollectionItem('education')}
              onRemove={(id) => removeCollectionItem('education', id)}
              onChange={(items) => updateCollection('education', items)}
              renderFields={(item, onItemChange) => (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="学校">
                    <Input value={item.school} onChange={(event) => onItemChange({ ...item, school: event.target.value })} />
                  </Field>
                  <Field label="学历">
                    <Input value={item.degree} onChange={(event) => onItemChange({ ...item, degree: event.target.value })} />
                  </Field>
                  <Field label="专业">
                    <Input value={item.major} onChange={(event) => onItemChange({ ...item, major: event.target.value })} />
                  </Field>
                  <Field label="地点">
                    <Input value={item.location} onChange={(event) => onItemChange({ ...item, location: event.target.value })} />
                  </Field>
                  <Field label="开始时间">
                    <Input value={item.startDate} onChange={(event) => onItemChange({ ...item, startDate: event.target.value })} />
                  </Field>
                  <Field label="结束时间">
                    <Input value={item.endDate} onChange={(event) => onItemChange({ ...item, endDate: event.target.value })} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="亮点描述">
                      <Textarea
                        value={item.highlights}
                        onChange={(event) => onItemChange({ ...item, highlights: event.target.value })}
                      />
                    </Field>
                  </div>
                </div>
              )}
            />

            <CollectionEditor
              title="工作经历"
              description="支持工作经历的新增、编辑和删除。"
              items={activeResume.experience}
              onAdd={() => addCollectionItem('experience')}
              onRemove={(id) => removeCollectionItem('experience', id)}
              onChange={(items) => updateCollection('experience', items)}
              renderFields={(item, onItemChange) => (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="公司">
                    <Input value={item.company} onChange={(event) => onItemChange({ ...item, company: event.target.value })} />
                  </Field>
                  <Field label="职位">
                    <Input value={item.role} onChange={(event) => onItemChange({ ...item, role: event.target.value })} />
                  </Field>
                  <Field label="地点">
                    <Input value={item.location} onChange={(event) => onItemChange({ ...item, location: event.target.value })} />
                  </Field>
                  <Field label="开始时间">
                    <Input value={item.startDate} onChange={(event) => onItemChange({ ...item, startDate: event.target.value })} />
                  </Field>
                  <Field label="结束时间">
                    <Input value={item.endDate} onChange={(event) => onItemChange({ ...item, endDate: event.target.value })} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="亮点描述">
                      <Textarea
                        value={item.highlights}
                        onChange={(event) => onItemChange({ ...item, highlights: event.target.value })}
                      />
                    </Field>
                  </div>
                </div>
              )}
            />

            <CollectionEditor
              title="项目经历"
              description="支持项目经历的新增、编辑和删除。"
              items={activeResume.projects}
              onAdd={() => addCollectionItem('projects')}
              onRemove={(id) => removeCollectionItem('projects', id)}
              onChange={(items) => updateCollection('projects', items)}
              renderFields={(item, onItemChange) => (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="项目名称">
                    <Input value={item.name} onChange={(event) => onItemChange({ ...item, name: event.target.value })} />
                  </Field>
                  <Field label="项目角色">
                    <Input value={item.role} onChange={(event) => onItemChange({ ...item, role: event.target.value })} />
                  </Field>
                  <Field label="开始时间">
                    <Input value={item.startDate} onChange={(event) => onItemChange({ ...item, startDate: event.target.value })} />
                  </Field>
                  <Field label="结束时间">
                    <Input value={item.endDate} onChange={(event) => onItemChange({ ...item, endDate: event.target.value })} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="项目链接">
                      <Input value={item.link} onChange={(event) => onItemChange({ ...item, link: event.target.value })} />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label="亮点描述">
                      <Textarea
                        value={item.highlights}
                        onChange={(event) => onItemChange({ ...item, highlights: event.target.value })}
                      />
                    </Field>
                  </div>
                </div>
              )}
            />

            <CollectionEditor
              title="技能清单"
              description="支持技能项的新增、编辑和删除。"
              items={activeResume.skills}
              onAdd={() => addCollectionItem('skills')}
              onRemove={(id) => removeCollectionItem('skills', id)}
              onChange={(items) => updateCollection('skills', items)}
              renderFields={(item, onItemChange) => (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="技能名称">
                    <Input value={item.name} onChange={(event) => onItemChange({ ...item, name: event.target.value })} />
                  </Field>
                  <Field label="熟练度">
                    <Input value={item.level} onChange={(event) => onItemChange({ ...item, level: event.target.value })} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="技能说明">
                      <Textarea value={item.detail} onChange={(event) => onItemChange({ ...item, detail: event.target.value })} />
                    </Field>
                  </div>
                </div>
              )}
            />
          </div>

          <ResumePreview resume={activeResume} visibleSections={visibleSections} />
        </section>
      </div>
    </main>
  )
}

interface BasicInfoPanelProps {
  resume: ResumeDocument
  onNameChange: (name: string) => void
  onTemplateChange: (template: ResumeDocument['template']) => void
  onBasicInfoChange: (basicInfo: BasicInfo) => void
}

/**
 * 基础信息面板。
 */
function BasicInfoPanel({ resume, onNameChange, onTemplateChange, onBasicInfoChange }: BasicInfoPanelProps) {
  const basicInfo = resume.basicInfo

  return (
    <Card>
      <CardHeader>
        <CardTitle>基础信息</CardTitle>
        <CardDescription>编辑简历名称、模板和个人信息。</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Field label="简历名称">
          <Input value={resume.name} onChange={(event) => onNameChange(event.target.value)} />
        </Field>
        <Field label="模板">
          <Select value={resume.template} onChange={(event) => onTemplateChange(event.target.value as ResumeDocument['template'])}>
            {Object.entries(TEMPLATE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="姓名">
          <Input
            value={basicInfo.fullName}
            onChange={(event) => onBasicInfoChange({ ...basicInfo, fullName: event.target.value })}
          />
        </Field>
        <Field label="职位">
          <Input
            value={basicInfo.headline}
            onChange={(event) => onBasicInfoChange({ ...basicInfo, headline: event.target.value })}
          />
        </Field>
        <Field label="电话">
          <Input
            value={basicInfo.phone}
            onChange={(event) => onBasicInfoChange({ ...basicInfo, phone: event.target.value })}
          />
        </Field>
        <Field label="邮箱">
          <Input
            value={basicInfo.email}
            onChange={(event) => onBasicInfoChange({ ...basicInfo, email: event.target.value })}
          />
        </Field>
        <Field label="地址">
          <Input
            value={basicInfo.address}
            onChange={(event) => onBasicInfoChange({ ...basicInfo, address: event.target.value })}
          />
        </Field>
        <Field label="个人网站">
          <Input
            value={basicInfo.website}
            onChange={(event) => onBasicInfoChange({ ...basicInfo, website: event.target.value })}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="个人简介">
            <Textarea
              value={basicInfo.summary}
              onChange={(event) => onBasicInfoChange({ ...basicInfo, summary: event.target.value })}
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  )
}

interface CollectionEditorProps<T extends { id: string }> {
  title: string
  description: string
  items: T[]
  onAdd: () => void
  onRemove: (id: string) => void
  onChange: (items: T[]) => void
  renderFields: (item: T, onItemChange: (nextItem: T) => void) => ReactNode
}

/**
 * 通用列表编辑器，复用教育、工作、项目、技能四类模块。
 */
function CollectionEditor<T extends { id: string }>({
  title,
  description,
  items,
  onAdd,
  onRemove,
  onChange,
  renderFields,
}: CollectionEditorProps<T>) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant="secondary" onClick={onAdd}>
          新增
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-2xl border border-[rgba(23,32,51,0.12)] bg-white/75 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-[#efe5d3] px-3 py-1 text-xs font-medium">第 {index + 1} 项</span>
              <Button variant="outline" onClick={() => onRemove(item.id)}>
                删除
              </Button>
            </div>
            {renderFields(item, (nextItem) => onChange(items.map((current) => (current.id === item.id ? nextItem : current))))}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface FieldProps {
  label: string
  children: ReactNode
}

/**
 * 表单字段包装器。
 */
function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#394150]">{label}</label>
      {children}
    </div>
  )
}

interface ResumePreviewProps {
  resume: ResumeDocument
  visibleSections: ResumeSection[]
}

/**
 * 右侧实时预览组件，三套模板都基于同一份数据渲染。
 */
function ResumePreview({ resume, visibleSections }: ResumePreviewProps) {
  const sectionMap: Record<ResumeSection, ReactNode> = {
    education: (
      <PreviewSection key="education" title={SECTION_LABELS.education}>
        {resume.education.map((item) => (
          <TimelineRow
            key={item.id}
            title={`${item.school} · ${item.degree} / ${item.major}`}
            meta={`${item.startDate} - ${item.endDate} · ${item.location}`}
            content={item.highlights}
          />
        ))}
      </PreviewSection>
    ),
    experience: (
      <PreviewSection key="experience" title={SECTION_LABELS.experience}>
        {resume.experience.map((item) => (
          <TimelineRow
            key={item.id}
            title={`${item.company} · ${item.role}`}
            meta={`${item.startDate} - ${item.endDate} · ${item.location}`}
            content={item.highlights}
          />
        ))}
      </PreviewSection>
    ),
    projects: (
      <PreviewSection key="projects" title={SECTION_LABELS.projects}>
        {resume.projects.map((item) => (
          <TimelineRow
            key={item.id}
            title={`${item.name} · ${item.role}`}
            meta={`${item.startDate} - ${item.endDate}${item.link ? ` · ${item.link}` : ''}`}
            content={item.highlights}
          />
        ))}
      </PreviewSection>
    ),
    skills: (
      <PreviewSection key="skills" title={SECTION_LABELS.skills}>
        <div className="grid gap-3">
          {resume.skills.map((item) => (
            <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <strong>{item.name}</strong>
                <span className="text-sm text-slate-500">{item.level}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </PreviewSection>
    ),
  }

  const header = (
    <div
      className={cn(
        'rounded-[28px] border p-8',
        resume.template === 'ats' && 'bg-white border-[rgba(23,32,51,0.12)]',
        resume.template === 'business' && 'border-slate-900 bg-slate-900 text-white',
        resume.template === 'modern' && 'border-transparent bg-gradient-to-br from-sky-950 via-cyan-900 to-emerald-800 text-white',
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] opacity-70">{TEMPLATE_LABELS[resume.template]}</p>
          <h2 className="mt-2 text-4xl font-semibold">{resume.basicInfo.fullName}</h2>
          <p className="mt-3 text-lg opacity-90">{resume.basicInfo.headline}</p>
        </div>
        <div className="space-y-1 text-sm opacity-90">
          <p>{resume.basicInfo.phone}</p>
          <p>{resume.basicInfo.email}</p>
          <p>{resume.basicInfo.address}</p>
          <p>{resume.basicInfo.website}</p>
        </div>
      </div>
      <p className="mt-6 max-w-4xl text-sm leading-7 opacity-90">{resume.basicInfo.summary}</p>
    </div>
  )

  const orderedSections = visibleSections.map((sectionId) => sectionMap[sectionId])

  return (
    <Card className="print-shell overflow-hidden">
      <CardHeader className="no-print">
        <CardTitle>实时预览</CardTitle>
        <CardDescription>当前模板：{TEMPLATE_LABELS[resume.template]}，打印时沿用相同布局。</CardDescription>
      </CardHeader>
      <CardContent>
        {resume.template === 'modern' ? (
          <div className="overflow-hidden rounded-[32px] border border-[rgba(23,32,51,0.12)] bg-white">
            {header}
            <div className="grid gap-8 p-8 md:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-6">{orderedSections.filter((_, index) => index < 3)}</div>
              <div className="space-y-6">{orderedSections.filter((_, index) => index >= 3)}</div>
            </div>
          </div>
        ) : resume.template === 'business' ? (
          <div className="space-y-6 rounded-[32px] border border-[rgba(23,32,51,0.12)] bg-white p-8">
            {header}
            <div className="grid gap-6 md:grid-cols-2">{orderedSections}</div>
          </div>
        ) : (
          <div className="space-y-6 rounded-[32px] border border-[rgba(23,32,51,0.12)] bg-white p-8">
            {header}
            <div className="space-y-6">{orderedSections}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * 预览模块容器。
 */
function PreviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{title}</h3>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

/**
 * 时间线行组件。
 */
function TimelineRow({ title, meta, content }: { title: string; meta: string; content: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-500">{meta}</p>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600">{content}</p>
    </article>
  )
}
