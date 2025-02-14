"use client";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const SimpleChart = ({height=200}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [sortedData, setSortedData] = useState([]);

  // Original data
  const rawRedData = [12, 19, 3, 5, 2, 0];
  const rawGreenData = [2, 3, 20, 5, 1, 10];
  const rawYellowData = [7, 11, 5, 8, 3, 13];

  // Normalize data to sum to 100
  const normalizeData = (red, green, yellow) => {
    return Array.from({ length: red.length }, (_, i) => {
      const total = red[i] + green[i] + yellow[i];
      return {
        red: Math.round((red[i] / total) * 100),
        green: Math.round((green[i] / total) * 100),
        yellow: Math.round((yellow[i] / total) * 100)
      };
    });
  };

  const normalizedData = normalizeData(rawRedData, rawGreenData, rawYellowData);
  
  const redData = normalizedData.map(d => d.red);
  const greenData = normalizedData.map(d => d.green);
  const yellowData = normalizedData.map(d => d.yellow);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Approve",
              data: greenData,
              borderColor: "#31CAA8",
              pointBackgroundColor: "white",
            },
            {
              label: "Disapprove",
              data: redData,
              borderColor: "#FF4D39",
              pointBackgroundColor: "white",
            },
            {
              label: "Neutral",
              data: yellowData,
              borderColor: "#FACA15",
              pointBackgroundColor: "white",
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              displayColors: false,
              mode: "index",
              enabled: true,
              callbacks: {
                label: (tooltipItem) =>
                  `${tooltipItem.dataset.label}: ${tooltipItem.raw}%`,
              },
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
              min: 0,
              max: 100,
            },
          },
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.5,
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const latestValues = [
      { value: redData[redData.length - 1], color: "#FF4D39" },
      { value: greenData[greenData.length - 1], color: "#31CAA8" },
      { value: yellowData[yellowData.length - 1], color: "#FACA15" },
    ];

    latestValues.sort((a, b) => b.value - a.value);
    setSortedData(latestValues);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto flex items-center gap-5">
      <div className="relative  " style={{ width: `85%`}}>
        <canvas ref={chartRef}></canvas>
      </div>
      <div>
        {sortedData.map((item, index) => (
          <p
            key={index}
            style={{ color: item.color }}
            className="font-bold my-2"
          >
            {item.value}%
          </p>
        ))}
      </div>
    </div>
  );
};

export default SimpleChart;