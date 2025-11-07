/// <reference lib="webworker" />

// FIX: Removed redeclaration of 'self' which was causing type conflicts with the global service worker scope.
// FIX: Cast self to the correct ServiceWorkerGlobalScope type to fix errors where properties were not found on 'unknown'.
const sw = self as unknown as ServiceWorkerGlobalScope;

const STATIC_CACHE_NAME = 'sahan-films-static-v2';
const DYNAMIC_CACHE_NAME = 'sahan-films-dynamic-v2';
const IMAGE_CACHE_NAME = 'sahan-films-images-v2';
const VIDEO_CACHE_NAME = 'sahan-films-videos-v2';

// App Shell: All the files that are needed for the app to work offline
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/index.tsx', // The main script
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/firebase.ts',
  '/assets/video.ts',
  // components
  '/components/Auth.tsx',
  '/components/Onboarding.tsx',
  '/components/BottomNav.tsx',
  '/components/CategoryNav.tsx',
  '/components/ContentRow.tsx',
  '/components/Header.tsx',
  '/components/HeroCarousel.tsx',
  '/components/Icons.tsx',
  '/components/KidsPage.tsx',
  '/components/MovieDetails.tsx',
  '/components/MovieCard.tsx',
  '/components/Profiles.tsx',
  '/components/ProfileDetails.tsx',
  '/components/Downloads.tsx',
  '/components/NewsPage.tsx',
  '/components/CategoryPage.tsx',
  '/components/CastPlayer.tsx',
  '/components/VideoPlayer.tsx',
  '/components/SearchResults.tsx',
  '/components/SplashScreen.tsx',
  '/components/SubscriptionsPage.tsx',
  '/components/Settings.tsx',
  '/components/settings/DataUsageSettings.tsx',
  '/components/settings/DownloadSettings.tsx',
  '/components/settings/LanguageSettings.tsx',
  '/components/settings/NotificationSettings.tsx',
  '/components/settings/PrivacySettings.tsx',
  '/components/settings/ThemeSettings.tsx',
  '/components/Modal.tsx',
  '/components/ToggleSwitch.tsx',
  '/components/ProfilePage.tsx',
  // Admin components
  '/components/AdminPage.tsx',
  '/components/admin/AnalyticsDashboard.tsx',
  '/components/admin/ContentManagement.tsx',
  '/components/admin/Monetization.tsx',
  '/components/admin/PlatformCustomization.tsx',
  '/components/admin/UserManagement.tsx',
  '/components/MyAccount.tsx',
];

// Install event: Cache the App Shell
sw.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('Service Worker: Pre-caching App Shell');
      // Use addAll with a new Request object with cache:'reload' to bypass HTTP cache
      const requests = APP_SHELL_URLS.map(url => new Request(url, { cache: 'reload' }));
      return cache.addAll(requests);
    })
  );
});

// Activate event: Clean up old caches
sw.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGE_CACHE_NAME, VIDEO_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  return sw.clients.claim();
});

// Fetch event: Serve from cache or network, with offline fallback for navigation
sw.addEventListener('fetch', (event: FetchEvent) => {
    const { request } = event;
    const url = new URL(request.url);

    // Strategy for local videos (served via data URI, but we'll use a cache-first approach for paths)
    if (request.url.includes('/assets/videos/')) {
        event.respondWith(
            caches.open(VIDEO_CACHE_NAME).then(async (cache) => {
                const cachedResponse = await cache.match(request);
                if (cachedResponse) return cachedResponse;
                
                const networkResponse = await fetch(request);
                cache.put(request, networkResponse.clone());
                return networkResponse;
            })
        );
        return;
    }

    // Strategy for navigation requests (handle SPA routing and offline)
    if (request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    const networkResponse = await fetch(request);
                    return networkResponse;
                } catch (error) {
                    console.log('Fetch failed for navigation; returning cached app shell.', error);
                    const cache = await caches.open(STATIC_CACHE_NAME);
                    const cachedResponse = await cache.match('/index.html');
                    return cachedResponse!;
                }
            })()
        );
        return;
    }

    // Strategy for images: Stale-While-Revalidate
    if (url.hostname === 'picsum.photos' || url.hostname === 'image.tmdb.org') {
        event.respondWith(
            caches.open(IMAGE_CACHE_NAME).then(async (cache) => {
                const cachedResponse = await cache.match(request);
                const fetchedResponsePromise = fetch(request).then((networkResponse) => {
                    cache.put(request, networkResponse.clone());
                    return networkResponse;
                }).catch(err => {
                    console.error("Image fetch failed: ", err);
                    return new Response(); // Return empty response on failure
                });
                return cachedResponse || fetchedResponsePromise;
            })
        );
        return;
    }

    // Strategy for app shell and other assets: Cache-first, then network
    event.respondWith(
        caches.match(request).then((response) => {
            return response || fetch(request).then(fetchRes => {
                return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                    if (!url.href.includes('firestore.googleapis.com') && !url.href.includes('google.com/recaptcha')) {
                       cache.put(request, fetchRes.clone());
                    }
                    return fetchRes;
                });
            });
        })
    );
});

// Message listener for commands from the main app
// FIX: Changed event type from MessageEvent to ExtendableMessageEvent to access waitUntil.
sw.addEventListener('message', (event: ExtendableMessageEvent) => {
    if (event.data && event.data.type === 'CACHE_VIDEO') {
        const videoUrl = event.data.url;
        event.waitUntil(
            caches.open(VIDEO_CACHE_NAME).then(cache => {
                console.log('Service Worker: Caching video:', videoUrl);
                return cache.add(videoUrl);
            })
        );
    }
    if (event.data && event.data.type === 'DELETE_VIDEO') {
        const videoUrl = event.data.url;
         event.waitUntil(
            caches.open(VIDEO_CACHE_NAME).then(cache => {
                console.log('Service Worker: Deleting video:', videoUrl);
                return cache.delete(videoUrl);
            })
        );
    }
    if (event.data && event.data.type === 'CLEAR_VIDEO_CACHE') {
        event.waitUntil(
            caches.delete(VIDEO_CACHE_NAME).then(() => {
                console.log('Service Worker: Video cache cleared.');
            })
        );
    }
});


// --- PUSH NOTIFICATIONS ---
sw.addEventListener('push', (event: PushEvent) => {
  const data = event.data ? event.data.json() : { title: 'RIYOBOX', body: 'A new movie has been added!', icon: '/icons/icon-192x192.png' };
  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png'
  };
  event.waitUntil(sw.registration.showNotification(data.title, options));
});

sw.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  event.waitUntil(
    sw.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (sw.clients.openWindow) {
        return sw.clients.openWindow('/');
      }
    })
  );
});

// --- BACKGROUND SYNC ---
sw.addEventListener('sync', (event: any) => {
  if (event.tag === 'my-background-sync') {
    event.waitUntil(
      new Promise<void>(resolve => {
        console.log("Simulating background sync task...");
        setTimeout(resolve, 2000);
      }).then(() => {
        sw.registration.showNotification('Sync Complete', { body: 'Your queued data has been successfully synced.' });
      })
    );
  }
});

// --- PERIODIC SYNC ---
sw.addEventListener('periodicsync', (event: any) => {
  if (event.tag === 'update-content-periodically') {
    event.waitUntil(
      new Promise<void>(resolve => {
        console.log("Simulating periodic content update...");
        setTimeout(resolve, 3000);
      }).then(() => {
         sw.registration.showNotification('Content Updated', { body: 'New movies and shows are now available offline.' });
      })
    );
  }
});