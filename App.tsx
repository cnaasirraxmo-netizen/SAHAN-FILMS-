
import React, { useState, useEffect, createContext } from 'react';
import { auth } from './firebase';
// FIX: Import firebase compat to resolve module export errors for auth functions.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import HeroCarousel from './components/HeroCarousel';
import ContentRow from './components/ContentRow';
import BottomNav from './components/BottomNav';
import SearchResults from './components/SearchResults';
import Settings from './components/Settings';
import ThemeSettings from './components/settings/ThemeSettings';
import LanguageSettings from './components/settings/LanguageSettings';
import NotificationSettings from './components/settings/NotificationSettings';
import DataUsageSettings from './components/settings/DataUsageSettings';
import PrivacySettings from './components/settings/PrivacySettings';
import DownloadSettings from './components/settings/DownloadSettings';
import MovieDetails from './components/MovieDetails';
import Profiles from './components/Profiles';
import ProfileDetails from './components/ProfileDetails';
import Downloads from './components/Downloads';
import VideoPlayer from './components/VideoPlayer';
import CastPlayer from './components/CastPlayer';
import CategoryPage from './components/CategoryPage';
import FilmsPage from './components/FilmsPage';
import KidsPage from './components/KidsPage';
import AdminPage from './components/AdminPage';
import SplashScreen from './components/SplashScreen';
import Auth from './components/Auth';
import MyAccount from './components/MyAccount';
import { CAROUSEL_ITEMS, PRIME_MOVIES, PRIME_ORIGINALS, CONTINUE_WATCHING, PROFILES, CATEGORIES } from './constants';
import { Movie, Profile, DownloadQuality, User } from './types';
import { ChevronLeftIcon } from './components/Icons';
import MovieCard from './components/MovieCard';
import ToggleSwitch from './components/ToggleSwitch';

export type Theme = 'dark' | 'light';
export const ThemeContext = createContext<{ theme: Theme, toggleTheme: () => void }>({
  theme: 'dark',
  toggleTheme: () => {},
});

type View = 'app' | 'profiles' | 'profileDetails' | 'myAccount';
type AppView = 'user' | 'admin';

declare global {
  interface Window {
    cast: any;
    chrome: any;
    __onGCastApiAvailable: (isAvailable: boolean) => void;
  }
}

const ViewingHistory: React.FC<{ profile: Profile; onBack: () => void; onMovieClick: (movie: Movie) => void; }> = ({ profile, onBack, onMovieClick }) => {
  return (
    <div className="bg-[var(--background-color-secondary)] h-screen w-full max-w-md mx-auto flex flex-col font-sans text-[var(--text-color)]">
      <header className="px-4 py-3 flex items-center bg-[var(--background-color)] border-b border-[var(--border-color)] relative">
        <button onClick={onBack} aria-label="Go back to profile details">
          <ChevronLeftIcon className="h-6 w-6 text-[var(--text-color)]" />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-color)] absolute left-1/2 -translate-x-1/2">Viewing History</h1>
      </header>
      <main className="flex-1 p-4 overflow-y-auto no-scrollbar">
        <p className="text-sm text-[var(--text-color-secondary)] mb-4">Here's what {profile.name} has been watching.</p>
        <ul className="space-y-4">
          {CONTINUE_WATCHING.map(movie => (
            <li key={movie.id} onClick={() => onMovieClick(movie)} className="flex items-center space-x-4 cursor-pointer">
              <img src={movie.posterUrl} alt={movie.title} className="w-24 h-14 rounded-md object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{movie.title}</p>
                <p className="text-sm text-[var(--text-color-secondary)] flex items-center space-x-1.5">
                    <span>{movie.year}</span>
                    <span>&bull;</span>
                    <span>{movie.duration}</span>
                    <span>&bull;</span>
                    <span className="border border-gray-500/80 px-1 rounded text-xs font-semibold tracking-wide">{movie.rating}</span>
                </p>
                <div className="w-full h-1 bg-gray-600/70 rounded-full mt-2">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: `${movie.progress}%` }}></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

const Recommendations: React.FC<{ profile: Profile; onBack: () => void; onMovieClick: (movie: Movie) => void; }> = ({ profile, onBack, onMovieClick }) => {
    const recommendedMovies = [...PRIME_MOVIES.slice(0, 2), ...PRIME_ORIGINALS];

  return (
    <div className="bg-[var(--background-color-secondary)] h-screen w-full max-w-md mx-auto flex flex-col font-sans text-[var(--text-color)]">
      <header className="px-4 py-3 flex items-center bg-[var(--background-color)] border-b border-[var(--border-color)] relative">
        <button onClick={onBack} aria-label="Go back to profile details">
          <ChevronLeftIcon className="h-6 w-6 text-[var(--text-color)]" />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-color)] absolute left-1/2 -translate-x-1/2">Recommendations</h1>
      </header>
      <main className="flex-1 p-4 overflow-y-auto no-scrollbar">
        <p className="text-sm text-[var(--text-color-secondary)] mb-4">Based on {profile.name}'s viewing habits, we think you'll enjoy these.</p>
        <div className="grid grid-cols-3 gap-3">
          {recommendedMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
          ))}
        </div>
      </main>
    </div>
  );
};

