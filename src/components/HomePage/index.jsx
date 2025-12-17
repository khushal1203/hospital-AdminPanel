import React from "react";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";

const HomePage = async ({ searchParams }) => {
    const extractTimeFrame = createTimeFrameExtractor(searchParams?.timeframe);

    return (
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
            <PaymentsOverview
                className="col-span-12 xl:col-span-7"
                key={extractTimeFrame("payments_overview")}
                timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
            />

            <WeeksProfit
                className="col-span-12 xl:col-span-5"
                key={extractTimeFrame("weeks_profit")}
                timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
            />
        </div>
    );
};

export default HomePage;
