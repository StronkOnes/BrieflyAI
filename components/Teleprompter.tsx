
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ControlButton: React.FC<{ onClick: () => void; children: React.ReactNode; title?: string, active?: boolean }> = ({ onClick, children, title, active }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-2 rounded-md transition-colors ${active ? 'bg-violet-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
    aria-label={title}
  >
    {children}
  </button>
);

const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9a9 9 0 0114.65-4.65l-1.35 1.35A7 7 0 005.35 15.35l-1.35 1.35A9 9 0 014 9zm16 6a9 9 0 01-14.65 4.65l1.35-1.35A7 7 0 0018.65 8.65l1.35-1.35A9 9 0 0120 15z" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

interface TeleprompterProps {
  script: string;
  onClose: () => void;
}

const Teleprompter: React.FC<TeleprompterProps> = ({ script, onClose }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 0.5-20
  const [fontSize, setFontSize] = useState(6); // vw
  const [isMirrored, setIsMirrored] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollPositionRef = useRef(0);
  const animationFrameIdRef = useRef<number>(0);

  useEffect(() => {
    const savedSettings = localStorage.getItem('teleprompterSettings');
    if (savedSettings) {
      try {
        const { speed, size, mirrored } = JSON.parse(savedSettings);
        if (typeof speed === 'number') setScrollSpeed(speed);
        if (typeof size === 'number') setFontSize(size);
        if (typeof mirrored === 'boolean') setIsMirrored(mirrored);
      } catch (error) {
        console.error("Failed to parse teleprompter settings", error);
      }
    }
  }, []);

  useEffect(() => {
    const settings = { speed: scrollSpeed, size: fontSize, mirrored: isMirrored };
    localStorage.setItem('teleprompterSettings', JSON.stringify(settings));
  }, [scrollSpeed, fontSize, isMirrored]);

  const scrollStep = useCallback(() => {
    if (!scrollContainerRef.current) return;
    scrollPositionRef.current += scrollSpeed / 10;
    scrollContainerRef.current.scrollTop = scrollPositionRef.current;
    animationFrameIdRef.current = requestAnimationFrame(scrollStep);
  }, [scrollSpeed]);

  useEffect(() => {
    if (isScrolling) {
      animationFrameIdRef.current = requestAnimationFrame(scrollStep);
    } else {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    return () => cancelAnimationFrame(animationFrameIdRef.current);
  }, [isScrolling, scrollStep]);

  const handlePlayPause = () => setIsScrolling(prev => !prev);
  const handleReset = () => {
    if (scrollContainerRef.current) {
      setIsScrolling(false);
      scrollContainerRef.current.scrollTop = 0;
      scrollPositionRef.current = 0;
    }
  };

  const handleTogglePip = async () => {
    if (!videoRef.current || !navigator.mediaDevices || !('pictureInPictureEnabled' in document)) {
        alert("Picture-in-Picture is not supported by your browser.");
        return;
    }
    if (document.pictureInPictureElement) {
      try {
        await document.exitPictureInPicture();
      } catch (error) {
        console.error("Error exiting PiP:", error);
      }
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      await videoRef.current.requestPictureInPicture();
    } catch (error) {
      console.error("Error accessing camera or entering PiP:", error);
      alert("Could not access camera. Please check browser permissions.");
    }
  };
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnterPip = () => setIsPipActive(true);
    const onLeavePip = () => {
        setIsPipActive(false);
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    };
    video.addEventListener('enterpictureinpicture', onEnterPip);
    video.addEventListener('leavepictureinpicture', onLeavePip);
    return () => {
        video.removeEventListener('enterpictureinpicture', onEnterPip);
        video.removeEventListener('leavepictureinpicture', onLeavePip);
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center font-sans">
      <video ref={videoRef} className="hidden" playsInline muted />
      <div
        ref={scrollContainerRef}
        className="h-full w-full overflow-y-scroll"
        style={{ transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)' }}
      >
        <div className="text-white text-center py-[50vh] break-words" style={{ fontSize: `${fontSize}vw`, lineHeight: 1.4, transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)' }}>
          {script}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 flex items-center justify-center gap-2 md:gap-6 backdrop-blur-sm">
        <button onClick={onClose} title="Close (Esc)" className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm hidden md:inline">Size</span>
            <ControlButton onClick={() => setFontSize(s => Math.max(2, s - 0.5))} title="Decrease font size">-</ControlButton>
            <ControlButton onClick={() => setFontSize(s => Math.min(15, s + 0.5))} title="Increase font size">+</ControlButton>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm hidden md:inline">Speed</span>
            <ControlButton onClick={() => setScrollSpeed(s => Math.max(0.5, s - 0.5))} title="Decrease speed">-</ControlButton>
            <ControlButton onClick={() => setScrollSpeed(s => Math.min(20, s + 0.5))} title="Increase speed">+</ControlButton>
        </div>

        <div className="flex items-center gap-2">
            <ControlButton onClick={handlePlayPause} title={isScrolling ? 'Pause (Space)' : 'Play (Space)'}>{isScrolling ? <PauseIcon /> : <PlayIcon />}</ControlButton>
            <ControlButton onClick={handleReset} title="Reset"><ResetIcon /></ControlButton>
        </div>
        
        <div className="flex items-center gap-2">
            <ControlButton onClick={() => setIsMirrored(m => !m)} title="Mirror" active={isMirrored}>Mirror</ControlButton>
            <ControlButton onClick={handleTogglePip} title="Picture-in-Picture" active={isPipActive}><CameraIcon/></ControlButton>
        </div>
      </div>
    </div>
  );
};

export default Teleprompter;
