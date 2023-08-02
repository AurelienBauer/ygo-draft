// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/pie
import { ResponsivePie } from "@nivo/pie";
import React from "react";

interface SimplePieData {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: SimplePieData[];
  centerValue?: string | null;
}

function SimplePieChart({ data, centerValue }: Props) {
  return (
    <div className="simple-pie-root">
      <ResponsivePie
        data={data}
        margin={{
          top: 10, right: 10, bottom: 10, left: 10,
        }}
        innerRadius={0.5}
        activeOuterRadiusOffset={8}
        colors={{ datum: "data.color" }}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        enableArcLinkLabels={false}
        enableArcLabels={false}
        arcLabel={(e) => `${e.id} (${e.value})`}
        arcLabelsSkipAngle={17}
        arcLabelsTextColor={{ theme: "background" }}
      />
      {centerValue && <div className="simple-pie-overlay">{centerValue}</div>}
    </div>
  );
}

SimplePieChart.defaultProps = {
  centerValue: null,
};

export default SimplePieChart;
