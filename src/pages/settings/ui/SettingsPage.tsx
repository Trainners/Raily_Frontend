import { useAppSelector } from "../../../app/store/hooks";
import { selectCurrentUser } from "../../../entities/user";
import { Button } from "../../../shared/ui";
import styles from "./SettingsPage.module.css"

export default function SettingsPage() {
    const currentUser = useAppSelector(selectCurrentUser)
    const email = currentUser?.email ?? ''
    const name = currentUser?.name ?? ''

    return (
        <main className={styles.page}>
            <div className={styles.field}>
                <span className={styles.label}>이메일</span>
                <p className={styles.value}>{email}</p>
            </div>

            <div className={styles.field}>
                <span className={styles.label}>이름</span>
                <p className={styles.value}>{name}</p>
            </div>

            <div className={styles.logoutButton}>
                <Button fullWidth>
                    로그아웃
                </Button>
            </div>
        </main>
    )
}