/// <reference lib="webworker" />

const STATIC_CACHE_NAME = 'sahan-films-static-v1';
const DYNAMIC_CACHE_NAME = 'sahan-films-dynamic-v1';
const IMAGE_CACHE_NAME = 'sahan-films-images-v1';

// App Shell: All the files that are needed for the app to work offline
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/index.tsx', // The main script
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/firebase.ts',
  // components
  '/components/Auth.tsx',
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
  '/components/FilmsPage.tsx',
  '/components/CategoryPage.tsx',
  '/components/CastPlayer.tsx',
  '/components/VideoPlayer.tsx',
  '/components/SearchResults.tsx',
  '/components/SplashScreen.tsx',
  '/components/Settings.tsx',
  '/components/settings/DataUsageSettings.tsx',
  '/components/settings/DownloadSettings.tsx',
  '/components/settings/LanguageSettings.tsx',
  '/components/settings/NotificationSettings.tsx',
  '/components/settings/PrivacySettings.tsx',
  '/components/settings/ThemeSettings.tsx',
  '/components/Modal.tsx',
  '/components/ToggleSwitch.tsx',
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
self.addEventListener('install', (event: ExtendableEvent) => {
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
self.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGE_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: Serve from cache or network
self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);

  // Strategy 1: Stale-While-Revalidate for images from picsum.photos
  if (url.hostname === 'picsum.photos') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const fetchedResponsePromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return cachedResponse || fetchedResponsePromise;
      })
    );
  }
  // Strategy 2: Cache-First for local assets (App Shell)
  else if (APP_SHELL_URLS.includes(url.pathname) || url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
  // Strategy 3: Stale-While-Revalidate for external CDN assets and Firebase
  else {
    event.respondWith(
      caches.open(DYNAMIC_CACHE_NAME).then(async (cache) => {
        try {
            const fetchedResponse = await fetch(event.request);
            // Don't cache firestore requests as they have their own offline mechanism
            if (!url.href.includes('firestore.googleapis.com')) {
                cache.put(event.request, fetchedResponse.clone());
            }
            return fetchedResponse;
        } catch (error) {
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
            // If it's not in the cache and the network fails, the request will fail,
            // which is the expected behavior for dynamic content offline.
            throw error;
        }
      })
    );
  }
});
