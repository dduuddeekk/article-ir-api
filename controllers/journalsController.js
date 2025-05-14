const natural = require('natural');
const Journal = require('../models/journals');

const TfIdf = natural.TfIdf;

const searchJournals = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(403).json({
            msg: 'Query is required as ?q=',
            data: null
        });
    }

    let page = 1;
    let limit = 10;
    
    if (req.query.page) {
        page = parseInt(req.query.page);
        if (isNaN(page) || page < 1) {
            return res.status(403).json({
                msg: 'Page must be a positive integer',
                data: null
            });
        }
    }
    
    if (req.query.limit) {
        limit = parseInt(req.query.limit);
        if (isNaN(limit) || limit < 1) {
            return res.status(403).json({
                msg: 'Limit must be a positive integer',
                data: null
            });
        }
        
        const MAX_LIMIT = 50;
        if (limit > MAX_LIMIT) {
            return res.status(403).json({
                msg: `Limit cannot exceed ${MAX_LIMIT}`,
                data: null
            });
        }
    }

    try {
        const journals = await Journal.findAll();

        const tfidf = new TfIdf();
        journals.forEach(j => tfidf.addDocument(j.abstract));

        let scored = journals.map((j, index) => {
            let score = tfidf.tfidf(query, index);
            return { 
                ...j.dataValues,
                score 
            };
        });

        scored.sort((a, b) => b.score - a.score);
        const filtered = scored.filter(r => r.score > 0);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedResults = filtered.slice(startIndex, endIndex);

        const totalResults = filtered.length;
        const totalPages = Math.ceil(totalResults / limit);

        if (page > totalPages && totalPages > 0) {
            return res.status(400).json({
                msg: `Page ${page} is not available. Total pages: ${totalPages}`,
                data: null
            });
        }

        res.json({
            msg: "success retrieved articles",
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                itemsPerPage: limit,
                totalItems: totalResults,
                hasNextPage: endIndex < totalResults,
                hasPreviousPage: startIndex > 0
            },
            data: paginatedResults
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            msg: 'Internal server error',
            data: null
        });
    }
}

module.exports = {
    searchJournals
};