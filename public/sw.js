// React 번들과 별개로 브라우저가 직접 실행하는 파일
self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

// 활성화되자마자 이미 열려 있는 탭들도 이 SW 의 제어를 받도록 함
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// 서버가 푸시를 보내면 브라우저가 (탭이 닫혀 있어도) 이 SW 를 깨워 push 이벤트를 줌
self.addEventListener('push', (event) => {
    // 백엔드 PushMessage 와 같은 모양: { title, body, url, tag, notificationId }
    let payload = { title: 'Raily', body: '새 알림이 있습니다.', url: '/notifications', tag: 'raily' };
    try {
        if (event.data) payload = { ...payload, ...event.data.json() };
    } catch {
        // JSON 이 아니어도 기본 문구로 알림은 보냄
    }

    const options = {
        body: payload.body,
        icon: '/icons/icon-192.png',
        // Android 상태바용 아이콘
        badge: '/icons/icon-192.png',
        // 같은 tag 는 이전 알림을 덮어쓰도록 하여 같은 좌석에 알림이 계속해서 쌓이지 않도록 함
        tag: payload.tag,
        // tag 로 덮어쓰더라도 알림은 울리게함
        renotify: true,
        data: {
            url: payload.url, notificationId: payload.notificationId
        },
    };

    event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) || '/notifications';

    event.waitUntil(
        // 이미 열려 있는 Raily 창(브라우저 탭 또는 PWA 창)을 찾음
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            const existing = windowClients.find((client) => 'focus' in client);
            if (existing) {
                // 열린 창이 있으면 앞으로 가져오고, React 앱에게 "이 경로로 이동해라" 메시지를 보냄
                return existing.focus().then((client) => {
                    client.postMessage({ type: 'NAVIGATE', url: targetUrl });
                });
            }
            // 열린 창이 없으면 새 창. 같은 출처 상대경로여야 PWA 창으로 열린다.
            return self.clients.openWindow(targetUrl);
        })
    );
});