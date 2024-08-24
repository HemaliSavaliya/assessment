// PivotTable.js
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import createPlotlyComponent from "react-plotly.js/factory";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import Plotly from "react-plotlyjs"; // Use the minified Plotly version

// Create Plotly React component via dependency injection
const Plot = createPlotlyComponent(Plotly);

// Create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

const PIVOT_STATE_KEYS = [
  "rendererName",
  "aggregatorName",
  "rows",
  "cols",
  "vals",
  "rowOrder",
  "colOrder",
];

const PivotTable = ({ data }) => {
  const [pivotState, setPivotState] = useState({});

  useEffect(() => {
    // Load pivot state from localStorage on component mount
    const loadPivotState = () => {
      let storedPivotState = {};
      PIVOT_STATE_KEYS.forEach((key) => {
        const storedValue = localStorage.getItem(`pivotStateValue_${key}`);
        if (storedValue) {
          storedPivotState[key] = JSON.parse(storedValue);
        }
      });
      setPivotState(storedPivotState);
    };

    loadPivotState();
  }, []);

  const handleChange = (s) => {
    // Split state into individual keys and save each in localStorage
    PIVOT_STATE_KEYS.forEach((key) => {
      localStorage.setItem(`pivotStateValue_${key}`, JSON.stringify(s[key]));
    });
    setPivotState(s);
  };

  const handleReset = () => {
    // Remove all keys related to pivot state from localStorage
    PIVOT_STATE_KEYS.forEach((key) => {
      localStorage.removeItem(`pivotStateValue_${key}`);
    });
    setPivotState({});
  };

  return (
    <Box sx={{ padding: "30px", margin: "0 30px", boxSizing: "border-box" }}>
      <button onClick={handleReset}>Reset</button>
      <PivotTableUI
        data={data}
        onChange={handleChange}
        renderers={{ ...TableRenderers, ...PlotlyRenderers }} // Combine Table and Plotly renderers
        {...pivotState}
      />
    </Box>
  );
};

export default PivotTable;
