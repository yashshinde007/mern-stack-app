import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TransactionsTable from './components/TransactionsTable';
import StatisticsBox from './components/StatisticsBox';
import BarChartComponent from './components/BarChartComponent';
import PieChartComponent from './components/PieChartComponent';

function App() {
    const [month, setMonth] = useState('March');
    const [transactions, setTransactions] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [barChartData, setBarChartData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);

    // Define functions before using them in useEffect
    const fetchTransactions = useCallback(async () => {
        const response = await axios.get(`http://localhost:5001/api/transactions?month=${month}`);
        setTransactions(response.data);
    }, [month]);

    const fetchStatistics = useCallback(async () => {
        const response = await axios.get(`http://localhost:5001/api/statistics?month=${month}`);
        setStatistics(response.data);
    }, [month]);

    const fetchBarChartData = useCallback(async () => {
        const response = await axios.get(`http://localhost:5001/api/bar-chart?month=${month}`);
        setBarChartData(response.data);
    }, [month]);

    const fetchPieChartData = useCallback(async () => {
        const response = await axios.get(`http://localhost:5001/api/pie-chart?month=${month}`);
        setPieChartData(response.data);
    }, [month]);

    useEffect(() => {
        fetchTransactions();
        fetchStatistics();
        fetchBarChartData();
        fetchPieChartData();
    }, [fetchTransactions, fetchStatistics, fetchBarChartData, fetchPieChartData]);

    return (
        <div className="App">
            <h1>Transaction Dashboard</h1>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>
            <TransactionsTable transactions={transactions} />
            <StatisticsBox statistics={statistics} />
            <BarChartComponent data={barChartData} />
            <PieChartComponent data={pieChartData} />
        </div>
    );
}

export default App;
