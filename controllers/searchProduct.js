const fileName = "controller-products.js";
const logger = require('../utils/other/logger');
const searchModel = require("../models/productSearch");

module.exports.searchItems = async (req, res) => {
    try {
        logger.info(`${fileName} searchItems() called`);
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'Search query is required'
            });
        }
        let items = await searchModel.searchItems(query);
        return res.status(200).json({
            status: 'success',
            message: 'Items retrieved successfully',
            statusCode: 200,
            data: items.rows
        });
    } catch (error) {
        logger.error(`${fileName} searchItems() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: 'error',
            message: error.message
        });
    }
}
