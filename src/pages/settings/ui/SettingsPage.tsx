import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/store/hooks";
import { selectCurrentUser } from "../../../entities/user";
import { LogoutButton } from "../../../features/logout";
import { ROUTES } from "../../../shared/config/routes";
import styles from "./SettingsPage.module.css"

export default function SettingsPage() {
    const navigate = useNavigate()
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
                <LogoutButton onLoggedOut={() => navigate(ROUTES.LOGIN, { replace: true })} />
            </div>
        </main>
    )
}