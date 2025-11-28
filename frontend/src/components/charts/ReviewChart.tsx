import React from "react";

interface ReviewChartProps {
  type?: "pie" | "line" | "bar";
}

export const ReviewChart: React.FC<ReviewChartProps> = ({ type = "pie" }) => {
  // Placeholder: In a real implementation, you would render the appropriate chart based on 'type'
  return (
    <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
      <p className="text-gray-500">
        {type.charAt(0).toUpperCase() + type.slice(1)} Chart Placeholder
      </p>
    </div>
  );
};
