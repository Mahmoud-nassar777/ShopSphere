export default function Loading() {
    return (
        <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6">
            {/* Outer glow ring */}
            <div className="relative flex h-24 w-24 items-center justify-center">
                {/* Soft pulse halo */}
                <div className="absolute inset-0 animate-ping rounded-full bg-orange-500/10" />

                {/* Static outer ring */}
                <div className="absolute inset-0 rounded-full border border-gray-200" />

                {/* Outer spinning arc */}
                <div
                    className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-orange-500/60"
                    style={{ animationDuration: "2s" }}
                />

                {/* Inner spinning arc (opposite direction) */}
                <div
                    className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-orange-500"
                    style={{ animationDuration: "1.2s", animationDirection: "reverse" }}
                />

                {/* Center dot */}
                <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]" />
            </div>

            {/* Text block */}
            <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium tracking-wide text-gray-500">
                    Loading
                    <span className="inline-flex w-6 justify-start">
                        <span className="animate-pulse">...</span>
                    </span>
                </p>

                {/* Progress bar shimmer */}
                <div className="h-[2px] w-24 overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full w-1/2 animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                    />
                </div>
            </div>

            {/* keyframes injected inline for Tailwind arbitrary animation */}
            <div className="h-[2px] w-24 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            </div>
        </div>
    );
}