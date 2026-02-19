'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Starfield } from './Starfield';
import { SectionDots } from './SectionDots';
import { AboutSection } from './sections/AboutSection';
import { SkillsSection } from './sections/SkillsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { CareerSection } from './sections/CareerSection';
import { BlogSection } from './sections/BlogSection';
import { ContactSection } from './sections/ContactSection';
import { useTerminalContext } from '@/contexts/TerminalContext';
import styles from './HomePage.module.css';

const SECTIONS = ['about', 'skills', 'projects', 'career', 'blog', 'contact'] as const;
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
  const touchStartY = useRef<number | null>(null);
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

  // Wheel handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isInputFocused()) return;

      e.preventDefault();

      const now = Date.now();
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
  }, [activeSection, isTransitioning, navigateToSection, isInputFocused]);

  // Touch handlers
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (isInputFocused()) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isInputFocused() || touchStartY.current === null) return;
      if (isTransitioning) return;

      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;

      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

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
  }, [activeSection, isTransitioning, navigateToSection, isInputFocused]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputFocused()) return;
      if (isTransitioning) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          navigateToSection(activeSection + 1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          navigateToSection(activeSection - 1);
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
  }, [activeSection, isTransitioning, navigateToSection, isInputFocused]);

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
    <SkillsSection key="skills" isActive={activeSection === 1 || targetSection === 1} />,
    <ProjectsSection key="projects" isActive={activeSection === 2 || targetSection === 2} />,
    <CareerSection key="career" isActive={activeSection === 3 || targetSection === 3} />,
    <BlogSection key="blog" isActive={activeSection === 4 || targetSection === 4} />,
    <ContactSection key="contact" isActive={activeSection === 5 || targetSection === 5} />,
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full flex-1 overflow-hidden"
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      {/* Starfield Background */}
      <Starfield ref={ctx.starfieldRef} />

      {/* Sections */}
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
        sections={SECTIONS.map((s) => s.charAt(0).toUpperCase() + s.slice(1))}
        activeIndex={activeSection}
        onNavigate={navigateToSection}
      />

      {/* Accessibility */}
      <div className="sr-only">
        <h1>Chris&apos;s Portfolio</h1>
        <p>Interactive portfolio with sections: about, skills, projects, career, blog, contact</p>
      </div>
    </div>
  );
}
