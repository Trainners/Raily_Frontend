import { useEffect, type ReactNode } from "react";
import { useReissueMutation } from "../../entities/user";

// 앱 시작 시 한 번만 reissue를 호출해 세션을 복원한다
// - 쿠키가 있으면 새 accessToken → status 'authenticated'
// - 없으면 400 -> status 'anonymous'
// 결과 반영은 userApi.reissue의 onQueryStarted가 담당하므로 여기서는 호출만.
export function AuthBootstrap({ children }: { children: ReactNode }) {
    const [reissue] = useReissueMutation();

    useEffect(() => {
        void reissue();
    }, [reissue]);

    return <>{children}</>;
}

export { ServiceWorkerBridge } from "./ServiceWorkerBridge.tsx";
