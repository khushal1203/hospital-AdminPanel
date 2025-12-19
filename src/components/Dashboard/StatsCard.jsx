"use client";

import { MdTrendingUp } from "react-icons/md";

export default function StatsCard({ title, value, icon: Icon, color = "blue" }) {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
        orange: "from-orange-500 to-orange-600",
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">
                        {title}
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-gray-900">
                        {value}
                    </h3>
                </div>
                <div className={`rounded-full bg-gradient-to-br ${colorClasses[color]} p-3`}>
                    {Icon && <Icon className="h-6 w-6 text-white" />}
                </div>
            </div>
        </div>
    );
}
