/*
 * Home Page — Miracle Wu Personal Portal
 * Design: Cyber Cream Geek
 * Sections: Hero (left text, right avatar) | Project Footprint (grid) | Learning Log (card stream)
 */
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, Github, ExternalLink, Code2, Cpu, Layers, ChevronDown } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useSEO } from '../hooks/useSEO';

const AVATAR_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663432020906/TNk97hFWUfMwRchz98LFoQ/myCat_ccc46f29.png';

const projects = [
  {
    id: '01',
    title: '实时语音交互项目',
    desc: '围绕 Step 系列实时语音对话场景，主导内容质量评测与 Benchmark 构建，重点覆盖社交迎合、情感陪伴等特殊交互场景，推动评测标准从零到一落地。',
    tags: ['Benchmark', 'Evaluation', 'Voice AI'],
    icon: <Cpu size={20} />,
    color: '#8E94F2',
    status: 'ACTIVE',
    link: 'https://icn2od9gkeiv.feishu.cn/wiki/LeKIwtHkLidfFBk8KiMcvwQTnME',
  },
  {
    id: '02',
    title: '文心快码 VSCode 插件评测',
    desc: '面向代码助手场景，构建覆盖代码生成、补全、问题修复等任务的评测集，结合竞品横评与多维评估方案，直接服务插件版本迭代与质量决策。',
    tags: ['Code Eval', 'Benchmark', 'VSCode'],
    icon: <Code2 size={20} />,
    color: '#B8BCFF',
    status: 'DONE',
    link: 'https://icn2od9gkeiv.feishu.cn/wiki/OJY7w0u5HiYkYakaKNhcJSZ2nNS?from=from_copylink',
  },
  {
    id: '03',
    title: '自动化提效总结',
    desc: '结合结构化 Prompt、Python 脚本与工作流工具，将数据生产、清洗、质检与分析串成半自动化 Pipeline，有效提升评测链路效率与结果复用性。',
    tags: ['Python', 'Pipeline', '自动化'],
    icon: <Layers size={20} />,
    color: '#C5C8FF',
    status: 'ACTIVE',
    link: 'https://icn2od9gkeiv.feishu.cn/wiki/Am2Lw4GpKiLRNFkw7y4csu7Jnkf?from=from_copylink',
  },
  {
    id: '04',
    title: '持续更新中…… ✊',
    desc: '持续积累 AI 评测、Prompt 工程与自动化流程的实践经验，边做边迭代，沉淀可复用的方法论与工程模板。',
    tags: ['AI Eval', 'Prompt', 'In Progress'],
    icon: <Github size={20} />,
    color: '#A0A4F8',
    status: 'ACTIVE',
    link: '',
  },
];

const learningLogs = [
  {
    date: '2026.03.10',
    category: 'AI Training',
    emoji: '🧠',
    title: 'RLHF 强化学习人类反馈深度实践',
    content: '今天深入研究了 RLHF 的奖励模型训练流程，发现数据质量对最终模型对齐效果的影响远超预期。标注一致性是关键瓶颈。',
    mood: '💡',
    tags: ['RLHF', 'LLM', 'Alignment'],
  },
  {
    date: '2026.03.07',
    category: 'Systems',
    emoji: '⚙️',
    title: 'x86 中断处理机制深度解析',
    content: '重新梳理了 x86 架构的中断描述符表（IDT）和异常处理流程，对操作系统底层有了更清晰的认知。',
    mood: '🔥',
    tags: ['x86', 'OS', 'Assembly'],
  },
  {
    date: '2026.03.03',
    category: 'Research',
    emoji: '🔬',
    title: 'EEG 信号预处理流水线优化',
    content: '尝试了新的带通滤波参数组合，P300 信号的信噪比提升了约 15%。下一步计划引入独立成分分析（ICA）。',
    mood: '📈',
    tags: ['BCI', 'EEG', 'Signal Processing'],
  },
];

