/*
 * Archive Page — Miracle Wu
 * Design: Cyber Cream Geek
 * 足迹：视频记录在上，图像记录在下，明显分隔
 *
 * 内容管理流程：
 *  1. 点右下角 ⚙ → 输密码 wjq030501+ → 进入管理模式（⚙ 变紫色）
 *  2. 管理模式下，每张卡片右上角出现红色 × 删除按钮
 *  3. 点删除 → 弹出全屏确认框 → 再次输密码 → 确认删除/隐藏
 *  4. 再次点 ⚙ 退出管理模式
 *
 * 面板右下角还有一个"添加内容"面板（点⚙后旁边会出现 + 按钮）
 */
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ChevronRight, X, Play, Settings, Plus, AlertTriangle, EyeOff, RotateCcw } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useSEO } from '../hooks/useSEO';

// ── Types ──────────────────────────────────────────────────────────────
type Category = 'moments' | 'bjtu' | 'past' | 'tech' | 'pipeline';
type MediaType = 'image' | 'bilibili' | 'youtube';

interface MediaItem {
  id: string;
  type: MediaType;
  category: Category;
  title: string;
  desc?: string;
  date: string;
  src?: string;
  bvid?: string;
  ytid?: string;
  thumbnail?: string;
  tags?: string[];
  aspect?: 'square' | 'landscape' | 'portrait';
  _local?: boolean;
}

// ── LocalStorage ────────────────────────────────────────────────────────
const LS_KEY        = 'mw_archive_items';
const LS_HIDDEN_KEY = 'mw_archive_hidden';

function loadLocalItems(): MediaItem[]  { try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'); } catch { return []; } }
function saveLocalItems(items: MediaItem[]) { localStorage.setItem(LS_KEY, JSON.stringify(items)); }
function loadHiddenIds(): string[]      { try { return JSON.parse(localStorage.getItem(LS_HIDDEN_KEY) ?? '[]'); } catch { return []; } }
function saveHiddenIds(ids: string[])   { localStorage.setItem(LS_HIDDEN_KEY, JSON.stringify(ids)); }

// ── URL Parsers ─────────────────────────────────────────────────────────
function extractBvid(input: string): string { const m = input.match(/BV[A-Za-z0-9]+/); return m ? m[0] : input.trim(); }
function extractYtid(input: string): string { const m = input.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : input.trim(); }

// ── Categories ─────────────────────────────────────────────────────────
const categories = [
  { id: 'all',      label: '全部' },
  { id: 'moments',  label: '片刻剪影' },
  { id: 'bjtu',     label: 'BJTU' },
  { id: 'past',     label: '往事且曼' },
  { id: 'tech',     label: '技术追踪' },
  { id: 'pipeline', label: 'Pipeline 实践' },
];

const categoryLabels: Record<string, string> = {
  moments: '片刻剪影', bjtu: 'BJTU', past: '往事且曼', tech: '技术追踪', pipeline: 'Pipeline 实践',
};

// ── Media Data ─────────────────────────────────────────────────────────
const CDN = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663432020906/TNk97hFWUfMwRchz98LFoQ';

const mediaItems: MediaItem[] = [
  { id: '1', type: 'image',    category: 'moments',  title: '生活瞬间',          desc: '日常随拍，替换为你的真实照片',           date: '2026.03', src: `${CDN}/myCat_ccc46f29.png`,                                  tags: ['生活'],            aspect: 'square'    },
  { id: '2', type: 'image',    category: 'tech',     title: '个人网站上线',      desc: '作品集网站截图，记录建站过程',           date: '2026.04', src: `${CDN}/profile-card-bg-mNT25FaS9nxYVGtFF3nh4t.webp`,        tags: ['项目', 'Web'],     aspect: 'landscape' },
  { id: '3', type: 'bilibili', category: 'pipeline', title: '自动化 Pipeline 演示', desc: '脚本跑通后的流程录屏，替换为真实 BV 号', date: '2026.03', bvid: 'BV1GJ411x7h7', thumbnail: `${CDN}/hero-avatar-MYmpxB9zZdZ74Vq8bwruYg.webp`, tags: ['自动化', 'Python'], aspect: 'landscape' },
  { id: '4', type: 'image',    category: 'tech',     title: 'AI 内容创作成果',   desc: '自媒体配图或封面设计，替换为真实素材', date: '2026.02', src: `${CDN}/hero-avatar-MYmpxB9zZdZ74Vq8bwruYg.webp`,           tags: ['AI', '内容创作'], aspect: 'portrait'  },
  { id: '5', type: 'image',    category: 'pipeline', title: '评测数据可视化',    desc: '模型评测结果截图或数据图表',           date: '2026.03', src: `${CDN}/myCat_ccc46f29.png`,                                  tags: ['评测', 'Benchmark'], aspect: 'landscape' },
  { id: '6', type: 'image',    category: 'bjtu',     title: '阶段性记录',        desc: '某个值得留下来的时刻',                 date: '2026.01', src: `${CDN}/hero-avatar-MYmpxB9zZdZ74Vq8bwruYg.webp`,           tags: ['BJTU', '记录'],   aspect: 'square'    },
];

// ── Helpers ────────────────────────────────────────────────────────────
const aspectClass: Record<NonNullable<MediaItem['aspect']>, string> = {
  square: 'aspect-square', landscape: 'aspect-video', portrait: 'aspect-[3/4]',
};
const isVideo   = (item: MediaItem) => item.type === 'bilibili' || item.type === 'youtube';
const embedSrc  = (item: MediaItem) =>
  item.type === 'bilibili' ? `https://player.bilibili.com/player.html?bvid=${item.bvid}&page=1&high_quality=1&danmaku=0&autoplay=1`
  : item.type === 'youtube' ? `https://www.youtube.com/embed/${item.ytid}?autoplay=1`
  : '';

// ── SectionHeader / Divider ─────────────────────────────────────────────
function SectionHeader({ label, icon, count }: { label: string; icon: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-lg">{icon}</span>
      <span style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D', fontWeight: 600, fontSize: '1rem' }}>{label}</span>
      <span className="px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(142,148,242,0.1)', color: '#8E94F2', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem' }}>
        {count}
      </span>
    </div>
  );
}
function ArchiveDivider() {
  return (
    <div className="flex items-center gap-4 my-10">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(142,148,242,0.3))' }} />
      <span className="px-3 py-1 rounded-full flex-shrink-0"
        style={{ background: 'rgba(142,148,242,0.06)', color: '#8E94F2', border: '1px solid rgba(142,148,242,0.2)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.08em' }}>
        ── 图像记录 ──
      </span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(142,148,242,0.3))' }} />
    </div>
  );
}

