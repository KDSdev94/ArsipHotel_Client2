import React, { useMemo } from 'react';

const GrafikTrenUnggahan = ({ archives = [] }) => {
    const { chartData, months, maxCount } = useMemo(() => {
        const now = new Date();
        const last6Months = [];

        // Generate last 6 months labels
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last6Months.push({
                month: date.getMonth(),
                year: date.getFullYear(),
                label: date.toLocaleString('id-ID', { month: 'short' }).toUpperCase()
            });
        }

        // Count uploads per month
        const counts = last6Months.map(m => {
            return archives.filter(arsip => {
                const createdDate = new Date(arsip.created_at);
                return createdDate.getMonth() === m.month && createdDate.getFullYear() === m.year;
            }).length;
        });

        const max = Math.max(...counts, 1);

        // Map counts to SVG coordinates (viewBox 0 0 500 150)
        // x goes from 0 to 500 in 100 increments (6 points)
        // y goes from 150 (bottom) to 20 (top)
        const points = counts.map((count, i) => {
            const x = i * 100;
            const y = 150 - (count / max * 130); // 130 is the max height within viewBox
            return { x, y };
        });

        // Generate SVG path string (simple linear line for now, or could use curves)
        let pathD = `M${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            pathD += ` L${points[i].x},${points[i].y}`;
        }

        const fillD = `${pathD} V150 H0 Z`;

        return {
            chartData: { pathD, fillD, lastPoint: points[points.length - 1] },
            months: last6Months.map(m => m.label),
            maxCount: max
        };
    }, [archives]);

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-lg">Tren Unggahan (6 Bulan)</h3>
                    <p className="text-xs text-slate-500">Pertumbuhan volume arsip digital</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-primary"></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date().getFullYear()}</span>
                    </div>
                </div>
            </div>

            <div className="h-64 relative flex flex-col justify-between">
                <svg className="w-full h-48 mt-4" preserveAspectRatio="none" viewBox="0 0 500 150">
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: 'rgba(19, 91, 236, 0.2)', stopOpacity: 1 }}></stop>
                            <stop offset="100%" style={{ stopColor: 'rgba(19, 91, 236, 0)', stopOpacity: 0 }}></stop>
                        </linearGradient>
                    </defs>

                    <path d={chartData.fillD} fill="url(#chartGradient)"></path>
                    <path d={chartData.pathD} fill="none" stroke="#135bec" strokeLinecap="round" strokeWidth="3"></path>
                    <circle cx={chartData.lastPoint.x} cy={chartData.lastPoint.y} fill="#135bec" r="4"></circle>
                </svg>

                <div className="flex justify-between px-2 mt-4">
                    {months.map(month => (
                        <span key={month} className="text-[10px] font-bold text-slate-500">{month}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GrafikTrenUnggahan;
