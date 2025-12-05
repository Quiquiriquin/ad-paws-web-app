import React from "react";
import { Card } from "./ui/card";
import clsx from "clsx";

const AdPawsCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Card
      className={clsx(
        "bg-white border-[#E4F0E4] rounded-md p-6 relative",
        className
      )}
    >
      {children}
    </Card>
  );
};

export default AdPawsCard;
