"use client";

import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { RegionLabels } from "./_components/region-labels";

import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";

const HomeClient = () => {
    const extractTimeFrame = createTimeFrameExtractor();

    return (
        <>
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

            <UsedDevices
                className="col-span-12 xl:col-span-5"
                key={extractTimeFrame("used_devices")}
                timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
            />

            <RegionLabels />
        </>
    );
};

export default HomeClient;
