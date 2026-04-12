/*
 * Footer — Shared across all pages
 * Design: Cyber Cream Geek
 */
import { Link } from 'wouter';
import { Github, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const socialLinks = [
  {
    icon: <Github size={13} />,
    href: 'https://github.com/MiracleJiaqi',
    label: 'GitHub',
  },
  {
    icon: <Mail size={13} />,
    href: 'mailto:wjq13307822575@gmail.com',
    label: 'Email',
  },
];

export default function Footer() {
  return (
    <footer className="py-8 border-t" style={{ borderColor: 'rgba(142,148,242,0.1)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* 左：版权 */}
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#9B9B9B' }}>
          © 2026 Miracle Wu · Built with ⚡
        </p>

        {/* 中：社交图标 */}
        <div className="flex items-center gap-3">
          {socialLinks.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
              aria-label={s.label}
              className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{
                color: '#9B9B9B',
                background: 'rgba(142,148,242,0.06)',
                border: '1px solid rgba(142,148,242,0.1)',
              }}
              whileHover={{ color: '#8E94F2', borderColor: 'rgba(142,148,242,0.3)', scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {s.icon}
            </motion.a>
          ))}
        </div>

        {/* 右：返回首页 */}
        <Link href="/">
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#8E94F2', cursor: 'pointer' }}>
            返回首页 ↑
          </span>
        </Link>

      </div>
    </footer>
  );
}
