import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Movie } from '../types';
import {
  ChevronLeftIcon, PlayIcon, PauseIcon, Replay10Icon, Forward10Icon, VolumeUpIcon, VolumeOffIcon,
  SubtitlesIcon, SettingsIcon, PictureInPictureIcon, FullscreenEnterIcon, FullscreenExitIcon,
  ReplayIcon, NextEpisodeIcon, CheckIcon, BrightnessIcon
} from './Icons';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
  onNextEpisode: () => void;
}

const vttContent = `WEBVTT

00:00:02.000 --> 00:00:05.000
- This is a demonstration of the subtitle feature.

00:00:06.000 --> 00:00:10.000
- The player supports multiple lines and timings, just like a real video player.

00:00:12.000 --> 00:00:15.000
- Enjoy the show!
`;

const videoSources = {
    '4K': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    '1080p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    '720p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    '480p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
};
const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

const formatTime = (timeInSeconds: number) => {
  const date = new Date(0);
  date.setSeconds(timeInSeconds);
  const timeString = date.toISOString().substr(11, 8);
  return timeString.startsWith('00:') ? timeString.substr(3) : timeString;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose, onNextEpisode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef<{ x: number, y: number, time: number, type: 'none' | 'seek' | 'volume' | 'brightness' }>({ x: 0, y: 0, time: 0, type: 'none' });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'main' | 'quality' | 'speed'>('main');
  const [activeSubtitleTrack, setActiveSubtitleTrack] = useState<'off' | 'en'>('off');
  const [videoQuality, setVideoQuality] = useState<keyof typeof videoSources>('1080p');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [subtitleUrl, setSubtitleUrl] = useState('');
  
  const [brightness, setBrightness] = useState(1);
  const [showVolumeIndicator, setShowVolumeIndicator] = useState(false);
  const [showBrightnessIndicator, setShowBrightnessIndicator] = useState(false);

  useEffect(() => {
    const vttBlob = new Blob([vttContent], { type: 'text/vtt' });
    const url = URL.createObjectURL(vttBlob);
    setSubtitleUrl(url);
    return () => URL.revokeObjectURL(url);
  }, []);
  
  const hideControls = () => setAreControlsVisible(false);

  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setAreControlsVisible(true);
    controlsTimeoutRef.current = setTimeout(hideControls, 3000);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setHasEnded(true);
    const handleLoadedMetadata = () => {
        setDuration(video.duration);
        const savedTime = localStorage.getItem(`video-progress-${movie.id}`);
        if (savedTime) {
            video.currentTime = parseFloat(savedTime);
        }
    };
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    const handlePipChange = () => setIsPip(!!document.pictureInPictureElement);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    video.addEventListener('enterpictureinpicture', handlePipChange);
    video.addEventListener('leavepictureinpicture', handlePipChange);
    
    resetControlsTimeout();
    
    const container = playerContainerRef.current;
    container?.addEventListener('mousemove', resetControlsTimeout);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      video.removeEventListener('enterpictureinpicture', handlePipChange);
      video.removeEventListener('leavepictureinpicture', handlePipChange);
      container?.removeEventListener('mousemove', resetControlsTimeout);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [movie.id, resetControlsTimeout]);

  useEffect(() => {
    const saveProgress = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        localStorage.setItem(`video-progress-${movie.id}`, String(videoRef.current.currentTime));
      }
    }, 5000);
    return () => clearInterval(saveProgress);
  }, [movie.id]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
    }
  };

  const handleSkip = (amount: number) => {
    if (videoRef.current) videoRef.current.currentTime += amount;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) videoRef.current.currentTime = Number(e.target.value);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    if (videoRef.current) videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      if(videoRef.current) videoRef.current.muted = newMuted;
      if (!newMuted) setVolume(videoRef.current?.volume || 0.5);
  };
  
  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setIsSettingsOpen(false);
  };
  
  const handleQualityChange = (quality: keyof typeof videoSources) => {
    setVideoQuality(quality);
    setIsSettingsOpen(false);
  };
  
  const handleSubtitleChange = () => {
    const newTrack = activeSubtitleTrack === 'off' ? 'en' : 'off';
    setActiveSubtitleTrack(newTrack);
    if (videoRef.current && videoRef.current.textTracks.length > 0) {
        videoRef.current.textTracks[0].mode = newTrack === 'en' ? 'showing' : 'hidden';
    }
    setIsSettingsOpen(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const togglePiP = () => {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
        videoRef.current?.requestPictureInPicture();
    }
  };

  const handleReplay = () => {
    if (videoRef.current) videoRef.current.currentTime = 0;
    setHasEnded(false);
    videoRef.current?.play();
  };

  const showIndicator = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
      setter(true);
      setTimeout(() => setter(false), 1000);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now(), type: 'none' };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    if (touchStartRef.current.type === 'none') {
        if (Math.abs(dx) > 10) touchStartRef.current.type = 'seek';
        else if (Math.abs(dy) > 10) {
            if (touchStartRef.current.x < window.innerWidth / 2) touchStartRef.current.type = 'brightness';
            else touchStartRef.current.type = 'volume';
        }
    }
    
    if (touchStartRef.current.type === 'seek' && videoRef.current) {
        const seekAmount = (dx / window.innerWidth) * 60; // swipe across screen = 60s seek
        videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seekAmount));
        touchStartRef.current.x = touch.clientX;
    } else if (touchStartRef.current.type === 'volume') {
        const newVolume = Math.max(0, Math.min(1, volume - dy / 200));
        if (videoRef.current) videoRef.current.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        touchStartRef.current.y = touch.clientY;
        showIndicator(setShowVolumeIndicator);
    } else if (touchStartRef.current.type === 'brightness') {
        const newBrightness = Math.max(0.2, Math.min(1.5, brightness - dy / 200));
        setBrightness(newBrightness);
        touchStartRef.current.y = touch.clientY;
        showIndicator(setShowBrightnessIndicator);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchEndTime = Date.now();
    if (touchStartRef.current.type === 'none' && touchEndTime - touchStartRef.current.time < 300) {
        setAreControlsVisible(v => !v);
    }
    touchStartRef.current.type = 'none';
  };

  const renderSettings = () => (
    <div className="absolute bottom-16 right-4 bg-black/80 rounded-lg p-2 text-white w-48 z-20">
      {settingsTab === 'main' && (
        <>
          <button onClick={() => setSettingsTab('quality')} className="w-full text-left p-2 hover:bg-white/10 rounded flex justify-between">
            <span>Quality</span> <span className="text-gray-400">{videoQuality} &gt;</span>
          </button>
          <button onClick={() => setSettingsTab('speed')} className="w-full text-left p-2 hover:bg-white/10 rounded flex justify-between">
            <span>Speed</span> <span className="text-gray-400">{playbackRate}x &gt;</span>
          </button>
          <button onClick={handleSubtitleChange} className="w-full text-left p-2 hover:bg-white/10 rounded flex justify-between">
            <span>Subtitles</span> <span className="text-gray-400">{activeSubtitleTrack === 'en' ? 'On' : 'Off'}</span>
          </button>
        </>
      )}
      {settingsTab === 'quality' && (
        <div>
          <button onClick={() => setSettingsTab('main')} className="w-full text-left p-2 text-gray-400">&lt; Quality</button>
          {Object.keys(videoSources).map((q) => (
            <button key={q} onClick={() => handleQualityChange(q as keyof typeof videoSources)} className="w-full text-left p-2 hover:bg-white/10 rounded flex items-center">
              {q} {videoQuality === q && <CheckIcon className="w-4 h-4 ml-auto text-sky-400" />}
            </button>
          ))}
        </div>
      )}
      {settingsTab === 'speed' && (
        <div>
          <button onClick={() => setSettingsTab('main')} className="w-full text-left p-2 text-gray-400">&lt; Speed</button>
          {playbackRates.map((r) => (
            <button key={r} onClick={() => handlePlaybackRateChange(r)} className="w-full text-left p-2 hover:bg-white/10 rounded flex items-center">
              {r}x {playbackRate === r && <CheckIcon className="w-4 h-4 ml-auto text-sky-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={playerContainerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center text-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => isSettingsOpen && setIsSettingsOpen(false)}
    >
      <video
        ref={videoRef}
        src={videoSources[videoQuality]}
        autoPlay
        className="w-full h-full object-contain"
        style={{ filter: `brightness(${brightness})`}}
        onDoubleClick={toggleFullscreen}
        onClick={(e) => { e.stopPropagation(); if (!isSettingsOpen) setAreControlsVisible(v => !v); }}
      >
        {subtitleUrl && <track kind="subtitles" srcLang="en" label="English" src={subtitleUrl} default={activeSubtitleTrack === 'en'} />}
      </video>

      {/* Gesture Indicators */}
       {showVolumeIndicator && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 rounded-lg p-4 flex flex-col items-center space-y-2">
          <VolumeUpIcon className="w-10 h-10" />
          <div className="w-24 h-2 bg-white/30 rounded-full"><div className="h-full bg-white rounded-full" style={{width: `${volume * 100}%`}}></div></div>
        </div>}
       {showBrightnessIndicator && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 rounded-lg p-4 flex flex-col items-center space-y-2">
          <BrightnessIcon className="w-10 h-10" />
          <div className="w-24 h-2 bg-white/30 rounded-full"><div className="h-full bg-white rounded-full" style={{width: `${(brightness - 0.2) / 1.3 * 100}%`}}></div></div>
        </div>}
      
      {/* Controls Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'} bg-gradient-to-t from-black/70 via-transparent to-black/70`}>
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center">
          <button onClick={onClose}><ChevronLeftIcon className="w-8 h-8" /></button>
          <h2 className="text-xl font-bold ml-4 truncate">{movie.title}</h2>
        </div>

        {/* Middle Controls */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-12">
          <button onClick={() => handleSkip(-10)}><Replay10Icon className="w-10 h-10" /></button>
          <button onClick={togglePlayPause}>
            {isPlaying ? <PauseIcon className="w-16 h-16" /> : <PlayIcon className="w-16 h-16" />}
          </button>
          <button onClick={() => handleSkip(10)}><Forward10Icon className="w-10 h-10" /></button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
              style={{
                  background: `linear-gradient(to right, #38bdf8 ${ (currentTime / duration) * 100 }%, #fff3 ${ (currentTime / duration) * 100 }%)`
              }}
            />
            <span className="text-sm">{formatTime(duration)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button onClick={toggleMute}>{isMuted || volume === 0 ? <VolumeOffIcon className="w-6 h-6" /> : <VolumeUpIcon className="w-6 h-6" />}</button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #fff ${ (isMuted ? 0 : volume) * 100 }%, #fff3 ${ (isMuted ? 0 : volume) * 100 }%)`
                    }}
                />
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(v => !v); setSettingsTab('main'); }}><SettingsIcon className="w-6 h-6" /></button>
                {document.pictureInPictureEnabled && <button onClick={togglePiP}><PictureInPictureIcon className="w-6 h-6" /></button>}
                <button onClick={toggleFullscreen}>
                    {isFullscreen ? <FullscreenExitIcon className="w-6 h-6" /> : <FullscreenEnterIcon className="w-6 h-6" />}
                </button>
            </div>
          </div>
        </div>

        {isSettingsOpen && renderSettings()}
      </div>
      
      {hasEnded && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center space-x-16">
            <button onClick={handleReplay} className="flex flex-col items-center space-y-2 text-gray-300 hover:text-white">
                <ReplayIcon className="w-16 h-16"/>
                <span>Replay</span>
            </button>
            <button onClick={onNextEpisode} className="flex flex-col items-center space-y-2 text-gray-300 hover:text-white">
                <NextEpisodeIcon className="w-16 h-16"/>
                <span>Next Movie</span>
            </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
