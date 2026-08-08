'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SectionDots } from './SectionDots';
import { AboutSection } from './sections/AboutSection';
import { HowIWorkSection } from './sections/HowIWorkSection';
import { SkillsSection } from './sections/SkillsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { CareerSection } from './sections/CareerSection';
import { BlogSection } from './sections/BlogSection';
import { ContactSection } from './sections/ContactSection';
import { useTerminalContext } from '@/contexts/TerminalContext';
import styles from './HomePage.module.css';

const canScroll = (el: HTMLElement, direction: 'up' | 'down'): boolean =>
  direction === 'down'
    ? el.scrollTop + el.clientHeight < el.scrollHeight - 1
    : el.scrollTop > 0;

const SECTIONS = ['about', 'how-i-work', 'skills', 'projects', 'career', 'blog', 'contact'] as const;

const SECTION_LABELS: Record<(typeof SECTIONS)[number], string> = {
  about: 'About',
  'how-i-work': 'How I Work',
  skills: 'Skills',
  projects: 'Projects',
  career: 'Career',
  blog: 'Blog',
  contact: 'Contact',
};
const TRANSITION_DURATION = 800;
const WHEEL_COOLDOWN = 1000;
const WHEEL_THRESHOLD = 50;
const TOUCH_THRESHOLD = 50;

