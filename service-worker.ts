/// <reference lib="webworker" />

// FIX: Removed redeclaration of 'self' which was causing type conflicts with the global service worker scope.
// FIX: Cast self to the correct ServiceWorkerGlobalScope type to fix errors where properties were not found on 'unknown'.
const sw = self as unknown as ServiceWorkerGlobalScope;

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
  '/components/Watchlist.tsx',
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
  const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGE_CACHE_NAME];
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

    // Strategy for navigation requests (handle SPA routing and offline)
    if (request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    // Try the network first
                    const networkResponse = await fetch(request);
                    return networkResponse;
                } catch (error) {
                    // If the network fails, serve the cached index.html for any SPA route
                    console.log('Fetch failed for navigation; returning cached app shell.', error);
                    const cache = await caches.open(STATIC_CACHE_NAME);
                    // The main entry point for the SPA
                    const cachedResponse = await cache.match('/index.html');
                    return cachedResponse!;
                }
            })()
        );
        return;
    }

    // Strategy for non-navigation requests (images, APIs, etc.)
    // Stale-While-Revalidate for images
    if (url.hostname === 'picsum.photos') {
        event.respondWith(
            caches.open(IMAGE_CACHE_NAME).then(async (cache) => {
                const cachedResponse = await cache.match(request);
                const fetchedResponsePromise = fetch(request).then((networkResponse) => {
                    cache.put(request, networkResponse.clone());
                    return networkResponse;
                });
                return cachedResponse || fetchedResponsePromise;
            })
        );
        return;
    }

    // Cache-first for other assets (app shell, CDNs), with network fallback
    event.respondWith(
        caches.match(request).then((response) => {
            return response || fetch(request).then(fetchRes => {
                // Cache the new resource in the dynamic cache
                return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                    // Don't cache Firestore requests as it has its own offline persistence
                    if (!url.href.includes('firestore.googleapis.com')) {
                       cache.put(request, fetchRes.clone());
                    }
                    return fetchRes;
                });
            });
        })
    );
});


// --- PUSH NOTIFICATIONS ---
// Listen for push events from a server
sw.addEventListener('push', (event: PushEvent) => {
  const data = event.data ? event.data.json() : { title: 'SAHAN FILMS ™', body: 'A new movie has been added!', icon: '/icons/icon-192x192.png' };

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png' // A badge for the notification bar on mobile
  };

  event.waitUntil(
    sw.registration.showNotification(data.title, options)
  );
});

// Listen for notification clicks
sw.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  event.waitUntil(
    // FIX: Use 'self.clients' to access the Clients interface.
    sw.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window for the app is already open, focus it
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      // FIX: Use 'self.clients' to access the Clients interface.
      if (sw.clients.openWindow) {
        // FIX: Use 'self.clients' to access the Clients interface.
        return sw.clients.openWindow('/');
      }
    })
  );
});


// --- BACKGROUND SYNC ---
// Listen for one-off sync events, triggered when connection is restored
// FIX: Changed SyncEvent to 'any' to resolve type error for this experimental API.
sw.addEventListener('sync', (event: any) => {
  if (event.tag === 'my-background-sync') {
    console.log('Service Worker: Background sync event received.');
    event.waitUntil(
      // Example: Send queued form data or analytics when connection is restored.
      new Promise<void>(resolve => {
        console.log("Simulating background sync task (e.g., sending queued data)...");
        setTimeout(resolve, 2000); // Simulate network task
      }).then(() => {
        console.log("Background sync task complete.");
        sw.registration.showNotification('Sync Complete', {
          body: 'Your queued data has been successfully synced.'
        });
      })
    );
  }
});


// --- PERIODIC SYNC ---
// Listen for periodic sync events to fetch content proactively
// FIX: Changed PeriodicSyncEvent to 'any' to resolve type error for this experimental API.
sw.addEventListener('periodicsync', (event: any) => {
  if (event.tag === 'update-content-periodically') {
    console.log('Service Worker: Periodic sync event received.');
    event.waitUntil(
      // Example: Fetch latest movie data and update cache.
      new Promise<void>(resolve => {
        console.log("Simulating periodic content update...");
        // In a real app, you would fetch from the network and update caches here.
        setTimeout(resolve, 3000);
      }).then(() => {
         console.log("Periodic content update complete.");
         sw.registration.showNotification('Content Updated', {
           body: 'New movies and shows are now available offline.'
         });
      })
    );
  }
});