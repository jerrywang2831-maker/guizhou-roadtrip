import { useEffect } from 'react';

export function useKeyboardNav(onPrev: () => void, onNext: () => void) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onPrev, onNext]);
}
