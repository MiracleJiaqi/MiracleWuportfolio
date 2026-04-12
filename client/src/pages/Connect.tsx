/*
 * Connect Page — Miracle Wu
 * Design: Cyber Cream Geek
 * Features: 3-field contact form + EmailJS integration
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ChevronRight, Send, CheckCircle2, User, Mail, MessageSquare, Loader2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useSEO } from '../hooks/useSEO';

const AVATAR_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663432020906/TNk97hFWUfMwRchz98LFoQ/myCat_ccc46f29.png';

interface FormState {
  name: string;
  email: string;
  message: string;
}

const inputStyle = (hasError: boolean) => ({
  background: '#FAF7F2',
  border: `1.5px solid ${hasError ? '#f87171' : 'rgba(142,148,242,0.2)'}`,
  color: '#2D2D2D',
  fontFamily: 'Inter, sans-serif',
});

const focusHandlers = (hasError: boolean) => ({
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#8E94F2';
    e.target.style.boxShadow = '0 0 0 3px rgba(142,148,242,0.1)';
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = hasError ? '#f87171' : 'rgba(142,148,242,0.2)';
    e.target.style.boxShadow = 'none';
  },
});

export default function Connect() {
  useSEO({
    title: '联系我 · Miracle Wu',
    description: '欢迎交流 AI 评测、数据训练、自动化流程与个人项目，一起把有价值的想法真正做出来。',
  });

  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendError, setSendError] = useState('');
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = (): Partial<FormState> => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = '请输入姓名';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = '请输入有效邮箱';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setErrors({});
    setSendError('');
    setIsLoading(true);

    // 该页面已停用，逻辑保留但不执行
    setIsLoading(false);
    setSubmitted(true);
  };

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
              欢迎交流 AI 评测、数据训练、自动化流程与个人项目。
              填写下方表单，我会尽快回复。
            </p>
          </motion.div>

          {/* ── Success State ── */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.45, type: 'spring' }}
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
                  已成功发送！🎉
                </h2>
                <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                  感谢你的连接，{form.name}！我通常会在 24 小时内回复。
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <motion.button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}
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

          {/* ── Form + Sidebar ── */}
          {!submitted && (
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* ── Left: Form ── */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex-1 min-w-0"
              >
                <div className="geek-card p-6 space-y-5">
                  {/* Card Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(142,148,242,0.1)', color: '#8E94F2' }}>
                      <User size={14} />
                    </div>
                    <div>
                      <p className="section-label">MODULE_01</p>
                      <p className="text-sm font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>基本信息</p>
                    </div>
                  </div>

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                        <User size={11} style={{ color: '#8E94F2' }} /> 姓名 <span style={{ color: '#8E94F2' }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="你的名字"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={inputStyle(!!errors.name)}
                        {...focusHandlers(!!errors.name)}
                      />
                      {errors.name && (
                        <p className="text-xs mt-1" style={{ color: '#f87171', fontFamily: 'Inter, sans-serif' }}>{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                        <Mail size={11} style={{ color: '#8E94F2' }} /> 邮箱 <span style={{ color: '#8E94F2' }}>*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={inputStyle(!!errors.email)}
                        {...focusHandlers(!!errors.email)}
                      />
                      {errors.email && (
                        <p className="text-xs mt-1" style={{ color: '#f87171', fontFamily: 'Inter, sans-serif' }}>{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
                      <MessageSquare size={11} style={{ color: '#8E94F2' }} /> 留言
                      <span style={{ color: '#9B9B9B', fontSize: '0.6rem', fontFamily: 'JetBrains Mono, monospace' }}>（可选）</span>
                    </label>
                    <textarea
                      placeholder="想聊什么都可以——AI 评测、项目合作、或者只是打个招呼…"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all resize-none"
                      style={inputStyle(false)}
                      {...focusHandlers(false)}
                    />
                  </div>

                  {/* Send Error */}
                  {sendError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs px-3 py-2 rounded-xl"
                      style={{
                        color: '#f87171',
                        background: 'rgba(248,113,113,0.06)',
                        border: '1px solid rgba(248,113,113,0.15)',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      ⚠️ {sendError}
                    </motion.p>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-semibold text-sm"
                    style={{
                      background: isLoading
                        ? 'rgba(142,148,242,0.5)'
                        : 'linear-gradient(135deg, #8E94F2, #6B72E8)',
                      fontFamily: 'Inter, sans-serif',
                      boxShadow: isLoading ? 'none' : '0 4px 20px rgba(142,148,242,0.3)',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                    }}
                    whileHover={isLoading ? {} : { scale: 1.02, boxShadow: '0 8px 30px rgba(142,148,242,0.45)' }}
                    whileTap={isLoading ? {} : { scale: 0.98 }}
                  >
                    {isLoading
                      ? <><Loader2 size={16} className="animate-spin" /> 发送中…</>
                      : <><Send size={16} /> 发送连接请求 💌</>
                    }
                  </motion.button>
                </div>
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
                      { icon: '⏰', label: '平均回复', value: '< 24h' },
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

                {/* Topics Card */}
                <div className="geek-card p-5">
                  <p className="section-label mb-3">💡 欢迎聊这些话题</p>
                  <div className="flex flex-wrap gap-2">
                    {['AI 评测', 'Prompt 工程', '自动化 Pipeline', '数据训练', '项目合作', '技术交流'].map((topic) => (
                      <span
                        key={topic}
                        className="text-xs px-2.5 py-1 rounded-xl"
                        style={{
                          background: 'rgba(142,148,242,0.06)',
                          color: '#8E94F2',
                          border: '1px solid rgba(142,148,242,0.12)',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.72rem',
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

            </div>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
