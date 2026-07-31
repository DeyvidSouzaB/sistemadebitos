import React, { useEffect, useRef, useMemo } from 'react';
import { animate } from 'motion/react';

interface AnimatedCurrencyProps {
  value: number;
  duration?: number;
  className?: string;
}

export const AnimatedCurrency: React.FC<AnimatedCurrencyProps> = ({
  value,
  duration = 1.0,
  className = '',
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const formatter = useMemo(
    () => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    []
  );

  useEffect(() => {
    const node = spanRef.current;
    if (!node) return;

    // Set initial formatted value
    node.textContent = formatter.format(0);

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        if (node) {
          node.textContent = formatter.format(latest);
        }
      },
    });

    return () => controls.stop();
  }, [value, duration, formatter]);

  return <span ref={spanRef} className={className}>{formatter.format(value)}</span>;
};

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1.0,
  className = '',
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = spanRef.current;
    if (!node) return;

    node.textContent = '0';

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        if (node) {
          node.textContent = Math.round(latest).toLocaleString('pt-BR');
        }
      },
    });

    return () => controls.stop();
  }, [value, duration]);

  return <span ref={spanRef} className={className}>{value.toLocaleString('pt-BR')}</span>;
};

