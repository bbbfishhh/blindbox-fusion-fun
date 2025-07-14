import React, { useEffect, useRef } from 'react';
import { createParticles } from '@/lib/combinationUtils';

interface ParticleEffectProps {
  active: boolean;
  count?: number;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ active, count = 20 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active && containerRef.current) {
      createParticles(containerRef.current, count);
    }
  }, [active, count]);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />;
};

export default ParticleEffect;