// ── MediaCard — 管理模式下右上角显示删除按钮 ────────────────────────────
function MediaCard({ item, index, adminMode, onClick, onRemove }: {
  item: MediaItem;
  index: number;
  adminMode: boolean;
  onClick: (item: MediaItem) => void;
  onRemove: (item: MediaItem) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="geek-card overflow-hidden mb-5 break-inside-avoid group relative"
      style={{ cursor: adminMode ? 'default' : 'pointer' }}
    >
      {/* 媒体区域 — 非管理模式才可点开大图/视频 */}
      <div onClick={() => !adminMode && onClick(item)}>
        <div className={`relative overflow-hidden ${aspectClass[item.aspect ?? 'landscape']}`}>
          <img
            src={item.src ?? item.thumbnail ?? ''}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {isVideo(item) && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.32)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(142,148,242,0.92)', backdropFilter: 'blur(4px)' }}>
                <Play size={20} className="text-white" style={{ marginLeft: '2px' }} />
              </div>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-white"
                style={{ background: item.type === 'bilibili' ? 'rgba(0,161,214,0.85)' : 'rgba(255,0,0,0.8)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', backdropFilter: 'blur(4px)' }}>
                {item.type === 'bilibili' ? 'Bilibili' : 'YouTube'}
              </span>
            </div>
          )}
          {item._local && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg"
              style={{ background: 'rgba(142,148,242,0.85)', color: 'white', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.5rem', backdropFilter: 'blur(4px)' }}>
              本地
            </span>
          )}
          {!adminMode && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)' }} />
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-sm font-semibold leading-snug" style={{ color: '#2D2D2D', fontFamily: 'Playfair Display, serif' }}>{item.title}</h3>
            <span className="flex-shrink-0 mt-0.5" style={{ color: '#9B9B9B', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem' }}>{item.date}</span>
          </div>
          {item.desc && <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>{item.desc}</p>}
          <div className="flex flex-wrap gap-1.5">
            {item.tags?.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-lg"
                style={{ background: 'rgba(142,148,242,0.06)', color: '#8E94F2', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', border: '1px solid rgba(142,148,242,0.12)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 管理模式：右上角删除按钮 ── */}
      <AnimatePresence>
        {adminMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={e => { e.stopPropagation(); onRemove(item); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(239,68,68,0.9)',
              boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              zIndex: 10,
            }}
            title={item._local ? '删除此内容' : '隐藏此内容'}
          >
            <X size={13} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 管理模式：整体红色边框提示 */}
      <AnimatePresence>
        {adminMode && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ border: '2px solid rgba(239,68,68,0.25)' }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── 删除/隐藏确认 Modal（全屏居中）──────────────────────────────────────
function RemoveConfirmModal({ item, onConfirm, onCancel }: {
  item: MediaItem;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [pw, setPw]   = useState('');
  const [err, setErr] = useState(false);
  const inputRef      = useRef<HTMLInputElement>(null);
  const isHide        = !item._local;

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 120); }, []);

  const confirm = () => {
    if (pw === 'wjq030501+') { onConfirm(); }
    else { setErr(true); setPw(''); setTimeout(() => { setErr(false); inputRef.current?.focus(); }, 1400); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(10,10,15,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.88, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="w-full max-w-sm geek-card p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* 图标 + 标题 */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
            style={{ background: isHide ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', border: `1.5px solid ${isHide ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            {isHide
              ? <EyeOff size={20} style={{ color: '#f59e0b' }} />
              : <AlertTriangle size={20} style={{ color: '#ef4444' }} />
            }
          </div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', fontWeight: 700, color: '#2D2D2D', marginBottom: '6px' }}>
            {isHide ? '隐藏此内容' : '删除此内容'}
          </h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6B6B6B', lineHeight: 1.6 }}>
            {isHide
              ? <>确认隐藏「<span style={{ color: '#2D2D2D', fontWeight: 600 }}>{item.title}</span>」？可在管理面板中随时恢复。</>
              : <>确认删除「<span style={{ color: '#2D2D2D', fontWeight: 600 }}>{item.title}</span>」？此操作<span style={{ color: '#ef4444' }}>不可撤销</span>。</>
            }
          </p>
        </div>

        {/* 密码输入 */}
        <div className="mb-4">
          <label style={{ display: 'block', fontSize: '0.68rem', color: '#9B9B9B', fontFamily: 'JetBrains Mono, monospace', marginBottom: '6px' }}>
            输入管理密码以确认
          </label>
          <input
            ref={inputRef}
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && confirm()}
            placeholder="请输入密码"
            className="w-full px-3 py-2.5 rounded-xl text-sm"
            style={{
              border: `1.5px solid ${err ? 'rgba(239,68,68,0.5)' : 'rgba(142,148,242,0.2)'}`,
              background: err ? 'rgba(254,202,202,0.1)' : 'rgba(142,148,242,0.04)',
              color: '#2D2D2D', fontFamily: 'Inter, sans-serif', outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
          <AnimatePresence>
            {err && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ fontSize: '0.65rem', color: '#ef4444', fontFamily: 'Inter, sans-serif', marginTop: '5px' }}>
                密码错误，请重试
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* 按钮 */}
        <div className="flex gap-2.5">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(142,148,242,0.06)', color: '#6B6B6B', border: '1px solid rgba(142,148,242,0.15)', fontFamily: 'Inter, sans-serif' }}>
            取消
          </button>
          <button onClick={confirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: isHide ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #f87171, #ef4444)', fontFamily: 'Inter, sans-serif' }}>
            {isHide ? '确认隐藏' : '确认删除'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── 添加内容面板 ─────────────────────────────────────────────────────────
interface FormState {
  type: MediaType; category: Category; title: string; desc: string;
  date: string; tagsRaw: string; src: string;
  aspect: 'square' | 'landscape' | 'portrait'; videoUrl: string; thumbnail: string;
}
const defaultForm: FormState = {
  type: 'image', category: 'moments', title: '', desc: '',
  date: new Date().toISOString().slice(0, 7).replace('-', '.'),
  tagsRaw: '', src: '', aspect: 'landscape', videoUrl: '', thumbnail: '',
};

function AddPanel({ onAdd, onClose }: { onAdd: (item: MediaItem) => void; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const set = (key: keyof FormState, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleAdd = () => {
    if (!form.title.trim()) return;
    const id   = `local_${Date.now()}`;
    const tags = form.tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
    const item: MediaItem = {
      id, type: form.type, category: form.category,
      title: form.title, desc: form.desc || undefined,
      date: form.date, tags, _local: true,
      ...(form.type === 'image'
        ? { src: form.src, aspect: form.aspect }
        : form.type === 'bilibili'
          ? { bvid: extractBvid(form.videoUrl), thumbnail: form.thumbnail || undefined, aspect: 'landscape' as const }
          : { ytid: extractYtid(form.videoUrl), thumbnail: form.thumbnail || undefined, aspect: 'landscape' as const }),
    };
    onAdd(item);
    setForm(defaultForm);
  };

  const inp: React.CSSProperties = { width: '100%', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid rgba(142,148,242,0.2)', background: 'rgba(142,148,242,0.04)', color: '#2D2D2D', fontFamily: 'Inter, sans-serif', outline: 'none' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: '0.65rem', color: '#9B9B9B', fontFamily: 'JetBrains Mono, monospace', marginBottom: '4px' };
  const TypeBtn = ({ t, label }: { t: MediaType; label: string }) => (
    <button onClick={() => set('type', t)} className="flex-1 py-1.5 rounded-lg text-xs font-medium"
      style={{ background: form.type === t ? '#8E94F2' : 'rgba(142,148,242,0.06)', color: form.type === t ? 'white' : '#8E94F2', border: `1px solid ${form.type === t ? '#8E94F2' : 'rgba(142,148,242,0.15)'}`, fontFamily: 'Inter, sans-serif' }}>
      {label}
    </button>
  );
  const AspBtn = ({ a, label }: { a: 'square' | 'landscape' | 'portrait'; label: string }) => (
    <button onClick={() => set('aspect', a)} className="flex-1 py-1.5 rounded-lg text-xs"
      style={{ background: form.aspect === a ? 'rgba(142,148,242,0.15)' : 'transparent', color: form.aspect === a ? '#8E94F2' : '#9B9B9B', border: `1px solid ${form.aspect === a ? 'rgba(142,148,242,0.3)' : 'rgba(142,148,242,0.1)'}`, fontFamily: 'Inter, sans-serif' }}>
      {label}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 20, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="fixed bottom-20 right-4 z-50 w-72 rounded-2xl overflow-hidden"
      style={{ background: 'rgba(250,247,242,0.97)', border: '1px solid rgba(142,148,242,0.2)', boxShadow: '0 12px 40px rgba(142,148,242,0.18)', backdropFilter: 'blur(16px)', maxHeight: '78vh', overflowY: 'auto' }}
    >
      <div className="flex items-center justify-between px-4 py-3 sticky top-0"
        style={{ borderBottom: '1px solid rgba(142,148,242,0.1)', background: 'rgba(250,247,242,0.97)' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#2D2D2D', fontWeight: 600 }}>➕ 添加内容</span>
        <button onClick={onClose} style={{ color: '#9B9B9B' }}><X size={14} /></button>
      </div>

      <div className="p-4 space-y-3">
        <div><span style={lbl}>内容类型</span><div className="flex gap-1.5"><TypeBtn t="image" label="🖼 图片" /><TypeBtn t="bilibili" label="📺 B站" /><TypeBtn t="youtube" label="▶ YT" /></div></div>
        <div>
          <span style={lbl}>分类</span>
          <select value={form.category} onChange={e => set('category', e.target.value)} style={inp}>
            {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div><span style={lbl}>标题 *</span><input value={form.title} onChange={e => set('title', e.target.value)} placeholder="简短标题" style={inp} /></div>
        <div><span style={lbl}>描述（可选）</span><textarea value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="一句话说明" rows={2} style={{ ...inp, resize: 'none' }} /></div>
        <div className="flex gap-2">
          <div className="flex-1"><span style={lbl}>日期</span><input value={form.date} onChange={e => set('date', e.target.value)} placeholder="2026.04" style={inp} /></div>
          <div className="flex-1"><span style={lbl}>标签（逗号分隔）</span><input value={form.tagsRaw} onChange={e => set('tagsRaw', e.target.value)} placeholder="AI,生活" style={inp} /></div>
        </div>
        {form.type === 'image' && (
          <>
            <div><span style={lbl}>图片 URL</span><input value={form.src} onChange={e => set('src', e.target.value)} placeholder="https://..." style={inp} /></div>
            <div><span style={lbl}>宽高比</span><div className="flex gap-1.5"><AspBtn a="landscape" label="横版" /><AspBtn a="square" label="正方" /><AspBtn a="portrait" label="竖版" /></div></div>
          </>
        )}
        {(form.type === 'bilibili' || form.type === 'youtube') && (
          <>
            <div>
              <span style={lbl}>{form.type === 'bilibili' ? 'B站链接或BV号' : 'YouTube链接或视频ID'}</span>
              <input value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)}
                placeholder={form.type === 'bilibili' ? 'BV1xxxxxx 或完整链接' : '视频ID 或完整链接'} style={inp} />
              {form.videoUrl && (
                <p style={{ fontSize: '0.6rem', color: '#8E94F2', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px' }}>
                  识别为：{form.type === 'bilibili' ? extractBvid(form.videoUrl) : extractYtid(form.videoUrl)}
                </p>
              )}
            </div>
            <div><span style={lbl}>封面图 URL（可选）</span><input value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)} placeholder="https://..." style={inp} /></div>
          </>
        )}
        <motion.button onClick={handleAdd} disabled={!form.title.trim()}
          className="w-full py-2 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-1.5"
          style={{ background: form.title.trim() ? 'linear-gradient(135deg, #8E94F2, #6B72E8)' : 'rgba(142,148,242,0.3)', fontFamily: 'Inter, sans-serif', cursor: form.title.trim() ? 'pointer' : 'not-allowed' }}
          whileHover={form.title.trim() ? { scale: 1.02 } : {}} whileTap={form.title.trim() ? { scale: 0.97 } : {}}>
          <Plus size={13} /> 添加到页面
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── 密码验证入口 ─────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw]   = useState('');
  const [err, setErr] = useState(false);
  const ref           = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => ref.current?.focus(), 100); }, []);
  const check = () => {
    if (pw === 'wjq030501+') onUnlock();
    else { setErr(true); setPw(''); setTimeout(() => setErr(false), 1500); }
  };
  return (
    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
      className="fixed bottom-20 right-4 z-50 p-4 w-64 rounded-2xl"
      style={{ background: 'rgba(250,247,242,0.97)', border: '1px solid rgba(142,148,242,0.2)', boxShadow: '0 8px 32px rgba(142,148,242,0.15)', backdropFilter: 'blur(16px)' }}>
      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#2D2D2D', fontWeight: 600, marginBottom: '10px' }}>🔒 输入管理密码</p>
      <input ref={ref} type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()}
        placeholder="密码" className="w-full px-3 py-2 rounded-xl text-sm mb-2"
        style={{ border: `1px solid ${err ? 'rgba(248,113,113,0.5)' : 'rgba(142,148,242,0.2)'}`, background: err ? 'rgba(254,202,202,0.1)' : 'rgba(142,148,242,0.04)', color: '#2D2D2D', fontFamily: 'Inter, sans-serif', outline: 'none' }} />
      {err && <p style={{ fontSize: '0.6rem', color: '#f87171', fontFamily: 'Inter, sans-serif', marginBottom: '6px' }}>密码错误，请重试</p>}
      <button onClick={check} className="w-full py-1.5 rounded-xl text-xs text-white"
        style={{ background: 'linear-gradient(135deg, #8E94F2, #6B72E8)', fontFamily: 'Inter, sans-serif' }}>确认</button>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────
export default function Archive() {
  useSEO({ title: '足迹 · Miracle Wu', description: '生活瞬间、项目截图、自动化成果与 AI 创作——做过什么，比说过什么更真实。' });

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeItem, setActiveItem]         = useState<MediaItem | null>(null);
  const [localItems, setLocalItems]         = useState<MediaItem[]>(() => loadLocalItems());
  const [hiddenIds, setHiddenIds]           = useState<string[]>(() => loadHiddenIds());

  // 管理模式状态
  const [adminMode, setAdminMode]         = useState(false);   // 管理模式（卡片显示删除键）
  const [pwVisible, setPwVisible]         = useState(false);   // 密码输入框
  const [addPanelOpen, setAddPanelOpen]   = useState(false);   // 添加面板

  // 删除/隐藏确认
  const [removeTarget, setRemoveTarget]   = useState<MediaItem | null>(null);

  // Persist
  useEffect(() => { saveLocalItems(localItems); }, [localItems]);
  useEffect(() => { saveHiddenIds(hiddenIds); }, [hiddenIds]);

  const allItems = useMemo(
    () => [...mediaItems.filter(m => !hiddenIds.includes(m.id)), ...localItems],
    [localItems, hiddenIds],
  );

  const filtered = useMemo(
    () => activeCategory === 'all' ? allItems : allItems.filter(m => m.category === activeCategory),
    [activeCategory, allItems],
  );

  const videoItems = filtered.filter(isVideo);
  const imageItems = filtered.filter(m => m.type === 'image');

  // ── 管理模式开关 ──
  const handleGearClick = () => {
    if (adminMode) {
      // 退出管理模式
      setAdminMode(false);
      setAddPanelOpen(false);
    } else {
      // 还未解锁 → 弹密码框
      setPwVisible(true);
    }
  };

  const handleUnlock = () => {
    setPwVisible(false);
    setAdminMode(true);
  };

  // ── 内容操作 ──
  const handleAdd    = (item: MediaItem) => setLocalItems(prev => [item, ...prev]);

  const handleRemove = (item: MediaItem) => setRemoveTarget(item);

  const handleConfirmRemove = () => {
    if (!removeTarget) return;
    if (removeTarget._local) {
      setLocalItems(prev => prev.filter(i => i.id !== removeTarget.id));
    } else {
      setHiddenIds(prev => [...prev, removeTarget.id]);
    }
    setRemoveTarget(null);
  };

  // 恢复所有隐藏（管理模式底部提示用）
  const handleRestoreAll = () => setHiddenIds([]);

  return (
    <PageTransition>
      <main style={{ background: 'transparent' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Breadcrumb */}
          <div className="breadcrumb flex items-center gap-2 mb-8">
            <Link href="/"><span className="cursor-pointer" style={{ color: '#8E94F2' }}>首页</span></Link>
            <ChevronRight size={12} style={{ color: '#C5C8FF' }} />
            <span style={{ color: '#9B9B9B' }}>足迹</span>
          </div>

          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
            <p className="section-label mb-2">ARCHIVE · PERSONAL_TRAJECTORY</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
              足迹 <span style={{ color: '#8E94F2' }}>Archive</span>
            </h1>
            <p className="text-sm max-w-lg leading-relaxed" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
              做过什么，比说过什么更真实。这里记录生活瞬间、项目过程与实际产出。
            </p>
          </motion.div>

          {/* 管理模式提示条 */}
          <AnimatePresence>
            {adminMode && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="flex items-center justify-between rounded-2xl px-4 py-2.5 mb-6"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '0.7rem', color: '#ef4444', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                    ✏️ 管理模式已开启
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#9B9B9B', fontFamily: 'Inter, sans-serif' }}>
                    — 点击卡片右上角 × 可删除/隐藏内容
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {hiddenIds.length > 0 && (
                    <button onClick={handleRestoreAll}
                      className="flex items-center gap-1 text-xs"
                      style={{ color: '#f59e0b', fontFamily: 'Inter, sans-serif', fontSize: '0.65rem' }}>
                      <RotateCcw size={10} /> 恢复 {hiddenIds.length} 条隐藏
                    </button>
                  )}
                  <button onClick={() => { setAdminMode(false); setAddPanelOpen(false); }}
                    style={{ color: '#9B9B9B', fontSize: '0.65rem', fontFamily: 'Inter, sans-serif' }}>
                    退出
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="flex gap-2 mb-8 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}
          >
            {categories.map(cat => {
              const active = activeCategory === cat.id;
              return (
                <motion.button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: active ? '#8E94F2' : 'rgba(142,148,242,0.08)', color: active ? 'white' : '#8E94F2', border: `1px solid ${active ? '#8E94F2' : 'rgba(142,148,242,0.2)'}`, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  {cat.label}
                </motion.button>
              );
            })}
          </motion.div>

          {/* ── Sectioned Media Grid ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {videoItems.length > 0 && (
                <>
                  <SectionHeader label="视频记录" icon="📹" count={videoItems.length} />
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 mb-2">
                    {videoItems.map((item, i) => (
                      <MediaCard key={item.id} item={item} index={i} adminMode={adminMode} onClick={setActiveItem} onRemove={handleRemove} />
                    ))}
                  </div>
                </>
              )}

              {videoItems.length > 0 && imageItems.length > 0 && <ArchiveDivider />}

              {imageItems.length > 0 && (
                <>
                  {videoItems.length > 0 && <SectionHeader label="图像记录" icon="🖼️" count={imageItems.length} />}
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
                    {imageItems.map((item, i) => (
                      <MediaCard key={item.id} item={item} index={i} adminMode={adminMode} onClick={setActiveItem} onRemove={handleRemove} />
                    ))}
                  </div>
                </>
              )}

              {videoItems.length === 0 && imageItems.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                  <p style={{ color: '#C5C8FF', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
                    该分类暂无内容，持续更新中……
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Lightbox / Video Modal ── */}
        <AnimatePresence>
          {activeItem && !adminMode && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10"
              style={{ background: 'rgba(10,10,15,0.82)', backdropFilter: 'blur(10px)' }}
              onClick={() => setActiveItem(null)}
            >
              <motion.div
                initial={{ scale: 0.93, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.93, opacity: 0, y: 12 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="relative w-full max-w-3xl"
                onClick={e => e.stopPropagation()}
              >
                <button className="absolute -top-9 right-0 flex items-center gap-1.5 text-xs"
                  style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif' }}
                  onClick={() => setActiveItem(null)}>
                  <X size={13} /> 关闭
                </button>
                <div className="geek-card overflow-hidden">
                  {activeItem.type === 'image' && <img src={activeItem.src} alt={activeItem.title} className="w-full object-contain" style={{ maxHeight: '68vh' }} />}
                  {isVideo(activeItem) && (
                    <div className="aspect-video w-full bg-black">
                      <iframe src={embedSrc(activeItem)} className="w-full h-full" allowFullScreen allow="autoplay; fullscreen" frameBorder="0" scrolling="no" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <h2 className="font-semibold text-base" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>{activeItem.title}</h2>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: '#9B9B9B' }}>{activeItem.date}</span>
                    </div>
                    {activeItem.desc && <p className="text-sm leading-relaxed mb-3" style={{ color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>{activeItem.desc}</p>}
                    <div className="flex flex-wrap gap-1.5">
                      {activeItem.tags?.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-lg"
                          style={{ background: 'rgba(142,148,242,0.08)', color: '#8E94F2', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 删除/隐藏确认 Modal ── */}
        <AnimatePresence>
          {removeTarget && (
            <RemoveConfirmModal
              item={removeTarget}
              onConfirm={handleConfirmRemove}
              onCancel={() => setRemoveTarget(null)}
            />
          )}
        </AnimatePresence>

        {/* ── 右下角浮标组 ── */}
        <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2">
          {/* 添加内容按钮（管理模式下显示） */}
          <AnimatePresence>
            {adminMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: 8 }}
                onClick={() => setAddPanelOpen(v => !v)}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: addPanelOpen ? '#8E94F2' : 'rgba(250,247,242,0.9)', border: '1px solid rgba(142,148,242,0.3)', boxShadow: '0 4px 14px rgba(142,148,242,0.2)', backdropFilter: 'blur(12px)', color: addPanelOpen ? 'white' : '#8E94F2' }}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
                title="添加内容"
              >
                <Plus size={15} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* ⚙ 主按钮 */}
          <motion.button
            onClick={handleGearClick}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: adminMode ? 'rgba(239,68,68,0.85)' : 'rgba(250,247,242,0.88)',
              border: `1px solid ${adminMode ? 'rgba(239,68,68,0.4)' : 'rgba(142,148,242,0.25)'}`,
              boxShadow: adminMode ? '0 4px 16px rgba(239,68,68,0.3)' : '0 4px 16px rgba(142,148,242,0.2)',
              backdropFilter: 'blur(12px)',
              color: adminMode ? 'white' : '#8E94F2',
            }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
            title={adminMode ? '退出管理模式' : '进入管理模式'}
          >
            <Settings size={15} />
          </motion.button>
        </div>

        {/* 密码框 */}
        <AnimatePresence>
          {pwVisible && <PasswordGate onUnlock={handleUnlock} />}
        </AnimatePresence>

        {/* 添加内容面板 */}
        <AnimatePresence>
          {adminMode && addPanelOpen && (
            <AddPanel onAdd={handleAdd} onClose={() => setAddPanelOpen(false)} />
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
}
