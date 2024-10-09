import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChartComponent = ({ data }) => {
  const chartData = {
    labels: data.map(d => d._id),
    datasets: [
      {
        data: data.map(d => d.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  return (
    <div className="chart">
      <Pie data={chartData} />
    </div>
  );
};

export default PieChartComponent;