const statusColors: Record<string, string> = {
  ACTIVE: '#4ade80',
  DONE: '#8E94F2',
  RESEARCH: '#f59e0b',
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  useSEO({
    title: 'Miracle Wu · AI Evaluation, Data Training & CS Student',
    description: '北京交通大学计算机在读，聚焦 AI 评测、数据训练与自动化 Pipeline，关注 Prompt 工程、Agent 工作流与系统化落地。',
  });

  return (
    <PageTransition>
      <main style={{ background: 'transparent' }}>
        {/* ── Hero Section ── */}
        <section className="min-h-[calc(100vh-64px)] flex items-center relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
              {/* Left: Text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="order-2 lg:order-1"
              >
                {/* Status badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(142,148,242,0.1)', border: '1px solid rgba(142,148,242,0.2)' }}
                >
                  <span className="status-dot" />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#8E94F2' }}>
                    OPEN_TO_COLLABORATE
                  </span>
                </motion.div>

                {/* Greeting */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg mb-2"
                  style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}
                >
                  你好，我是
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}
                >
                  Miracle
                  <br />
                  <span style={{ color: '#8E94F2' }}>Wu</span>
                </motion.h1>

                {/* Identity tags */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {['CS_STUDENT', 'AI_TRAINER', 'ROCKET_FORCE_VET'].map((tag) => (
                    <span key={tag} className="mono-tag">{tag}</span>
                  ))}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-base leading-relaxed mb-8 max-w-md"
                  style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}
                >
                  专注于 AI 数据工程与模型对齐研究，探索 Agent 架构与底层系统的交汇地带。
                  曾服役于火箭军，受到过习主席检阅，现转型为 AI 训练师，相信技术可以重塑认知边界。
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap gap-3"
                >
                  <Link href="/profile">
                    <motion.button
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-medium text-sm"
                      style={{ background: 'linear-gradient(135deg, #8E94F2, #6B72E8)' }}
                      whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(142,148,242,0.4)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      了解我 <ArrowRight size={16} />
                    </motion.button>
                  </Link>
                  <Link href="/archive">
                    <motion.button
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-sm"
                      style={{ background: 'white', color: '#8E94F2', border: '1.5px solid rgba(142,148,242,0.3)' }}
                      whileHover={{ scale: 1.05, borderColor: '#8E94F2', boxShadow: '0 4px 16px rgba(142,148,242,0.15)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      浏览足迹 📸
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right: Avatar */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="order-1 lg:order-2 flex justify-center lg:justify-end"
              >
                <div className="relative">
                  {/* Decorative ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(142,148,242,0.15) 0%, transparent 70%)',
                      transform: 'scale(1.3)',
                    }}
                    animate={{ scale: [1.3, 1.4, 1.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  {/* Avatar container */}
                  <motion.div
                    className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(142,148,242,0.15), rgba(184,188,255,0.1))',
                      border: '3px solid rgba(142,148,242,0.25)',
                      boxShadow: '0 20px 60px rgba(142,148,242,0.2)',
                    }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <img
                      src={AVATAR_URL}
                      alt="Miracle Wu"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Floating badge */}
                  <motion.div
                    className="absolute -bottom-2 -right-2 px-3 py-2 rounded-2xl text-xs font-medium"
                    style={{
                      background: 'white',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: '#8E94F2',
                      border: '1px solid rgba(142,148,242,0.2)',
                    }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  >
                    <span className="status-dot mr-1.5" />
                    在线中
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#9B9B9B', letterSpacing: '0.15em' }}>SCROLL</span>
              <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ChevronDown size={16} style={{ color: '#9B9B9B' }} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Project Footprint ── */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <p className="section-label mb-2">01 / PROJECT_FOOTPRINT</p>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
                项目足迹 <span style={{ color: '#8E94F2' }}>🚀</span>
              </h2>
              <p className="mt-3 text-sm" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                从底层系统到 AI 前沿，每个项目都是一次认知升级。
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="geek-card p-6 group"
                  style={{ cursor: project.link ? 'pointer' : 'default' }}
                  onClick={() => project.link && window.open(project.link, '_blank', 'noopener,noreferrer')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${project.color}20`, color: project.color }}
                    >
                      {project.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          background: `${statusColors[project.status]}20`,
                          color: statusColors[project.status],
                          fontSize: '0.65rem',
                        }}
                      >
                        {project.status}
                      </span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#C5C8FF' }}>
                        #{project.id}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-base mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                    {project.desc}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
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
                    {project.link ? (
                      <motion.div
                        whileHover={{ x: 3 }}
                        style={{ color: '#C5C8FF' }}
                      >
                        <ExternalLink size={14} />
                      </motion.div>
                    ) : (
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#C5C8FF' }}>
                        SOON
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Learning Log ── */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <p className="section-label mb-2">02 / LEARNING_LOG</p>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
                学习日志 <span style={{ color: '#8E94F2' }}>📓</span>
              </h2>
              <p className="mt-3 text-sm" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                记录每一次认知突破与技术探索，持续迭代自我。
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5"
            >
              {learningLogs.map((log, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="geek-card p-6"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: 'rgba(142,148,242,0.08)' }}
                    >
                      {log.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs px-2 py-0.5 rounded-lg"
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              background: 'rgba(142,148,242,0.1)',
                              color: '#8E94F2',
                              fontSize: '0.65rem',
                            }}
                          >
                            {log.category}
                          </span>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#9B9B9B' }}>
                            {log.date}
                          </span>
                        </div>
                        <span className="text-lg">{log.mood}</span>
                      </div>
                      <h3 className="font-semibold text-base mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
                        {log.title}
                      </h3>
                      <p className="text-sm leading-relaxed mb-3" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                        {log.content}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {log.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-lg"
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              background: '#FAF7F2',
                              color: '#9B9B9B',
                              fontSize: '0.65rem',
                              border: '1px solid rgba(0,0,0,0.06)',
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(142,148,242,0.12) 0%, rgba(184,188,255,0.08) 100%)',
                border: '1px solid rgba(142,148,242,0.2)',
              }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663432020906/TNk97hFWUfMwRchz98LFoQ/hero-bg-pattern-aJmy9aW36PWQFjidvbuYWG.webp')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="relative z-10">
                <p className="section-label mb-4">03 / ARCHIVE</p>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
                  做过什么，比说过什么更真实 🌌
                </h2>
                <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                  生活瞬间、项目过程、自动化成果与 AI 创作——这里记录真实发生的事。
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/archive">
                    <motion.button
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-medium text-sm"
                      style={{ background: 'linear-gradient(135deg, #8E94F2, #6B72E8)' }}
                      whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(142,148,242,0.4)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      浏览足迹 <ArrowRight size={16} />
                    </motion.button>
                  </Link>
                  <Link href="/interests">
                    <motion.button
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-sm"
                      style={{ background: 'white', color: '#8E94F2', border: '1.5px solid rgba(142,148,242,0.3)' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      探索我的兴趣 🎯
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </PageTransition>
  );
}