export function HomePage() {
  const ctx = useTerminalContext();

  const [activeSection, setActiveSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'up' | 'down'>('down');
  const [targetSection, setTargetSection] = useState<number | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const lastWheelTime = useRef(0);
  const lastInnerScrollTime = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const touchScrollable = useRef<HTMLElement | null>(null);
  const touchStartScrollTop = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize terminal and trigger about entrance
  useEffect(() => {
    ctx.initializeTerminal();
    const timer = setTimeout(() => setHasLoaded(true), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock body scroll while HomePage is mounted
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const origHtml = html.style.overflow;
    const origBody = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = origHtml;
      body.style.overflow = origBody;
    };
  }, []);

  // Navigate between sections
  const navigateToSection = useCallback(
    (targetIndex: number) => {
      if (isTransitioning || targetIndex === activeSection) return;
      if (targetIndex < 0 || targetIndex >= SECTIONS.length) return;

      const direction = targetIndex > activeSection ? 'down' : 'up';
      setTransitionDirection(direction);
      setIsTransitioning(true);
      setTargetSection(targetIndex);

      // Trigger starfield warp
      ctx.starfieldRef.current?.triggerWarp(TRANSITION_DURATION);

      // Complete transition after animation
      setTimeout(() => {
        setActiveSection(targetIndex);
        setTargetSection(null);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    },
    [isTransitioning, activeSection, ctx]
  );

  // Watch for terminal section scroll commands
  useEffect(() => {
    if (ctx.pendingSectionScroll) {
      const idx = SECTIONS.indexOf(ctx.pendingSectionScroll as typeof SECTIONS[number]);
      if (idx !== -1) {
        navigateToSection(idx);
      }
      ctx.clearPendingSectionScroll();
    }
  }, [ctx.pendingSectionScroll, ctx, navigateToSection]);

  // Check if an input-like element is focused
  const isInputFocused = useCallback(() => {
    const tag = document.activeElement?.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA';
  }, []);

  // Sections with more content than fits the viewport scroll internally.
  // Find the scrollable ancestor of an event target (if any) so wheel/touch
  // gestures scroll content first and only page between sections at an edge.
  const findScrollable = useCallback((start: EventTarget | null): HTMLElement | null => {
    let el = start instanceof HTMLElement ? start : null;
    while (el && el !== containerRef.current) {
      if (el.scrollHeight > el.clientHeight + 1) {
        const { overflowY } = window.getComputedStyle(el);
        if (overflowY === 'auto' || overflowY === 'scroll') return el;
      }
      el = el.parentElement;
    }
    return null;
  }, []);

  // The active section's scrollable body (for keyboard navigation).
  const getActiveScrollable = useCallback((): HTMLElement | null => {
    const sections = containerRef.current?.querySelectorAll<HTMLElement>(`.${styles.section}`);
    const el = sections?.[activeSection]?.querySelector<HTMLElement>('.overflow-y-auto');
    return el && el.scrollHeight > el.clientHeight + 1 ? el : null;
  }, [activeSection]);

  // Wheel handler: scroll overflowing section content natively first; only
  // page between sections once the content is at its edge (with a short grace
  // period so one continuous scroll doesn't blow straight through the edge).
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const direction = e.deltaY > 0 ? 'down' : 'up';
      const scrollable = findScrollable(e.target);
      if (scrollable && canScroll(scrollable, direction)) {
        lastInnerScrollTime.current = Date.now();
        return; // let the browser scroll the content
      }

      e.preventDefault();

      const now = Date.now();
      if (scrollable && now - lastInnerScrollTime.current < 400) return;
      if (now - lastWheelTime.current < WHEEL_COOLDOWN) return;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      if (isTransitioning) return;

      lastWheelTime.current = now;

      if (e.deltaY > 0) {
        navigateToSection(activeSection + 1);
      } else {
        navigateToSection(activeSection - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [activeSection, isTransitioning, navigateToSection, findScrollable]);

  // Touch handlers: if the gesture scrolled (or could scroll) overflowing
  // section content, it was a content scroll — not a section swipe.
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchScrollable.current = findScrollable(e.target);
      touchStartScrollTop.current = touchScrollable.current?.scrollTop ?? 0;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      if (isTransitioning) return;

      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;

      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

      const scrollable = touchScrollable.current;
      touchScrollable.current = null;
      if (scrollable) {
        const scrolled =
          Math.abs(scrollable.scrollTop - touchStartScrollTop.current) > 1;
        const direction = deltaY > 0 ? 'down' : 'up';
        if (scrolled || canScroll(scrollable, direction)) return;
      }

      if (deltaY > 0) {
        navigateToSection(activeSection + 1);
      } else {
        navigateToSection(activeSection - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [activeSection, isTransitioning, navigateToSection, findScrollable]);

  // Keyboard handler: arrows/page keys scroll overflowing section content
  // first, then page between sections once the content is at its edge.
  useEffect(() => {
    const scrollOrNavigate = (
      e: KeyboardEvent,
      direction: 'up' | 'down',
      step: (el: HTMLElement) => number
    ) => {
      e.preventDefault();
      const scrollable = getActiveScrollable();
      if (scrollable && canScroll(scrollable, direction)) {
        const magnitude = step(scrollable);
        scrollable.scrollBy({
          top: direction === 'down' ? magnitude : -magnitude,
          behavior: 'smooth',
        });
        return;
      }
      navigateToSection(direction === 'down' ? activeSection + 1 : activeSection - 1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputFocused()) return;
      if (isTransitioning) return;

      switch (e.key) {
        case 'ArrowDown':
          scrollOrNavigate(e, 'down', () => 80);
          break;
        case 'PageDown':
          scrollOrNavigate(e, 'down', (el) => el.clientHeight * 0.8);
          break;
        case 'ArrowUp':
          scrollOrNavigate(e, 'up', () => 80);
          break;
        case 'PageUp':
          scrollOrNavigate(e, 'up', (el) => el.clientHeight * 0.8);
          break;
        case 'Home':
          e.preventDefault();
          navigateToSection(0);
          break;
        case 'End':
          e.preventDefault();
          navigateToSection(SECTIONS.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, isTransitioning, navigateToSection, isInputFocused, getActiveScrollable]);

  // Determine CSS class for a section
  const getSectionClass = (index: number): string => {
    const base = styles.section;

    // During transition
    if (isTransitioning && targetSection !== null) {
      // Current section is exiting
      if (index === activeSection) {
        return `${base} ${transitionDirection === 'down' ? styles.exitUp : styles.exitDown}`;
      }
      // Target section is entering
      if (index === targetSection) {
        return `${base} ${transitionDirection === 'down' ? styles.enterFromBelow : styles.enterFromAbove}`;
      }
      // All others hidden
      return `${base} ${styles.sectionHidden}`;
    }

    // Not transitioning
    if (index === activeSection) {
      return `${base} ${styles.sectionVisible}`;
    }

    return `${base} ${styles.sectionHidden}`;
  };

  const sectionComponents = [
    <AboutSection key="about" isActive={activeSection === 0 && hasLoaded} />,
    <HowIWorkSection key="how-i-work" isActive={activeSection === 1 || targetSection === 1} />,
    <SkillsSection key="skills" isActive={activeSection === 2 || targetSection === 2} />,
    <ProjectsSection key="projects" isActive={activeSection === 3 || targetSection === 3} />,
    <CareerSection key="career" isActive={activeSection === 4 || targetSection === 4} />,
    <BlogSection key="blog" isActive={activeSection === 5 || targetSection === 5} />,
    <ContactSection key="contact" isActive={activeSection === 6 || targetSection === 6} />,
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full flex-1 overflow-hidden"
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      {/* Sections (starfield background is rendered site-wide by the layout) */}
      <div className="absolute inset-0 z-10">
        {sectionComponents.map((component, idx) => (
          <div
            key={SECTIONS[idx]}
            className={getSectionClass(idx)}
          >
            {/* Fade-slide-in wrapper for about section on initial load */}
            {idx === 0 ? (
              <div className={hasLoaded ? styles.fadeSlideIn : styles.sectionHidden} style={{ height: '100%' }}>
                {component}
              </div>
            ) : (
              component
            )}
          </div>
        ))}
      </div>

      {/* Section dots */}
      <SectionDots
        sections={SECTIONS.map((s) => SECTION_LABELS[s])}
        activeIndex={activeSection}
        onNavigate={navigateToSection}
      />

      {/* Accessibility */}
      <div className="sr-only">
        <h1>Chris Zichko&apos;s Portfolio</h1>
        <p>
          Interactive portfolio with sections: about, how I work, skills, projects, career,
          blog, contact
        </p>
      </div>
    </div>
  );
}
