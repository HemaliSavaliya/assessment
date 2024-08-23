import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import createPlotlyComponent from "react-plotly.js/factory";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";

// Create Plotly React component via dependency injection
const Plot = createPlotlyComponent(window.Plotly);

// Create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

const PivotTable = ({ data }) => {
  const [pivotState, setPivotState] = useState({});

  useEffect(() => {
    const storedPivotState = localStorage.getItem("pivotStateValue");
    if (storedPivotState) {
      try {
        const parsedState = JSON.parse(storedPivotState);
        setPivotState(parsedState);
      } catch (error) {
        console.error("Error parsing pivot state from localStorage", error);
      }
    }
  }, []);

  const handleChange = (s) => {
    const newPivotState = {
      rendererName: s?.rendererName,
      aggregatorName: s?.aggregatorName,
      rows: s?.rows,
      cols: s?.cols,
      vals: s?.vals,
      data: s?.data,
      rowOrder: s?.rowOrder,
      colOrder: s?.colOrder,
    };

    localStorage.setItem("pivotStateValue", JSON.stringify(newPivotState));
    setPivotState(newPivotState);
  };

  // Debugging: Check the renderers object
  console.log("TableRenderers:", TableRenderers);
  console.log("PlotlyRenderers:", PlotlyRenderers);

  const handleClick = () => {
    localStorage.removeItem("pivotStateValue");
    window.location.reload();
  };

  return (
    <Box
      sx={{
        padding: "30px",
        margin: "0 30px",
        boxSizing: "border-box",
      }}
    >
      <button onClick={handleClick}>Reset</button>
      <PivotTableUI
        data={data}
        onChange={handleChange}
        renderers={{ ...TableRenderers, ...PlotlyRenderers }}
        {...pivotState}
      />
    </Box>
  );
};

export default PivotTable;
