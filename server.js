const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/transactions', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB Connected');
}).catch(err => {
    console.error(err);
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const Transaction = require('./models/Transaction');

app.get('/api/init', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        // Insert data into the database
        await Transaction.insertMany(transactions);
        res.status(200).send('Database initialized with seed data');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error initializing database');
    }
});


app.get('/api/transactions', async (req, res) => {
    const { search = '', page = 1, perPage = 10, month } = req.query;

    const searchRegex = new RegExp(search, 'i');  // Case-insensitive regex for search
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: startDate, $lt: endDate },
            $or: [
                { title: searchRegex },
                { description: searchRegex },
                { price: searchRegex }
            ]
        })
        .skip((page - 1) * perPage)
        .limit(parseInt(perPage));

        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching transactions' });
    }
});


app.get('/api/statistics', async (req, res) => {
    const { month } = req.query;

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    try {
        const totalSales = await Transaction.aggregate([
            {
                $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$price' },
                    totalSoldItems: { $sum: 1 }
                }
            }
        ]);

        const totalNotSold = await Transaction.countDocuments({
            dateOfSale: { $gte: startDate, $lt: endDate },
            sold: false
        });

        res.json({
            totalAmount: totalSales[0]?.totalAmount || 0,
            totalSoldItems: totalSales[0]?.totalSoldItems || 0,
            totalNotSoldItems: totalNotSold
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching statistics' });
    }
});


app.get('/api/bar-chart', async (req, res) => {
    const { month } = req.query;

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    try {
        const priceRanges = await Transaction.aggregate([
            {
                $match: { dateOfSale: { $gte: startDate, $lt: endDate } }
            },
            {
                $bucket: {
                    groupBy: '$price',
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
                    default: '901-above',
                    output: { count: { $sum: 1 } }
                }
            }
        ]);

        res.json(priceRanges);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching bar chart data' });
    }
});



app.get('/api/pie-chart', async (req, res) => {
    const { month } = req.query;

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    try {
        const categories = await Transaction.aggregate([
            {
                $match: { dateOfSale: { $gte: startDate, $lt: endDate } }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching pie chart data' });
    }
});



app.get('/api/combined', async (req, res) => {
    const { month } = req.query;

    try {
        const [transactions, statistics, barChart, pieChart] = await Promise.all([
            Transaction.find({ dateOfSale: { $gte: new Date(`${month}-01`), $lt: new Date(`${month}-31`) } }),
            // Call the statistics, bar chart, and pie chart APIs
        ]);

        res.json({
            transactions,
            statistics,
            barChart,
            pieChart
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching combined data' });
    }
});

