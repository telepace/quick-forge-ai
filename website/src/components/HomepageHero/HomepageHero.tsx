'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PanelParticles } from '@/components/PanelParticles/PanelParticles';

interface HomepageHeroProps {
  title: string;
  subtitle: string;
  cta: string;
  lang: string;
}

/**
 * Interface representing the props for the Homepage Hero component.
 */
export const HomepageHero: React.FC<HomepageHeroProps> = ({
  title,
  subtitle,
  cta,
  lang,
}) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/50">
      {/* Background particles */}
      <div className="absolute inset-0 z-0">
        <PanelParticles />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <motion.h1 
            className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>
          <motion.p 
            className="mt-6 max-w-2xl mx-auto text-xl text-foreground/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
          <motion.div 
            className="mt-10 max-w-sm mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href={`/${lang}/docs/getting-started`}>
              <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg">
                {cta}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 