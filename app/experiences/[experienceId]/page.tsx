import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import dynamic from "next/dynamic";

const GameExperience = dynamic(() => import("./GameExperience"), { ssr: false });

export default async function ExperiencePage({
    params,
}: {
    params: Promise<{ experienceId: string }>;
}) {
    const headersList = await headers();
    const { experienceId } = await params;

    const { userId } = await whopSdk.verifyUserToken(headersList);

    const result = await whopSdk.access.checkIfUserHasAccessToExperience({
        userId,
        experienceId,
    });

    const user = await whopSdk.users.getUser({ userId });
    const experience = await whopSdk.experiences.getExperience({ experienceId });

    const { accessLevel } = result;

    // 🔐 Optional: handle no-access case
    if (!result.hasAccess) {
        return (
            <div className="flex justify-center items-center h-screen px-8">
                <h1 className="text-xl text-red-500">Access Denied</h1>
            </div>
        );
    }

    // ✅ Render Unity Game inside iframe via GameExperience component
    return (
        <>
            <GameExperience />
        </>
    );
}