const DeviceSync: React.FC<{ profile: Profile; onBack: () => void; }> = ({ profile, onBack }) => {
  return (
    <div className="bg-[var(--background-color-secondary)] h-screen w-full max-w-md mx-auto flex flex-col font-sans text-[var(--text-color)]">
      <header className="px-4 py-3 flex items-center bg-[var(--background-color)] border-b border-[var(--border-color)] relative">
        <button onClick={onBack} aria-label="Go back to profile details">
          <ChevronLeftIcon className="h-6 w-6 text-[var(--text-color)]" />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-color)] absolute left-1/2 -translate-x-1/2">Cross-Device Sync</h1>
      </header>
      <main className="flex-1 overflow-y-auto no-scrollbar">
         <div className="p-4">
            <p className="text-sm text-[var(--text-color-secondary)] mb-6">Manage how {profile.name}'s viewing progress is synced across devices.</p>
            <ul className="divide-y divide-[var(--border-color)]">
                <li className="py-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-lg">Enable Sync</span>
                        <span className="text-sm text-[var(--text-color-secondary)]">
                            Keep watch history and progress in sync.
                        </span>
                    </div>
                    <ToggleSwitch checked={true} onChange={() => {}} />
                </li>
                <li className="py-4">
                    <h3 className="text-lg mb-2">Registered Devices</h3>
                    <div className="space-y-2 text-[var(--text-color-secondary)]">
                        <p>iPhone 15 Pro</p>
                        <p>Samsung Smart TV</p>
                        <p>Chrome on macOS</p>
                    </div>
                </li>
            </ul>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [appView, setAppView] = useState<AppView>('user');
  const [activeTab, setActiveTab] = useState('Home');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSetting, setActiveSetting] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [view, setView] = useState<View>('app');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [activeProfileFeature, setActiveProfileFeature] = useState<string | null>(null);
  const [downloadedMovies, setDownloadedMovies] = useState<Movie[]>([]);
  const [downloadQuality, setDownloadQuality] = useState<DownloadQuality>('Better');
  const [autoDelete, setAutoDelete] = useState<boolean>(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const [isCastAvailable, setIsCastAvailable] = useState(false);
  const [isControllingCast, setIsControllingCast] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // FIX: Use compat API for onAuthStateChanged and firebase.User type.
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: firebase.User | null) => {
        if (firebaseUser) {
            setCurrentUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                avatarUrl: firebaseUser.photoURL,
            });
        } else {
            setCurrentUser(null);
        }
        setAuthReady(true);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('splashScreenShown');
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splashScreenShown', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setAppView('admin');
    }
  }, []);

  useEffect(() => {
    try {
        const storedDownloads = localStorage.getItem('downloadedMovies');
        if (storedDownloads) setDownloadedMovies(JSON.parse(storedDownloads));

        const storedQuality = localStorage.getItem('downloadQuality') as DownloadQuality;
        if (storedQuality) setDownloadQuality(storedQuality);

        const storedAutoDelete = localStorage.getItem('autoDelete');
        if (storedAutoDelete) setAutoDelete(JSON.parse(storedAutoDelete));
        
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
    }
  }, []);
  
  useEffect(() => {
    const initializeCastApi = () => {
      // Robust check for Cast SDK availability to prevent race conditions.
      if (!window.cast || !window.cast.framework || !window.cast.framework.CastContext || !window.cast.framework.AutoJoinPolicy || !window.chrome || !window.chrome.cast || !window.chrome.cast.media) {
        console.warn('Cast SDK not fully loaded yet, retrying...');
        setTimeout(initializeCastApi, 100);
        return;
      }
      
      const castContext = window.cast.framework.CastContext.getInstance();
      castContext.setOptions({
        receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
        autoJoinPolicy: window.cast.framework.AutoJoinPolicy.ORIGIN_SCOPED,
      });

      const handleCastStateChange = (event: any) => {
        setIsCastAvailable(event.castState !== window.cast.framework.CastState.NO_DEVICES_AVAILABLE);
      };

      const handleSessionStateChange = (event: any) => {
         const sessionState = event.sessionState;
         const isSessionActive = sessionState === window.cast.framework.SessionState.SESSION_STARTED;
         setIsCasting(isSessionActive);
         if (!isSessionActive) {
            setIsControllingCast(false);
         }
      };

      castContext.addEventListener(window.cast.framework.CastContextEventType.CAST_STATE_CHANGED, handleCastStateChange);
      castContext.addEventListener(window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED, handleSessionStateChange);
      
      const castState = castContext.getCastState();
      setIsCastAvailable(castState !== window.cast.framework.CastState.NO_DEVICES_AVAILABLE);

      const session = castContext.getCurrentSession();
      setIsCasting(!!session && session.getSessionState() === window.cast.framework.SessionState.SESSION_STARTED);

      return () => {
        castContext.removeEventListener(window.cast.framework.CastContextEventType.CAST_STATE_CHANGED, handleCastStateChange);
        castContext.removeEventListener(window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED, handleSessionStateChange);
      };
    };
    
    window['__onGCastApiAvailable'] = (isAvailable: boolean) => {
      if (isAvailable) {
        initializeCastApi();
      }
    };
  }, []);

  // Effect for advanced PWA features: Push, Background Sync, Periodic Sync
  useEffect(() => {
    // Helper function to convert VAPID key for push notifications
    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
      
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            if (!registration) {
                console.error("Service worker registration not found.");
                return;
            }
            
            // --- Push Notifications ---
            const requestNotificationPermission = async () => {
                if (!('PushManager' in window)) {
                    console.log('Push messaging is not supported.');
                    return;
                }
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        console.log('Notification permission granted.');
                        // NOTE: Replace this placeholder with your actual VAPID public key from your server.
                        const vapidPublicKey = 'BCgqBCEqZkU1a3S-w_q-w2e8j-5p-9n_7k_3v_1f_8x_6z_4o_2c_0a_8s_6w_4q_2m_0k_7i_5g_3e_1cQ';
                        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
                        
                        const subscription = await registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: convertedVapidKey,
                        });
                        console.log('Push subscription successful:', JSON.stringify(subscription));
                        // In a real app, you would send this subscription object to your server to send pushes.
                    } else {
                        console.log('Notification permission denied.');
                    }
                } catch (error) {
                    console.error('Failed to subscribe to push notifications:', error);
                }
            };
            
            // --- Background Sync ---
            const registerBackgroundSync = async () => {
                if ('sync' in registration) {
                    try {
                        await (registration as any).sync.register('my-background-sync');
                        console.log('Background sync registered.');
                    } catch (error) {
                        console.error('Background sync registration failed:', error);
                    }
                } else {
                    console.log('Background sync is not supported.');
                }
            };

            // --- Periodic Sync ---
            const registerPeriodicSync = async () => {
                if ('periodicSync' in registration) {
                    try {
                        const status = await navigator.permissions.query({ name: 'periodic-background-sync' as PermissionName });
                        if (status.state === 'granted') {
                            await (registration as any).periodicSync.register('update-content-periodically', {
                                minInterval: 24 * 60 * 60 * 1000, // 24 hours
                            });
                            console.log('Periodic sync registered.');
                        } else {
                            console.log('Periodic sync permission not granted. User may be prompted later.');
                        }
                    } catch (error) {
                        console.error('Periodic sync registration failed:', error);
                    }
                } else {
                    console.log('Periodic sync is not supported.');
                }
            };
            
            requestNotificationPermission();
            registerBackgroundSync();
            registerPeriodicSync();
        });
    }
  }, []);

  useEffect(() => {
      localStorage.setItem('downloadedMovies', JSON.stringify(downloadedMovies));
  }, [downloadedMovies]);

  useEffect(() => {
      localStorage.setItem('downloadQuality', downloadQuality);
  }, [downloadQuality]);

  useEffect(() => {
      localStorage.setItem('autoDelete', JSON.stringify(autoDelete));
  }, [autoDelete]);
  

  useEffect(() => {
    if (autoDelete) {
        const watchedMovieIds = CONTINUE_WATCHING
            .filter(m => m.progress && m.progress >= 95)
            .map(m => m.id);
        
        const remainingDownloads = downloadedMovies.filter(
            downloadedMovie => !watchedMovieIds.includes(downloadedMovie.id)
        );

        if (remainingDownloads.length < downloadedMovies.length) {
            setDownloadedMovies(remainingDownloads);
        }
    }
  }, [autoDelete, downloadedMovies, activeTab]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    // FIX: Use compat API for signOut.
    auth.signOut().catch(error => console.error("Sign out error", error));
  };
  
  const handleDownloadMovie = (movie: Movie) => {
    const videoUrl = movie.videoUrl_480p; // Default to 480p for now
    if (navigator.serviceWorker.controller && videoUrl) {
        navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_VIDEO',
            url: videoUrl
        });
    }

    setDownloadedMovies(prev => {
        if (prev.some(m => m.id === movie.id)) {
            return prev;
        }
        
        let sizeMultiplier = 1;
        if (downloadQuality === 'Good') sizeMultiplier = 0.5;
        if (downloadQuality === 'Best') sizeMultiplier = 1.8;
        
        const downloadedMovie: Movie = {
            ...movie,
            downloadQuality: downloadQuality,
            size: movie.baseSize ? parseFloat((movie.baseSize * sizeMultiplier).toFixed(2)) : 0.45,
        };

        return [...prev, downloadedMovie];
    });
  };

  const handleRemoveDownload = (movie: Movie) => {
      const videoUrl = movie.videoUrl_480p;
      if (navigator.serviceWorker.controller && videoUrl) {
        navigator.serviceWorker.controller.postMessage({
            type: 'DELETE_VIDEO',
            url: videoUrl
        });
    }
    setDownloadedMovies(prev => prev.filter(m => m.id !== movie.id));
  };
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);
  
  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  
  const handleBackFromDetails = () => {
    setSelectedMovie(null);
  };

  const handleCancelSearch = () => {
    setActiveTab('Home');
  };

  const handleSettingsClick = () => {
    setActiveTab('Settings');
  };

  const handleBackClick = () => {
    if (activeSetting) {
      setActiveSetting(null);
    } else {
      setActiveTab('Home');
    }
  };
  
  const handleProfileClick = () => setView('myAccount');
  
  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    setView('profileDetails');
  };
  
  const handleBackFromProfileDetails = () => {
    setView('profiles');
    setSelectedProfile(null);
    setActiveProfileFeature(null);
  };

  const handleBackFromProfileFeature = () => {
    setActiveProfileFeature(null);
  };

  const handlePlayMovie = () => {
    if (!selectedMovie) return;
    
    if (isCasting) {
      const castSession = window.cast.framework.CastContext.getInstance().getCurrentSession();
      if (castSession) {
        const mediaUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
        const mediaInfo = new window.chrome.cast.media.MediaInfo(mediaUrl, 'video/mp4');
        mediaInfo.metadata = new window.chrome.cast.media.GenericMediaMetadata();
        mediaInfo.metadata.metadataType = window.chrome.cast.media.MetadataType.GENERIC;
        mediaInfo.metadata.title = selectedMovie.title;
        mediaInfo.metadata.subtitle = selectedMovie.description;
        mediaInfo.metadata.images = [{ url: selectedMovie.backdropUrl }];
        
        const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
        
        castSession.loadMedia(request).then(
          () => { 
            console.log('Media loaded successfully on cast device.');
            setIsControllingCast(true);
          },
          (errorCode: any) => { console.error('Error loading media on cast device: ' + errorCode); }
        );
      }
    } else {
      setIsPlayerOpen(true);
    }
  };
  
  const handleCastClick = () => {
    if (!isCastAvailable) return;
    const castContext = window.cast.framework.CastContext.getInstance();
    castContext.requestSession().catch((error: any) => {
      if (error !== window.chrome.cast.ErrorCode.CANCEL) {
        console.error('Error requesting cast session:', error);
      }
    });
  };

  const handleClosePlayer = () => setIsPlayerOpen(false);

  const handleNextMovie = () => {
    if (!selectedMovie) return;
    const allMovies = [...PRIME_MOVIES, ...PRIME_ORIGINALS, ...CONTINUE_WATCHING];
    const currentIndex = allMovies.findIndex(m => m.id === selectedMovie.id);
    if (currentIndex !== -1) {
        const nextIndex = (currentIndex + 1) % allMovies.length;
        setSelectedMovie(allMovies[nextIndex]);
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'Home' && activeTab === 'Home') setActiveCategory('All');
    setActiveTab(tab);
  };
  
  if (showSplash) return <SplashScreen />;
  if (!authReady) return null; // Wait for auth state to be ready

  if (appView === 'admin') {
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <AdminPage />
        </ThemeContext.Provider>
    );
  }

  if (!currentUser) {
    return <Auth />;
  }

  if (isControllingCast && selectedMovie) {
    return <CastPlayer movie={selectedMovie} onClose={() => setIsControllingCast(false)} />;
  }

  if (isPlayerOpen && selectedMovie) {
    return <VideoPlayer movie={selectedMovie} onClose={handleClosePlayer} onNextEpisode={handleNextMovie} />;
  }

  if (view === 'myAccount') {
    return <MyAccount 
      currentUser={currentUser} 
      onBack={() => setView('app')}
      onManageProfiles={() => setView('profiles')}
      onLogout={handleLogout}
    />;
  }

  if (view === 'profiles') {
    return <Profiles profiles={PROFILES} onProfileSelect={handleProfileSelect} onBack={() => setView('myAccount')} />;
  }

  if (view === 'profileDetails' && selectedProfile) {
    if (activeProfileFeature) {
        switch (activeProfileFeature) {
            case 'history':
                return <ViewingHistory profile={selectedProfile} onBack={handleBackFromProfileFeature} onMovieClick={handleMovieSelect} />;
            case 'recommendations':
                return <Recommendations profile={selectedProfile} onBack={handleBackFromProfileFeature} onMovieClick={handleMovieSelect} />;
            case 'sync':
                return <DeviceSync profile={selectedProfile} onBack={handleBackFromProfileFeature} />;
            default:
                setActiveProfileFeature(null);
        }
    }
    return <ProfileDetails profile={selectedProfile} onBack={handleBackFromProfileDetails} onFeatureSelect={setActiveProfileFeature} />;
  }

  const renderSettingsContent = () => {
    switch (activeSetting) {
      case 'theme': return <ThemeSettings />;
      case 'language': return <LanguageSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'downloads': return <DownloadSettings quality={downloadQuality} onQualityChange={setDownloadQuality} autoDelete={autoDelete} onAutoDeleteChange={setAutoDelete} />;
      case 'data': return <DataUsageSettings />;
      case 'privacy': return <PrivacySettings />;
      default: return <Settings onSettingClick={setActiveSetting} onLogout={handleLogout} />;
    }
  };

  const renderContent = () => {
    if (selectedMovie) {
        return <MovieDetails movie={selectedMovie} onBack={handleBackFromDetails} onDownload={handleDownloadMovie} downloadedMovies={downloadedMovies} onPlay={handlePlayMovie} />;
    }
    
    switch (activeTab) {
      case 'Home':
        return (
          <>
            <div className="sticky top-0 bg-[var(--background-color)] z-10 pt-2">
              <CategoryNav
                categories={CATEGORIES}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
            {activeCategory === 'All' ? (
              <>
                <HeroCarousel items={CAROUSEL_ITEMS} />
                <ContentRow title="SAHAN FILMS™ movies" items={PRIME_MOVIES} wide={true} onMovieClick={handleMovieSelect} />
                <ContentRow title="SAHAN FILMS™ Originals" items={PRIME_ORIGINALS} wide={false} onMovieClick={handleMovieSelect} />
                <ContentRow title="Continue Watching" items={CONTINUE_WATCHING} wide={true} onMovieClick={handleMovieSelect} />
              </>
            ) : (
              <CategoryPage category={activeCategory} onMovieClick={handleMovieSelect} />
            )}
          </>
        );
      case 'Search':
        return <SearchResults />;
      case 'Settings':
        return renderSettingsContent();
      case 'Downloads':
        return <Downloads movies={downloadedMovies} onRemove={handleRemoveDownload} onMovieClick={handleMovieSelect} />;
      case 'Films':
        return <FilmsPage onMovieClick={handleMovieSelect} />;
      case 'Kids':
        return <KidsPage onMovieClick={handleMovieSelect} />;
      default:
        return (
            <div className="p-4 text-center text-[var(--text-color-secondary)] mt-8">
              <p>Content for the '{activeTab}' tab is not yet available.</p>
            </div>
        );
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="bg-[var(--background-color-secondary)] h-screen w-full max-w-md mx-auto flex flex-col font-sans shadow-2xl text-[var(--text-color)] animate-fade-in">
        <div className="bg-black/50 text-white text-xs px-4 pt-1 flex justify-between fixed top-0 left-0 right-0 max-w-md mx-auto z-50">
          <span>9:41</span>
          <div className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" clipRule="evenodd" fillRule="evenodd" pathLength="1" stroke="none" fill="currentColor"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16"><path d="M4 11.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2Zm2.5-6.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-6Z"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16"><path d="M12.5 7.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5Z"></path><path d="M1.22 5.922a.5.5 0 0 1 .353-.145h12.854a.5.5 0 0 1 .353.854l-2.347 2.682a.5.5 0 0 1-.708 0L9.5 7.56l-1.354 1.547a.5.5 0 0 1-.708 0L6.085 7.78a.5.5 0 0 1-.707 0l-2.43-2.776a.5.5 0 0 1 0-.708l.272-.309Z"></path><path d="M1 4.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-7Z"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path></svg>
          </div>
        </div>
        <div className="pt-6">
            {!selectedMovie && view === 'app' && !isPlayerOpen &&
                <Header 
                    isSearchActive={activeTab === 'Search'} 
                    onCancelSearch={handleCancelSearch}
                    isSettingsActive={activeTab === 'Settings'}
                    onSettingsClick={handleSettingsClick}
                    onBackClick={handleBackClick}
                    activeSetting={activeSetting}
                    onProfileClick={handleProfileClick}
                    isCastAvailable={isCastAvailable}
                    isCasting={isCasting}
                    onCastClick={handleCastClick}
                    currentUser={currentUser}
                    isOnline={isOnline}
                />
            }
        </div>
        <main className={`flex-1 overflow-y-auto no-scrollbar ${!selectedMovie && 'pb-16'}`}>
          {renderContent()}
        </main>
        {activeTab !== 'Settings' && !selectedMovie && view === 'app' && !isPlayerOpen && <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />}
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
