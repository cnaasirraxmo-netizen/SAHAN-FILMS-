
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Movie, DownloadQuality } from '../types';
import {
  ChevronLeftIcon, PlayIcon, PauseIcon, Replay10Icon, Forward10Icon,
  SubtitlesIcon, SettingsIcon, PictureInPictureIcon, FullscreenEnterIcon, FullscreenExitIcon,
  ReplayIcon, NextEpisodeIcon, CheckIcon, BrightnessIcon, LockIcon, UnlockIcon,
  AudioTrackIcon, PlaybackSpeedIcon, AspectRatioIcon,
} from './Icons';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
  onNextEpisode: () => void;
  downloadedQuality?: DownloadQuality;
}

const vttContent = `WEBVTT

00:00:02.000 --> 00:00:05.000
- This is a demonstration of the subtitle feature.

00:00:06.000 --> 00:00:10.000
- The player supports multiple lines and timings, just like a real video player.

00:00:12.000 --> 00:00:15.000
- Enjoy the show!
`;

type VideoQuality = '480p' | '720p' | '1080p';
type AspectRatio = 'contain' | 'cover';

const playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const audioTracks = ['English [Original]']; // Placeholder

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return '00:00';
  const date = new Date(0);
  date.setSeconds(timeInSeconds);
  const timeString = date.toISOString().substr(11, 8);
  return timeString.startsWith('00:') ? timeString.substr(3) : timeString;
};

