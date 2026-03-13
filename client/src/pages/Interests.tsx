/*
 * Interests Page — Miracle Wu
 * Design: Cyber Cream Geek
 * Layout: Digital Universe Matrix with animated progress bars
 * Data: MCP 85%, BCI Research 70%, Algorithms 90%, etc.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ChevronRight, ChevronDown, ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const COSMOS_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663432020906/TNk97hFWUfMwRchz98LFoQ/interests-cosmos-EBCJo36BUYEnFJK5iWG3qW.webp';

interface InterestItem {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  level: number;
  levelLabel: string;
  color: string;
  desc: string;
  details: string[];
  tags: string[];
}

const interests: InterestItem[] = [
  {
    id: '01',
    emoji: '🤖',
    title: 'MCP 协议',
    subtitle: 'Model Context Protocol',
    level: 85,
    levelLabel: 'ADVANCED',
    color: '#8E94F2',
    desc: '深度参与 MCP 工具链开发，构建 AI Agent 与外部工具的无缝集成框架。',
    details: [
      '构建多个 MCP Server 工具集成',
      '研究 AI Agent 工具调用优化策略',
      '探索 LLM 与外部 API 的协议标准化',
    ],
    tags: ['MCP', 'AI Agent', 'TypeScript', 'Protocol'],
  },
  {
    id: '02',
    emoji: '🧠',
    title: 'BCI 脑机接口',
    subtitle: 'Brain-Computer Interface',
    level: 70,
    levelLabel: 'INTERMEDIATE',
    color: '#B8BCFF',
    desc: '探索非侵入式脑机接口信号处理，研究 EEG 信号的特征提取与意图识别。',
    details: [
      'P300 信号检测与分类算法',
      'EEG 预处理流水线优化（SNR +15%）',
      '独立成分分析（ICA）去噪研究',
    ],
    tags: ['EEG', 'Python', 'MNE', 'Signal Processing'],
  },
  {
    id: '03',
    emoji: '⚡',
    title: '算法与数据结构',
    subtitle: 'Algorithms & DS',
    level: 90,
    levelLabel: 'EXPERT',
    color: '#6B72E8',
    desc: '竞赛级算法能力，LeetCode 500+ 题，专注动态规划、图论与系统设计。',
    details: [
      'LeetCode 500+ 题解，Top 15% 排名',
      '动态规划 · 图论 · 字符串算法',
      '参与 ACM 区域赛，获铜牌',
    ],
    tags: ['LeetCode', 'DP', 'Graph', 'C++'],
  },
  {
    id: '04',
    emoji: '🔬',
    title: 'RLHF 与模型对齐',
    subtitle: 'Reinforcement Learning from Human Feedback',
    level: 88,
    levelLabel: 'ADVANCED',
    color: '#A0A4F8',
    desc: '深度参与大语言模型的 RLHF 训练流程，专注数据质量与奖励模型优化。',
    details: [
      '累计标注训练数据 50,000+ 条',
      '奖励模型评估与校准方法研究',
      '多模态数据集构建与质量控制',
    ],
    tags: ['RLHF', 'LLM', 'Alignment', 'Data'],
  },
  {
    id: '05',
    emoji: '⚙️',
    title: 'x86 汇编 & 系统编程',
    subtitle: 'Low-Level Systems',
    level: 82,
    levelLabel: 'ADVANCED',
    color: '#C5C8FF',
    desc: '深入 x86 指令集架构，实现汇编模拟器，探索操作系统底层机制。',
    details: [
      '实现完整 x86 指令集模拟器',
      '中断描述符表（IDT）与异常处理',
      '内存管理与分页机制可视化',
    ],
    tags: ['x86 ASM', 'C++', 'OS', 'Low-Level'],
  },
  {
    id: '06',
    emoji: '🌌',
    title: '科幻 & 技术哲学',
    subtitle: 'Sci-Fi & Tech Philosophy',
    level: 78,
    levelLabel: 'ENTHUSIAST',
    color: '#D4D6FF',
    desc: '热爱硬科幻文学，思考 AI 伦理、人机融合与技术奇点的哲学命题。',
    details: [
      '《三体》《基地》系列深度阅读',
      '关注 AI 对齐与安全研究前沿',
      '探索意识上传与数字永生的可能性',
    ],
    tags: ['Sci-Fi', 'AI Ethics', 'Philosophy', 'Reading'],
  },
];

const levelColors: Record<string, string> = {
  EXPERT: '#4ade80',
  ADVANCED: '#8E94F2',
  INTERMEDIATE: '#f59e0b',
  ENTHUSIAST: '#f472b6',
};

function ProgressBar({ level, color, delay = 0 }: { level: number; color: string; delay?: number }) {
  return (
    <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(142,148,242,0.1)' }}>
      <motion.div
        className="absolute top-0 left-0 h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay, type: 'spring', stiffness: 40, damping: 20 }}
      />
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

export default function Interests() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <PageTransition>
      <main style={{ background: 'transparent' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <div className="breadcrumb flex items-center gap-2 mb-8">
            <Link href="/"><span className="hover:text-purple-400 cursor-pointer" style={{ color: '#8E94F2' }}>首页</span></Link>
            <ChevronRight size={12} style={{ color: '#C5C8FF' }} />
            <span style={{ color: '#9B9B9B' }}>兴趣爱好</span>
          </div>

          {/* Hero Header */}
          <div className="relative rounded-3xl overflow-hidden mb-16 p-10 sm:p-16">
            {/* BG Image */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${COSMOS_URL}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.35,
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(250,247,242,0.85) 0%, rgba(142,148,242,0.15) 100%)' }}
            />
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="section-label mb-3">INTERESTS & HOBBIES · DIGITAL_UNIVERSE</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
                  探索我的
                  <br />
                  <span style={{ color: '#8E94F2' }}>技术宇宙</span> 🌌
                </h1>
                <p className="text-base max-w-lg leading-relaxed" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                  从 AI 对齐到脑机接口，从底层汇编到哲学思辨——每一个领域都是一扇通往不同维度的门。
                  这里是我的精神地图，记录着每一次认知升级的轨迹。
                </p>
              </motion.div>
            </div>
          </div>

          {/* Interest Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="section-label mb-2">01 / PASSION_MAP</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
              技术领域掌握度
            </h2>
            <p className="text-sm" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
              点击卡片展开详细信息
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20"
          >
            {interests.map((item, i) => {
              const isExpanded = expandedId === item.id;
              return (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  className="geek-card p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  style={{ border: isExpanded ? `1.5px solid ${item.color}40` : '1.5px solid transparent' }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                        style={{ background: `${item.color}15` }}
                      >
                        {item.emoji}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
                          {item.title}
                        </h3>
                        <p className="text-xs" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} style={{ color: '#C5C8FF' }} />
                    </motion.div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          background: `${levelColors[item.levelLabel]}15`,
                          color: levelColors[item.levelLabel],
                          fontSize: '0.6rem',
                        }}
                      >
                        {item.levelLabel}
                      </span>
                      <span
                        className="font-bold text-sm"
                        style={{ fontFamily: 'JetBrains Mono, monospace', color: item.color }}
                      >
                        {item.level}%
                      </span>
                    </div>
                    <ProgressBar level={item.level} color={item.color} delay={i * 0.08} />
                  </div>

                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                    {item.desc}
                  </p>

                  {/* Expandable Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="pt-3 mt-3 border-t space-y-1.5"
                          style={{ borderColor: `${item.color}20` }}
                        >
                          {item.details.map((detail, di) => (
                            <div key={di} className="flex items-start gap-2">
                              <div
                                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                style={{ background: item.color }}
                              />
                              <span className="text-xs" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                                {detail}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-lg"
                              style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                background: `${item.color}10`,
                                color: item.color,
                                fontSize: '0.6rem',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Expand hint */}
                  {!isExpanded && (
                    <p className="text-xs" style={{ color: '#C5C8FF', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem' }}>
                      点击展开 ↓
                    </p>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Reading List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="section-label mb-2">02 / BOOKSHELF</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
              近期阅读 📚
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
            {[
              { emoji: '🤖', title: '人工智能：一种现代方法', author: 'Russell & Norvig', cat: 'AI', color: '#8E94F2' },
              { emoji: '🧬', title: '神经网络与深度学习', author: 'Michael Nielsen', cat: 'ML', color: '#B8BCFF' },
              { emoji: '🌌', title: '三体', author: '刘慈欣', cat: '科幻', color: '#C5C8FF' },
              { emoji: '⚙️', title: '深入理解计算机系统', author: 'CS:APP', cat: 'Systems', color: '#A0A4F8' },
            ].map((book, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="geek-card p-5"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3"
                  style={{ background: `${book.color}15` }}
                >
                  {book.emoji}
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block"
                  style={{ fontFamily: 'JetBrains Mono, monospace', background: `${book.color}15`, color: book.color, fontSize: '0.6rem' }}
                >
                  {book.cat}
                </span>
                <h3 className="font-semibold text-sm mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
                  {book.title}
                </h3>
                <p className="text-xs" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                  {book.author}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-end"
          >
            <Link href="/connect">
              <motion.button
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #8E94F2, #6B72E8)', fontFamily: 'Inter, sans-serif' }}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(142,148,242,0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                前往交友表单 <ArrowRight size={14} />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="py-8 border-t mt-8" style={{ borderColor: 'rgba(142,148,242,0.1)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#9B9B9B' }}>
              © 2026 Miracle Wu · Built with ⚡
            </p>
            <Link href="/">
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#8E94F2', cursor: 'pointer' }}>
                返回首页 ↑
              </span>
            </Link>
          </div>
        </footer>
      </main>
    </PageTransition>
  );
}
