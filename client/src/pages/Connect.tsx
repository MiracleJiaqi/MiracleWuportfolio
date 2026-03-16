/*
 * Connect Page — Miracle Wu
 * Design: Cyber Cream Geek
 * Features: Form with multi-select interest tags, personality tags, success animation
 * Reference: https://johnfolio-fx8g3hkq.manus.space/connect
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ChevronRight, Send, CheckCircle2, User, Mail, MessageSquare } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const AVATAR_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663432020906/TNk97hFWUfMwRchz98LFoQ/hero-avatar-MYmpxB9zZdZ74Vq8bwruYg.webp';

const interestOptions = [
  { id: 'ai', label: '🤖 AI & 机器学习', desc: '' },
  { id: 'bci', label: '🧠 脑机接口', desc: '' },
  { id: 'algo', label: '⚡ 算法竞赛', desc: '' },
  { id: 'systems', label: '⚙️ 系统编程', desc: '' },
  { id: 'design', label: '🎨 设计 & 美学', desc: '' },
  { id: 'reading', label: '📚 阅读 & 科幻', desc: '' },
  { id: 'open-source', label: '🌐 开源项目', desc: '' },
  { id: 'music', label: '🎵 音乐', desc: '' },
  { id: 'philosophy', label: '🌌 技术哲学', desc: '' },
  { id: 'gaming', label: '🎮 游戏', desc: '' },
];

const purposeOptions = [
  { id: 'collab', label: '🤝 项目合作', desc: '一起构建有趣的东西' },
  { id: 'chat', label: '💬 技术交流', desc: '聊聊 AI 与代码' },
  { id: 'research', label: '🔬 研究探讨', desc: '共同探索前沿领域' },
  { id: 'friend', label: '🌸 纯粹交友', desc: '认识有趣的灵魂' },
];

const personalityOptions = [
  { id: 'introvert', label: '🌙 内向 · 深思型' },
  { id: 'extrovert', label: '☀️ 外向 · 活跃型' },
  { id: 'creative', label: '🎨 创意 · 发散型' },
  { id: 'rational', label: '🧠 理性 · 逻辑型' },
  { id: 'empathic', label: '💕 感性 · 共情型' },
  { id: 'adventurous', label: '🗺️ 冒险 · 探索型' },
];

interface FormState {
  name: string;
  email: string;
  intro: string;
  interests: string[];
  purposes: string[];
  personalities: string[];
  agreed: boolean;
}

function MultiSelectTag({
  label,
  selected,
  onToggle,
  color = '#8E94F2',
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
  color?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all"
      style={{
        background: selected ? `${color}15` : 'rgba(250,247,242,0.8)',
        border: `1.5px solid ${selected ? color : 'rgba(0,0,0,0.06)'}`,
        color: selected ? color : '#6B6B6B',
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.8rem',
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div
        className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0"
        style={{
          border: `1.5px solid ${selected ? color : '#C5C8FF'}`,
          background: selected ? color : 'transparent',
        }}
      >
        {selected && <span style={{ color: 'white', fontSize: '0.5rem', fontWeight: 'bold' }}>✓</span>}
      </div>
      {label}
    </motion.button>
  );
}

export default function Connect() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    intro: '',
    interests: [],
    purposes: [],
    personalities: [],
    agreed: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleArray = (key: 'interests' | 'purposes' | 'personalities', value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = '请输入姓名';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = '请输入有效邮箱';
    if (!form.agreed) newErrors.agreed = '请同意建立真诚的连接';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  // Summary for sidebar
  const selectedInterests = interestOptions.filter((o) => form.interests.includes(o.id)).map((o) => o.label);
  const selectedPurposes = purposeOptions.filter((o) => form.purposes.includes(o.id)).map((o) => o.label);
  const selectedPersonalities = personalityOptions.filter((o) => form.personalities.includes(o.id)).map((o) => o.label);

  return (
    <PageTransition>
      <main style={{ background: 'transparent' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <div className="breadcrumb flex items-center gap-2 mb-8">
            <Link href="/"><span className="hover:text-purple-400 cursor-pointer" style={{ color: '#8E94F2' }}>首页</span></Link>
            <ChevronRight size={12} style={{ color: '#C5C8FF' }} />
            <span style={{ color: '#9B9B9B' }}>交个朋友</span>
          </div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p className="section-label mb-2">FRIEND_REQUEST_FORM</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
              发起 <span style={{ color: '#8E94F2' }}>连接请求</span> 💌
            </h1>
            <p className="text-sm max-w-lg leading-relaxed" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
              填写下方表单，告诉我你是谁、你感兴趣的方向，以及你希望我们如何认识。
              我期待认识每一位有趣的灵魂。
            </p>
          </motion.div>

          {/* Success State */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="geek-card p-12 text-center mb-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'linear-gradient(135deg, rgba(142,148,242,0.2), rgba(184,188,255,0.1))' }}
                >
                  <CheckCircle2 size={40} style={{ color: '#8E94F2' }} />
                </motion.div>
                <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
                  连接请求已发送！🎉
                </h2>
                <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                  感谢你的连接请求，{form.name}！我会尽快回复你，期待与你的相遇。
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <motion.button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', intro: '', interests: [], purposes: [], personalities: [], agreed: false }); }}
                    className="px-5 py-2.5 rounded-2xl text-sm font-medium"
                    style={{ background: 'rgba(142,148,242,0.1)', color: '#8E94F2', border: '1px solid rgba(142,148,242,0.2)', fontFamily: 'Inter, sans-serif' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    再发一条
                  </motion.button>
                  <Link href="/">
                    <motion.button
                      className="px-5 py-2.5 rounded-2xl text-sm font-medium text-white"
                      style={{ background: 'linear-gradient(135deg, #8E94F2, #6B72E8)', fontFamily: 'Inter, sans-serif' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      返回首页
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!submitted && (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* ── Left: Form ── */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex-1 min-w-0 space-y-6"
              >
                {/* Module 01: Basic Info */}
                <div className="geek-card p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(142,148,242,0.1)', color: '#8E94F2' }}>
                      <User size={14} />
                    </div>
                    <div>
                      <p className="section-label">MODULE_01</p>
                      <p className="text-sm font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>基本信息</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                        姓名 <span style={{ color: '#8E94F2' }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="你的名字"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: '#FAF7F2',
                          border: `1.5px solid ${errors.name ? '#f87171' : 'rgba(142,148,242,0.2)'}`,
                          color: '#2D2D2D',
                          fontFamily: 'Inter, sans-serif',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#8E94F2'; e.target.style.boxShadow = '0 0 0 3px rgba(142,148,242,0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = errors.name ? '#f87171' : 'rgba(142,148,242,0.2)'; e.target.style.boxShadow = 'none'; }}
                      />
                      {errors.name && <p className="text-xs mt-1" style={{ color: '#f87171', fontFamily: 'Inter, sans-serif' }}>{errors.name}</p>}
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                        邮箱 <span style={{ color: '#8E94F2' }}>*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: '#FAF7F2',
                          border: `1.5px solid ${errors.email ? '#f87171' : 'rgba(142,148,242,0.2)'}`,
                          color: '#2D2D2D',
                          fontFamily: 'Inter, sans-serif',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#8E94F2'; e.target.style.boxShadow = '0 0 0 3px rgba(142,148,242,0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = errors.email ? '#f87171' : 'rgba(142,148,242,0.2)'; e.target.style.boxShadow = 'none'; }}
                      />
                      {errors.email && <p className="text-xs mt-1" style={{ color: '#f87171', fontFamily: 'Inter, sans-serif' }}>{errors.email}</p>}
                    </div>
                  </div>

                  {/* Self Intro */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                      自我介绍
                    </label>
                    <textarea
                      placeholder="简单介绍一下自己，你在做什么，有什么想法..."
                      value={form.intro}
                      onChange={(e) => setForm({ ...form, intro: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all resize-none"
                      style={{
                        background: '#FAF7F2',
                        border: '1.5px solid rgba(142,148,242,0.2)',
                        color: '#2D2D2D',
                        fontFamily: 'Inter, sans-serif',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#8E94F2'; e.target.style.boxShadow = '0 0 0 3px rgba(142,148,242,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(142,148,242,0.2)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                {/* Module 02: Shared Interests */}
                <div className="geek-card p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base" style={{ background: 'rgba(184,188,255,0.15)' }}>
                      💡
                    </div>
                    <div>
                      <p className="section-label">MODULE_02</p>
                      <p className="text-sm font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>共同兴趣</p>
                    </div>
                  </div>
                  <p className="text-xs mb-4" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                    勾选你感兴趣的领域（可多选）
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((opt) => (
                      <MultiSelectTag
                        key={opt.id}
                        label={opt.label}
                        selected={form.interests.includes(opt.id)}
                        onToggle={() => toggleArray('interests', opt.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Module 03: Connection Purpose */}
                <div className="geek-card p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base" style={{ background: 'rgba(142,148,242,0.1)' }}>
                      <MessageSquare size={14} style={{ color: '#8E94F2' }} />
                    </div>
                    <div>
                      <p className="section-label">MODULE_03</p>
                      <p className="text-sm font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>连接目的</p>
                    </div>
                  </div>
                  <p className="text-xs mb-4" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                    你希望我们如何连接？（可多选）
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {purposeOptions.map((opt) => {
                      const selected = form.purposes.includes(opt.id);
                      return (
                        <motion.button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleArray('purposes', opt.id)}
                          className="flex items-start gap-3 p-4 rounded-2xl text-left transition-all"
                          style={{
                            background: selected ? 'rgba(142,148,242,0.08)' : 'rgba(250,247,242,0.8)',
                            border: `1.5px solid ${selected ? '#8E94F2' : 'rgba(0,0,0,0.06)'}`,
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{
                              border: `1.5px solid ${selected ? '#8E94F2' : '#C5C8FF'}`,
                              background: selected ? '#8E94F2' : 'transparent',
                            }}
                          >
                            {selected && <span style={{ color: 'white', fontSize: '0.5rem', fontWeight: 'bold' }}>✓</span>}
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: selected ? '#8E94F2' : '#2D2D2D', fontFamily: 'Inter, sans-serif' }}>
                              {opt.label}
                            </p>
                            <p className="text-xs" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                              {opt.desc}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Module 04: Personality */}
                <div className="geek-card p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base" style={{ background: 'rgba(245,158,11,0.1)' }}>
                      ✨
                    </div>
                    <div>
                      <p className="section-label">MODULE_04</p>
                      <p className="text-sm font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>性格标签</p>
                    </div>
                  </div>
                  <p className="text-xs mb-4" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                    选择最符合你的性格标签（可多选）
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {personalityOptions.map((opt) => (
                      <MultiSelectTag
                        key={opt.id}
                        label={opt.label}
                        selected={form.personalities.includes(opt.id)}
                        onToggle={() => toggleArray('personalities', opt.id)}
                        color="#8E94F2"
                      />
                    ))}
                  </div>
                </div>

                {/* Agreement */}
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: 'rgba(142,148,242,0.05)', border: `1.5px solid ${errors.agreed ? '#f87171' : 'rgba(142,148,242,0.15)'}` }}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        border: `1.5px solid ${form.agreed ? '#8E94F2' : '#C5C8FF'}`,
                        background: form.agreed ? '#8E94F2' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => setForm({ ...form, agreed: !form.agreed })}
                    >
                      {form.agreed && <span style={{ color: 'white', fontSize: '0.5rem', fontWeight: 'bold' }}>✓</span>}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#2D2D2D', fontFamily: 'Inter, sans-serif' }}>
                        🌸 我同意建立真诚的连接 <span style={{ color: '#8E94F2' }}>*</span>
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                        我承诺以真诚和尊重的态度进行交流，不发送垃圾信息或骚扰内容。
                      </p>
                    </div>
                  </label>
                  {errors.agreed && <p className="text-xs mt-2 ml-7" style={{ color: '#f87171', fontFamily: 'Inter, sans-serif' }}>{errors.agreed}</p>}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-semibold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #8E94F2, #6B72E8)',
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: '0 4px 20px rgba(142,148,242,0.3)',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(142,148,242,0.45)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send size={16} />
                  发送连接请求 💌
                </motion.button>
              </motion.form>

              {/* ── Right: Sidebar ── */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full lg:w-72 flex-shrink-0 space-y-4 lg:sticky lg:top-24"
              >
                {/* Profile Card */}
                <div className="geek-card p-5">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div
                      className="w-16 h-16 rounded-2xl overflow-hidden mb-3"
                      style={{ boxShadow: '0 4px 16px rgba(142,148,242,0.2)' }}
                    >
                      <img src={AVATAR_URL} alt="Miracle Wu" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-base mb-0.5" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
                      Miracle Wu
                    </h3>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(142,148,242,0.1)', color: '#8E94F2', fontFamily: 'Inter, sans-serif' }}
                    >
                      AI Trainer & CS Student
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { icon: '💬', label: '回复率', value: '98%' },
                      { icon: '⏰', label: '平均回复时间', value: '< 24h' },
                      { icon: '🌸', label: '已建立连接', value: '200+' },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between py-1.5 border-b last:border-b-0" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                        <span className="text-xs flex items-center gap-1.5" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                          {stat.icon} {stat.label}
                        </span>
                        <span className="text-xs font-bold" style={{ color: '#8E94F2', fontFamily: 'JetBrains Mono, monospace' }}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selection Summary */}
                <div className="geek-card p-5">
                  <p className="section-label mb-4">✨ 已选摘要</p>
                  <div className="space-y-3">
                    {[
                      { label: '💡 共同兴趣', items: selectedInterests, color: '#8E94F2' },
                      { label: '🎯 连接目的', items: selectedPurposes, color: '#B8BCFF' },
                      { label: '⭐ 性格标签', items: selectedPersonalities, color: '#A0A4F8' },
                    ].map((section) => (
                      <div key={section.label} className="py-2 border-b last:border-b-0" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                        <p className="text-xs font-medium mb-1.5" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                          {section.label}
                        </p>
                        {section.items.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {section.items.slice(0, 3).map((item, i) => (
                              <span
                                key={i}
                                className="text-xs px-1.5 py-0.5 rounded-lg"
                                style={{
                                  background: `${section.color}15`,
                                  color: section.color,
                                  fontFamily: 'Inter, sans-serif',
                                  fontSize: '0.65rem',
                                }}
                              >
                                {item}
                              </span>
                            ))}
                            {section.items.length > 3 && (
                              <span className="text-xs" style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                                +{section.items.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span
                            className="text-xs px-2 py-0.5 rounded-lg"
                            style={{ background: 'rgba(0,0,0,0.04)', color: '#9B9B9B', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem' }}
                          >
                            未选
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
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
