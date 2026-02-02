// RedirectToGoogle.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { speakFunction } from '../../utils/SpeakFunction';

const GooglePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    speakFunction('Opening Google in a new tab');

    window.open('https://www.google.com', '_blank');

    // Redirect to /admin after a short delay (e.g., 1 second)
    const timer = setTimeout(() => {
      navigate('/admin');
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <div className="text-center mt-10">Opening Google... Redirecting to Admin...</div>;
};

export default GooglePage;
