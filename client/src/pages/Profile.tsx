/*
 * Profile Page — Miracle Wu
 * Design: Cyber Cream Geek
 * Layout: Left fixed ID card | Right scrollable Tab container (基本信息 / 技术栈)
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { MapPin, Mail, Github, Award, ChevronRight, ArrowRight, Download, BookOpen, Cpu } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useSEO } from '../hooks/useSEO';

const AVATAR_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663432020906/TNk97hFWUfMwRchz98LFoQ/myCat_ccc46f29.png';
const PROFILE_BG_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663432020906/TNk97hFWUfMwRchz98LFoQ/profile-card-bg-mNT25FaS9nxYVGtFF3nh4t.webp';

type TabId = 'info' | 'skills';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'info', label: '基本信息', icon: <BookOpen size={14} /> },
  { id: 'skills', label: '技术栈', icon: <Cpu size={14} /> },
];

const infoItems = [
  { icon: '👤', label: '姓名', value: 'Miracle Wu' },
  { icon: '📍', label: '所在地', value: '中国北京' },
  { icon: '🎓', label: '学历', value: '计算机科学 本科在读' },
  { icon: '💼', label: '职业', value: 'AI Trainer · 数据标注工程师' },
  { icon: '🪖', label: '经历', value: '火箭军退伍士兵（2年服役）' },
  { icon: '🔬', label: '研究方向', value: '智能体工作流 (Agentic Workflow) · RAG 架构\n多模态交互 (MI) · 提示词工程 (PE)' },
  { icon: '📧', label: '邮箱', value: 'wjq13307822575@gmail.com' },
  { icon: '🌐', label: 'GitHub', value: 'github.com/MiracleJiaqi' },
];

interface CapabilityCard {
  icon: string;
  title: string;
  titleEn: string;
  label: string;
  desc: string;
  tags: string[];
}

const capabilities: CapabilityCard[] = [
  {
    icon: '⚡',
    title: 'VibeCoding',
    titleEn: 'AI-Assisted Development',
    label: '基本掌握',
    desc: '能围绕真实业务做渐进式改动，先跑通流程，再针对瓶颈优化。在数据生产较慢时，通过并发生产、分步骤生成、迭代 Prompt、切换更合适模型来提效。',
    tags: ['AI Coding', 'Iteration', 'Optimization'],
  },
  {
    icon: '📝',
    title: 'PE 工程',
    titleEn: 'Prompt Engineering',
    label: '基本掌握',
    desc: '能把业务需求转成结构化 Prompt，设计生成约束、输出格式和质量标准，支持规模化内容生产与评测数据构建。',
    tags: ['Prompt', 'Benchmark', 'LLM'],
  },
  {
    icon: '🔧',
    title: '自动化 Pipeline',
    titleEn: 'Automation Workflow',
    label: '基本掌握',
    desc: '通过 Python 脚本、工作流工具（影刀、Eagle）结合模型能力，把数据采集、清洗、生成、质检、分析串成半自动化流程。',
    tags: ['Python', '自动化', 'Pipeline'],
  },
  {
    icon: '📊',
    title: '评测全流程',
    titleEn: 'Evaluation & QA',
    label: '基本掌握',
    desc: '熟悉评测项目全流程：需求理解 → 维度确定 → 准备爬坡 → 正式评测 → 结果交付 → 项目复盘，具备独立交付评测任务的能力。',
    tags: ['评测', 'Benchmark', 'AI', 'Quality Control'],
  },
];

const labelStyle: Record<string, { bg: string; text: string; border: string }> = {
  '基本掌握': { bg: 'rgba(142,148,242,0.08)', text: '#8E94F2', border: 'rgba(142,148,242,0.25)' },
  '熟练':     { bg: 'rgba(74,222,128,0.08)',  text: '#16a34a', border: 'rgba(74,222,128,0.25)' },
  '探索中':   { bg: 'rgba(245,158,11,0.08)',  text: '#d97706', border: 'rgba(245,158,11,0.25)' },
};

const experiences = [
  {
    period: '2023 — 2025',
    role: 'AI 数据训练师',
    org: '某大型 AI 公司（保密）',
    desc: '负责大语言模型的 RLHF 数据标注与质量控制，参与多模态数据集构建，累计标注数据超 50,000 条。',
    tags: ['RLHF', 'LLM', 'Quality Control'],
    icon: '🤖',
  },
  {
    period: '2021 — 2023',
    role: '火箭军 · 技术战士',
    org: '中国人民解放军火箭军',
    desc: '服役两年，担任技术战士，负责通信设备维护与技术保障，培养了严谨的工程思维与团队协作能力。',
    tags: ['Leadership', 'Engineering', 'Discipline'],
    icon: '🚀',
  },
  {
    period: '2021 — 至今',
    role: '计算机科学 本科生',
    org: '北京交通大学',
    desc: '主修计算机科学，专注于人工智能与系统方向，参与 AI 数据处理项目，主要负责数据分析与数据清洗相关任务。',
    tags: ['CS', 'AI Research', 'Data Processing'],
    icon: '🎓',
  },
];

export default function Profile() {
  useSEO({
    title: '个人简介 · Miracle Wu',
    description: '北京交通大学计算机本科在读，具备多模态评测、Benchmark 构建、评测 SOP 拆解与自动化提效经验。',
  });

  const [activeTab, setActiveTab] = useState<TabId>('info');

  return (
    <PageTransition>
      <main style={{ background: 'transparent' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <div className="breadcrumb flex items-center gap-2 mb-8">
            <Link href="/"><span className="hover:text-purple-400 cursor-pointer" style={{ color: '#8E94F2' }}>首页</span></Link>
            <ChevronRight size={12} style={{ color: '#C5C8FF' }} />
            <span style={{ color: '#9B9B9B' }}>个人资料</span>
          </div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p className="section-label mb-2">PROFILE · IDENTITY_CARD</p>
            <h1 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
              个人资料
            </h1>
          </motion.div>

          {/* Main Layout: Left + Right */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* ── Left: Fixed ID Card ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full lg:w-72 lg:sticky lg:top-24 flex-shrink-0"
            >
              <div
                className="geek-card overflow-hidden"
                style={{ background: 'white' }}
              >
                {/* Card BG */}
                <div
                  className="h-28 relative"
                  style={{
                    backgroundImage: `url('${PROFILE_BG_URL}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.4) 100%)' }} />
                  {/* Verified badge */}
                  <div
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    style={{ background: '#8E94F2', color: 'white' }}
                  >
                    ✓
                  </div>
                </div>

                {/* Avatar */}
                <div className="px-6 pb-6">
                  <div className="relative -mt-12 mb-4">
                    <div
                      className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white"
                      style={{ boxShadow: '0 4px 16px rgba(142,148,242,0.2)' }}
                    >
                      <img src={AVATAR_URL} alt="Miracle Wu" className="w-full h-full object-cover" />
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white"
                      style={{ background: '#4ade80' }}
                    />
                  </div>

                  <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
                    Miracle Wu
                  </h2>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {['CS Student', 'AI Trainer', 'Rocket Force Veteran'].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(142,148,242,0.1)',
                          color: '#8E94F2',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.65rem',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <MapPin size={12} style={{ color: '#8E94F2' }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#6B6B6B' }}>中国北京</span>
                  </div>

                  {/* Stats */}
                  <div
                    className="grid grid-cols-3 gap-2 p-3 rounded-2xl mb-4"
                    style={{ background: 'rgba(142,148,242,0.05)', border: '1px solid rgba(142,148,242,0.1)' }}
                  >
                    {[
                      { label: '项目', value: '4+' },
                      { label: '标注', value: '50K+' },
                      { label: '服役', value: '2年' },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="font-bold text-sm" style={{ color: '#8E94F2', fontFamily: 'JetBrains Mono, monospace' }}>
                          {stat.value}
                        </div>
                        <div className="text-xs" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-2 mb-2">
                    <motion.a
                      href="https://github.com/MiracleJiaqi"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs"
                      style={{ background: '#2D2D2D', color: 'white', fontFamily: 'Inter, sans-serif' }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Github size={12} /> GitHub
                    </motion.a>
                    <motion.a
                      href="mailto:wjq13307822575@gmail.com"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs"
                      style={{ background: 'rgba(142,148,242,0.1)', color: '#8E94F2', fontFamily: 'Inter, sans-serif' }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Mail size={12} /> 邮件
                    </motion.a>
                  </div>

                  {/* 下载简历 */}
                  <motion.a
                    href="/resume.pdf"
                    download="Miracle_Wu_Resume.pdf"
                    className="flex w-full items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium"
                    style={{
                      background: 'linear-gradient(135deg, rgba(142,148,242,0.12), rgba(184,188,255,0.08))',
                      color: '#8E94F2',
                      border: '1.5px solid rgba(142,148,242,0.2)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    whileHover={{ scale: 1.03, borderColor: '#8E94F2', background: 'rgba(142,148,242,0.12)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Download size={12} />
                    下载简历
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.5rem',
                        background: 'rgba(142,148,242,0.15)',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        letterSpacing: '0.05em',
                      }}
                    >
                      PDF
                    </span>
                  </motion.a>
                </div>
              </div>
            </motion.div>

            {/* ── Right: Tab Container ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 min-w-0"
            >
              {/* Tab Switcher */}
              <div
                className="flex gap-2 p-1.5 rounded-2xl mb-6 w-fit"
                style={{ background: 'rgba(142,148,242,0.08)', border: '1px solid rgba(142,148,242,0.12)' }}
              >
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: activeTab === tab.id ? 'white' : 'transparent',
                      color: activeTab === tab.id ? '#8E94F2' : '#9B9B9B',
                      boxShadow: activeTab === tab.id ? '0 2px 8px rgba(142,148,242,0.15)' : 'none',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {tab.icon}
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Basic Info */}
                    <div className="geek-card p-6 mb-6">
                      <p className="section-label mb-4">PERSONAL_INFORMATION</p>
                      <div className="space-y-4">
                        {infoItems.map((item) => (
                          <div key={item.label} className="flex items-start gap-4 py-2 border-b last:border-b-0" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                            <span className="text-lg w-6 flex-shrink-0 mt-0.5">{item.icon}</span>
                            <span className="text-sm w-20 flex-shrink-0" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                              {item.label}
                            </span>
                            <span className="text-sm font-medium whitespace-pre-line" style={{ color: '#2D2D2D', fontFamily: 'Inter, sans-serif' }}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experience Timeline */}
                    <div className="geek-card p-6">
                      <p className="section-label mb-6">EXPERIENCE_TIMELINE</p>
                      <div className="space-y-6">
                        {experiences.map((exp, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-4"
                          >
                            <div className="flex flex-col items-center">
                              <div
                                className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                                style={{ background: 'rgba(142,148,242,0.1)' }}
                              >
                                {exp.icon}
                              </div>
                              {i < experiences.length - 1 && (
                                <div className="w-px flex-1 mt-2" style={{ background: 'rgba(142,148,242,0.15)', minHeight: '24px' }} />
                              )}
                            </div>
                            <div className="pb-6">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold text-sm" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
                                  {exp.role}
                                </h3>
                                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#8E94F2' }}>
                                  {exp.period}
                                </span>
                              </div>
                              <p className="text-xs mb-2" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                                {exp.org}
                              </p>
                              <p className="text-sm leading-relaxed mb-2" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                                {exp.desc}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {exp.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs px-2 py-0.5 rounded-lg"
                                    style={{
                                      fontFamily: 'JetBrains Mono, monospace',
                                      background: 'rgba(142,148,242,0.08)',
                                      color: '#8E94F2',
                                      fontSize: '0.65rem',
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'skills' && (
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Capability Cards — 2-column grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {capabilities.map((cap, i) => {
                        const ls = labelStyle[cap.label] ?? labelStyle['基本掌握'];
                        return (
                          <motion.div
                            key={i}
                            className="geek-card p-5 flex flex-col gap-3"
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                          >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                  style={{ background: 'rgba(142,148,242,0.08)' }}
                                >
                                  {cap.icon}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold leading-tight" style={{ color: '#2D2D2D', fontFamily: 'Playfair Display, serif' }}>
                                    {cap.title}
                                  </p>
                                  <p className="text-xs leading-tight mt-0.5" style={{ color: '#9B9B9B', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem' }}>
                                    {cap.titleEn}
                                  </p>
                                </div>
                              </div>
                              {/* Label badge */}
                              <span
                                className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                                style={{
                                  background: ls.bg,
                                  color: ls.text,
                                  border: `1px solid ${ls.border}`,
                                  fontFamily: 'Inter, sans-serif',
                                  fontSize: '0.65rem',
                                  fontWeight: 500,
                                }}
                              >
                                {cap.label}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-xs leading-relaxed" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                              {cap.desc}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                              {cap.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 rounded-lg"
                                  style={{
                                    fontFamily: 'JetBrains Mono, monospace',
                                    background: 'rgba(142,148,242,0.06)',
                                    color: '#8E94F2',
                                    fontSize: '0.6rem',
                                    border: '1px solid rgba(142,148,242,0.12)',
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Cert / Awards */}
                    <div className="geek-card p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                          <Award size={16} />
                        </div>
                        <p className="section-label">CERTIFICATIONS & AWARDS</p>
                      </div>
                      <div className="space-y-3">
                        {[
                          { title: '火箭军优秀士兵', year: '2023', icon: '🏅' },
                          { title: '且曼学院 19 期学员', year: '2026', icon: '🎓' },
                        ].map((cert, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(142,148,242,0.04)' }}>
                            <span className="text-lg">{cert.icon}</span>
                            <div className="flex-1">
                              <span className="text-sm font-medium" style={{ color: '#2D2D2D', fontFamily: 'Inter, sans-serif' }}>{cert.title}</span>
                            </div>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#9B9B9B' }}>{cert.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 flex justify-end"
          >
            <Link href="/interests">
              <motion.button
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium"
                style={{ background: 'rgba(142,148,242,0.1)', color: '#8E94F2', border: '1px solid rgba(142,148,242,0.2)', fontFamily: 'Inter, sans-serif' }}
                whileHover={{ scale: 1.05, background: 'rgba(142,148,242,0.15)' }}
                whileTap={{ scale: 0.95 }}
              >
                探索兴趣页面 <ArrowRight size={14} />
              </motion.button>
            </Link>
          </motion.div>
        </div>

      </main>
    </PageTransition>
  );
}
