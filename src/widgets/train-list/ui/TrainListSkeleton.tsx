import styles from './TrainList.module.css';

export type TrainListSkeletonProps = {
    count?: number;     // 보여줄 가짜 줄 수
}

export default function TrainListSkeleton({ count = 4 }: TrainListSkeletonProps) {
    return (
        // 스크린리더에는 "불러오는 중"이라는 사실만 알리고, 회색 막대 자체는 숨긴다
        <div className={styles.list} role="status" aria-label="열차 정보를 불러오는 중입니다.">
            {Array.from({ length: count }, (_, index) => (
                <div className={styles.skeletonRow} key={index} aria-hidden="true">
                    <span className={`${styles.skeletonBar} ${styles.skeletonBarShort}`} />
                    <span className={`${styles.skeletonBar} ${styles.skeletonBarLong}`} />
                </div>
            ))}
        </div>
    )
}