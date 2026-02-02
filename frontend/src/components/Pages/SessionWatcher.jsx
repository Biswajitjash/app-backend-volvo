import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { speakFunction } from '@/utils/SpeakFunction';
const SessionWatcher = ({ children, timeout = 10 * 60 * 1000 }) => {
  const idleTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    console.warn('⏳ Session timed out. Auto-logging out...');
   speakFunction('Session timed out. Auto-logging out.');
    // localStorage.clear();
    navigate('/login');
  }, [navigate]);

  const resetTimer = useCallback(() => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(handleLogout, timeout);
  }, [handleLogout, timeout]);

  useEffect(() => {
    const activityEvents = [ 'keydown', 'mousedown', 'scroll', 'touchstart'];
    activityEvents.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Start the timer on mount

    return () => {
      activityEvents.forEach((event) => window.removeEventListener(event, resetTimer));
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [resetTimer]);

  return <>{children}</>;
};

export default SessionWatcher;
