const handleFaceRecognized = () => {
  localStorage.setItem('Uname', 'FaceUser');
  localStorage.setItem('Login', true);
  speakFunction("Face recognized. Logging in...");
  onSubmit('FaceUser');
  onClose();
};
