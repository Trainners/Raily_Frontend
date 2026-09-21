import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetNotificationsQuery, useMarkAsReadMutation } from '../../../entities/notification';
import { Note } from '../../../shared/ui';
import styles from './NotificationsPage.module.css';

export default function NotificationsPage() {
    const { data: items = [], isLoading, isError } = useGetNotificationsQuery();
    const [markAsRead] = useMarkAsReadMutation();
    const [searchParams] = useSearchParams();

    // 푸시를 눌러 들어오면 ?highlight=12 가 붙어 있다. 없으면 Number(null) = 0
    const highlightId = Number(searchParams.get('highlight')) || 0;
    const highlightRef = useRef<HTMLLIElement | null>(null);
    // 같은 highlight 에 대해 스크롤/자동 읽음을 한 번만 하기 위한 기록
    const handledIdRef = useRef(0);

    useEffect(() => {
        if (highlightId === 0 || handledIdRef.current === highlightId) return;
        const target = items.find((item) => item.id === highlightId);
        // 목록이 아직 안 왔거나 50건 밖으로 밀려난 알림이면 아무것도 하지 않는다
        if (!target) return;

        handledIdRef.current = highlightId;
        highlightRef.current?.scrollIntoView({ block: 'center' });
        if (!target.read) void markAsRead(target.id);
    }, [highlightId, items, markAsRead]);

    if (isLoading) {
        return (
            <section className={styles.page}>
                <p className={styles.status}>알림을 불러오는 중...</p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className={styles.page}>
                <Note tone="error">알림을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</Note>
            </section>
        );
    }

    if (items.length === 0) {
        return (
            <section className={styles.page}>
                <Note>받은 알림이 없습니다.</Note>
            </section>
        );
    }

    return (
        <section className={styles.page}>
            <ul className={styles.list}>
                {items.map((item) => {
                    const isHighlighted = item.id === highlightId;
                    const className = [
                        styles.item,
                        item.read ? '' : styles.unread,
                        isHighlighted ? styles.highlight : '',
                    ].filter(Boolean).join(' ');

                    return (
                        <li key={item.id} ref={isHighlighted ? highlightRef : null}>
                            <button
                                type="button"
                                className={className}
                                onClick={() => { if (!item.read) void markAsRead(item.id); }}
                            >
                                <strong className={styles.title}>{item.title}</strong>
                                <span className={styles.body}>{item.body}</span>
                                <time className={styles.time} dateTime={item.createdAt}>
                                    {new Date(item.createdAt).toLocaleString('ko-KR')}
                                </time>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}