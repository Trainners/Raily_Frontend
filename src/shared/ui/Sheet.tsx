import type { ReactNode } from 'react';
import styles from './Sheet.module.css';

export type SheetProps = {
    open: boolean;          // 시트 열려있는지 여부, true면 화면에 표시
    onClose: () => void;    // 닫기 요청 시 콜백
    children: ReactNode;    // 시트 내부에 표시할 내용
};

export default function Sheet({
    open,
    onClose,
    children,
}: SheetProps) {
    if (!open) {
        return null;
    }

    return (
        <div className={styles.container}>
            <button
                className={styles.overlay}
                type="button"
                onClick={onClose}
            />

            <section
                className={styles.sheet}
                role="dialog"
                aria-modal="true"
            >
                {children}
            </section>
        </div>
    )
}