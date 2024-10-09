import React from 'react';

const StatisticsBox = ({ statistics }) => {
  return (
    <div className="statistics-box">
      <h2>Statistics for {statistics.month}</h2>
      <p>Total Sale Amount: ${statistics.totalAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default StatisticsBox;
