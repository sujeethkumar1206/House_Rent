const app = require('../server/app');
const connectDB = require('../server/config/db');

module.exports = async (req, res) => {
    try {
        await connectDB();
    } catch (err) {
        console.error('Database connection failed:', err);
    }
    return app(req, res);
};