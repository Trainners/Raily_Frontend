import { JourneyForm } from "../../../widgets/journey-form";
import styles from './JourneySetupPage.module.css'

const mockRecentSegment = {
    from: '천안',
    to: '영등포'
}

export default function JourneySetupPage() {
    return (
        <main className={styles.page}>
            <JourneyForm
                recentSegment={mockRecentSegment}
                onSubmit={(values) => console.log(values)}
            />
        </main>
    );
}