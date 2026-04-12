/*
 * Navbar — Backdrop Blur Navigation
 * Design: Cyber Cream Geek
 * Features: sticky top, backdrop blur, active route highlight, mobile menu
 */
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Download } from 'lucide-react';

const navLinks = [
  { href: '/', label: '首页', en: 'Home' },
  { href: '/profile', label: '个人资料', en: 'Profile' },
  { href: '/interests', label: '兴趣爱好', en: 'Interests' },
  { href: '/archive', label: '足迹', en: 'Archive' },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="nav-blur fixed top-0 left-0 right-0 z-50"
      style={{ backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', background: 'rgba(250,247,242,0.88)', borderBottom: '1px solid rgba(142,148,242,0.12)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #8E94F2, #B8BCFF)' }}
              >
                <Zap size={14} className="text-white" />
              </div>
              <div>
                <span
                  className="font-bold text-sm"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}
                >
                  Miracle Wu
                </span>
                <span
                  className="hidden sm:block text-xs"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: '#8E94F2', fontSize: '0.6rem', display: 'block', lineHeight: 1 }}
                >
                  AI_TRAINER
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    className="relative px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                    style={{
                      color: isActive ? '#8E94F2' : '#6B6B6B',
                      background: isActive ? 'rgba(142,148,242,0.1)' : 'transparent',
                    }}
                    whileHover={{ background: 'rgba(142,148,242,0.08)', color: '#8E94F2' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: '#8E94F2' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {/* 下载简历 */}
            <motion.a
              href="/resume.pdf"
              download="Miracle_Wu_Resume.pdf"
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-medium"
              style={{
                background: 'transparent',
                color: '#8E94F2',
                border: '1.5px solid rgba(142,148,242,0.25)',
                fontFamily: 'Inter, sans-serif',
              }}
              whileHover={{ scale: 1.05, borderColor: '#8E94F2', background: 'rgba(142,148,242,0.06)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={12} />
              下载简历
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.5rem',
                  background: 'rgba(142,148,242,0.12)',
                  color: '#8E94F2',
                  padding: '1px 4px',
                  borderRadius: '4px',
                  letterSpacing: '0.05em',
                }}
              >
                PDF
              </span>
            </motion.a>

            {/* 联系我 */}
            <motion.a
              href="mailto:wjq13307822575@gmail.com"
              className="px-4 py-2 rounded-2xl text-sm font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #8E94F2, #6B72E8)', fontFamily: 'Inter, sans-serif' }}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 16px rgba(142,148,242,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              ✉ 联系我
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl"
            style={{ color: '#2D2D2D' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t"
            style={{ borderColor: 'rgba(142,148,242,0.12)', background: 'rgba(250,247,242,0.97)' }}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <div
                      className="block px-4 py-3 rounded-xl text-sm font-medium"
                      style={{
                        color: isActive ? '#8E94F2' : '#2D2D2D',
                        background: isActive ? 'rgba(142,148,242,0.1)' : 'transparent',
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
