import React from "react";
import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);


    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    const getColorClass = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 50) return "text-yellow-500";
        return "text-red-600";
    };

    const clamp = (value: number) => Math.min(100, Math.max(0, value));

    const normalizedScore = clamp(score);
    const percentage = normalizedScore / 100;
    const colorClass = React.useMemo(() => getColorClass(normalizedScore), [normalizedScore]);
    
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full h-full">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <defs>
                        <linearGradient
                            id="gaugeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#fca5a5" />
                        </linearGradient>
                    </defs>

                    {/* Background arc */}
                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Foreground arc with rounded ends */}
                    <path
                        ref={pathRef}
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength * (1 - percentage)}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <div className="text-sm lg:text-xl font-semibold pt-4 flex"><span className={colorClass}>{score}</span>/100</div>
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;