import React from "react";
import AdPawsCard from "../AdPawsCard";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface InsightCardProps {
  title: string;
  data: string | number;
  disclaimer?: string;
  disclaimerIcon?: LucideIcon;
  mainIcon: LucideIcon;
  iconBackgroundColor?: string;
  iconColor?: string;
  iconFill?: string;
  className?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  data,
  disclaimer,
  disclaimerIcon: DisclaimerIcon,
  mainIcon: MainIcon,
  iconBackgroundColor = "#E4F0E4",
  iconColor = "#80AF80",
  iconFill = "#80AF80",
  className,
}) => {
  return (
    <AdPawsCard
      className={clsx("hover:shadow-md hover:cursor-pointer", className)}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-col justify-between gap-4">
          <p className="text-base text-light">{title}</p>
          <div className="flex flex-col gap-3">
            <p className="text-4xl font-bold">{data}</p>
            {disclaimer && (
              <div className="flex items-center gap-1 lg:gap-2">
                {DisclaimerIcon && <DisclaimerIcon className="w-4 h-4" />}
                <p className="text-xs portrait:md:text-sm xl:text-sm text-light">
                  {disclaimer}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div
            className="rounded-md w-[48px] h-[48px] flex items-center justify-center"
            style={{ backgroundColor: iconBackgroundColor }}
          >
            <MainIcon className="w-6 h-6" fill={iconFill} color={iconColor} />
          </div>
        </div>
      </div>
    </AdPawsCard>
  );
};

export default InsightCard;