const mapQualityToVideoQuality = (quality?: DownloadQuality): VideoQuality => {
    switch(quality) {
        case 'Good': return '480p';
        case 'Best': return '1080p';
        case 'Better':
        default: return '720p';
    }
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose, onNextEpisode, downloadedQuality }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef<{ x: number, y: number, time: number, type: 'none' | 'seek' | 'volume' | 'brightness' }>({ x: 0, y: 0, time: 0, type: 'none' });

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'quality' | 'speed' | 'subtitles' | 'audio' | null>(null);
  
  const [activeSubtitleTrack, setActiveSubtitleTrack] = useState<'off' | 'en'>('off');
  const [videoQuality, setVideoQuality] = useState<VideoQuality>(mapQualityToVideoQuality(downloadedQuality));
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('contain');

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [subtitleUrl, setSubtitleUrl] = useState('');
  
  const [brightness, setBrightness] = useState(1);
  const [showVolumeIndicator, setShowVolumeIndicator] = useState(false);
  const [showBrightnessIndicator, setShowBrightnessIndicator] = useState(false);

  const videoSources: Record<VideoQuality, string | undefined> = {
    '1080p': movie.videoUrl_1080p,
    '720p': movie.videoUrl_720p,
    '480p': movie.videoUrl_480p,
  };
  const availableQualities = Object.keys(videoSources).filter(q => videoSources[q as VideoQuality]) as VideoQuality[];
  const currentVideoSrc = videoSources[videoQuality] || videoSources['480p'] || '';

  useEffect(() => {
    const vttBlob = new Blob([vttContent], { type: 'text/vtt' });
    const url = URL.createObjectURL(vttBlob);
    setSubtitleUrl(url);
    return () => URL.revokeObjectURL(url);
  }, []);
  
  const hideControls = () => {
    if (!isLocked) {
      setAreControlsVisible(false);
    }
    setActiveMenu(null);
  };

  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (!isLocked) {
      setAreControlsVisible(true);
      controlsTimeoutRef.current = setTimeout(hideControls, 4000);
    }
  }, [isLocked]);
  
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
        if (savedTime) video.currentTime = parseFloat(savedTime);
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
    if (hasEnded) return;
    if (videoRef.current) {
      videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
      resetControlsTimeout();
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) videoRef.current.currentTime = Number(e.target.value);
    resetControlsTimeout();
  };
  
  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setActiveMenu(null);
  };
  
  const handleQualityChange = (quality: VideoQuality) => {
    if (videoRef.current) {
        const currentPlayTime = videoRef.current.currentTime;
        setVideoQuality(quality);
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.currentTime = currentPlayTime;
                if(isPlaying) videoRef.current.play();
            }
        }, 100);
    }
    setActiveMenu(null);
  };
  
  const handleSubtitleChange = (track: 'off' | 'en') => {
    setActiveSubtitleTrack(track);
    if (videoRef.current && videoRef.current.textTracks.length > 0) {
        videoRef.current.textTracks[0].mode = track === 'en' ? 'showing' : 'hidden';
    }
    setActiveMenu(null);
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

  const toggleLock = () => {
    const nextLockedState = !isLocked;
    setIsLocked(nextLockedState);
    if (nextLockedState) {
        setAreControlsVisible(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setAreControlsVisible(false), 3000);
    } else {
        resetControlsTimeout();
    }
    setActiveMenu(null);
  };

  const toggleAspectRatio = () => {
    setAspectRatio(prev => prev === 'contain' ? 'cover' : 'contain');
  };

  const handleMenuClick = (menu: 'quality' | 'speed' | 'subtitles' | 'audio', e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menu ? null : menu);
    resetControlsTimeout();
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isLocked) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now(), type: 'none' };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isLocked || e.touches.length === 0) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    if (touchStartRef.current.type === 'none') {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) touchStartRef.current.type = 'seek';
        else if (Math.abs(dy) > 10) {
            if (touchStartRef.current.x < window.innerWidth / 2) touchStartRef.current.type = 'brightness';
            else touchStartRef.current.type = 'volume';
        }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isLocked) {
        if (!areControlsVisible) setAreControlsVisible(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setAreControlsVisible(false), 3000);
        return;
    }
    const touchEndTime = Date.now();
    if (touchStartRef.current.type === 'none' && touchEndTime - touchStartRef.current.time < 300) {
        setAreControlsVisible(v => !v);
        if(areControlsVisible) setActiveMenu(null); else resetControlsTimeout();
    }
    touchStartRef.current.type = 'none';
  };

  const ControlButton: React.FC<{icon: React.FC<{className?: string}>, label: string, onClick?: (e: React.MouseEvent) => void}> = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-16 text-xs text-gray-300 hover:text-white transition-colors space-y-1">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
  );

  const renderActiveMenu = () => {
    if (!activeMenu) return null;
    let title = '';
    let options: {label: string, action: () => void, active: boolean}[] = [];

    switch (activeMenu) {
        case 'quality':
            title = 'Quality';
            options = availableQualities.map(q => ({ label: q, action: () => handleQualityChange(q), active: videoQuality === q }));
            break;
        case 'speed':
            title = 'Playback Speed';
            options = playbackRates.map(r => ({ label: `${r}x`, action: () => handlePlaybackRateChange(r), active: playbackRate === r }));
            break;
        case 'subtitles':
            title = 'Subtitles';
            options = [
                { label: 'Off', action: () => handleSubtitleChange('off'), active: activeSubtitleTrack === 'off' },
                { label: 'English', action: () => handleSubtitleChange('en'), active: activeSubtitleTrack === 'en' },
            ];
            break;
        case 'audio':
             title = 'Audio Track';
             options = audioTracks.map(t => ({ label: t, action: () => setActiveMenu(null), active: true }));
             break;
    }

    return (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white w-56 z-30 pointer-events-auto animate-fade-in" onClick={e => e.stopPropagation()}>
            <h4 className="font-semibold text-center mb-2 border-b border-gray-600 pb-2">{title}</h4>
            <ul className="space-y-1">
                {options.map(opt => (
                     <li key={opt.label}>
                         <button onClick={opt.action} className={`w-full text-left p-2 hover:bg-white/10 rounded flex items-center justify-between text-sm ${opt.active ? 'font-bold text-sky-400' : ''}`}>
                             <span>{opt.label}</span>
                             {opt.active && <CheckIcon className="w-4 h-4" />}
                         </button>
                     </li>
                ))}
            </ul>
        </div>
    );
  };
  
  return (
    <div
      ref={playerContainerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center text-white select-none"
      onClick={() => { if (!isLocked) { setAreControlsVisible(v => !v); if(areControlsVisible) setActiveMenu(null); else resetControlsTimeout(); }}}
      onDoubleClick={toggleFullscreen}
    >
      <video
        ref={videoRef}
        key={currentVideoSrc}
        src={currentVideoSrc}
        autoPlay
        className="w-full h-full"
        style={{ filter: `brightness(${brightness})`, objectFit: aspectRatio }}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {subtitleUrl && <track kind="subtitles" srcLang="en" label="English" src={subtitleUrl} default={activeSubtitleTrack === 'en'} />}
      </video>

      {/* Lock Overlay */}
      {isLocked && (
        <div 
          className={`absolute inset-0 z-40 transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button onClick={toggleLock} className="p-3 bg-black/50 rounded-full">
              <UnlockIcon className="w-8 h-8"/>
            </button>
          </div>
        </div>
      )}
      
      {/* Controls Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 z-20 ${areControlsVisible && !isLocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 pointer-events-auto" onClick={() => activeMenu && setActiveMenu(null)}>
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center space-x-4 min-w-0">
                <button onClick={onClose}><ChevronLeftIcon className="w-7 h-7" /></button>
                <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
              </div>
              <div className="flex items-center space-x-5">
                  <button onClick={toggleLock}><LockIcon className="w-6 h-6"/></button>
                  <button onClick={toggleAspectRatio}><AspectRatioIcon className="w-6 h-6"/></button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono">{formatTime(currentTime)}</span>
                <input
                  type="range" min="0" max={duration || 1} value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer video-progress-bar"
                   style={{
                      background: `linear-gradient(to right, #fd5622 ${ (currentTime / (duration || 1)) * 100 }%, #ffffff33 ${ (currentTime / (duration || 1)) * 100 }%)`
                  }}
                />
                <span className="text-xs font-mono">{formatTime(duration || 0)}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                 <ControlButton icon={AudioTrackIcon} label="Auto" onClick={(e) => handleMenuClick('audio', e)} />
                 <ControlButton icon={SubtitlesIcon} label={activeSubtitleTrack === 'en' ? 'On' : 'None'} onClick={(e) => handleMenuClick('subtitles', e)}/>
                 <ControlButton icon={PlaybackSpeedIcon} label={`${playbackRate}x`} onClick={(e) => handleMenuClick('speed', e)}/>
                 {document.pictureInPictureEnabled && <ControlButton icon={PictureInPictureIcon} label="PIP" onClick={togglePiP} />}
                 <ControlButton icon={SettingsIcon} label={videoQuality} onClick={(e) => handleMenuClick('quality', e)}/>
                 <ControlButton icon={isFullscreen ? FullscreenExitIcon : FullscreenEnterIcon} label="Fit" onClick={toggleFullscreen}/>
              </div>
            </div>

            {renderActiveMenu()}
        </div>
      </div>
      
      {hasEnded && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center space-x-16 pointer-events-auto z-30">
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
