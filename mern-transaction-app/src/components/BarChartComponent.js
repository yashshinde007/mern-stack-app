import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChartComponent = ({ data }) => {
  const chartData = {
    labels: ['0-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901-above'],
    datasets: [
      {
        label: 'Items Sold',
        data: data.map(d => d.count),
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  };

  return (
    <div className="chart">
      <Bar data={chartData} />
    </div>
  );
};

export default BarChartComponent;
