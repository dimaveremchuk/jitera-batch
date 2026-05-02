import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

let _uid = 0;
const uid = () => ++_uid;

export default function MorphText({ text, className, style }) {
  const prevRef = useRef([]);

  const prev = prevRef.current;
  const prevLen = Math.max(prev.length - 1, 1);
  const newLen  = Math.max(text.length  - 1, 1);

  const pool = prev.map((item, i) => ({ ...item, prevIndex: i }));
  const chars = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const newRelPos = i / newLen;

    let bestIdx = -1;
    let bestDist = Infinity;
    for (let j = 0; j < pool.length; j++) {
      if (pool[j].char === ch) {
        const dist = Math.abs(newRelPos - pool[j].prevIndex / prevLen);
        if (dist < bestDist) { bestDist = dist; bestIdx = j; }
      }
    }

    if (bestIdx !== -1) {
      chars.push({ key: pool[bestIdx].key, char: ch });
      pool.splice(bestIdx, 1);
    } else {
      chars.push({ key: `${ch}-${uid()}-${i}`, char: ch });
    }
  }

  prevRef.current = chars;

  return (
    <span className={className} style={{ display: 'inline-flex', ...style }}>
      <AnimatePresence mode="popLayout" initial={false}>
        {chars.map(({ key, char }) => (
          <motion.span
            key={key}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              layout: { duration: 0.1, ease: [0.165, 0.84, 0.44, 1] },
              opacity: { duration: 0.08, ease: [0.165, 0.84, 0.44, 1] },
            }}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
