import { useAuthStore } from "@/store/useAuthStore";

export async function delayForMockData() {
    if (!useAuthStore.getState().useMockData) return;

    await new Promise((resolve) => setTimeout(resolve, 1000));
}
