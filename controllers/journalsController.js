const natural = require('natural');
const Journal = require('../models/journals');

const TfIdf = natural.TfIdf;

const searchJournals = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({
            msg: 'Query is required as ?q=',
            data: null
        });
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
        
        // Batasi hasil menjadi 10 artikel teratas
        const limitedResults = filtered.slice(0, 10);

        res.json({
            msg: "success retrieved articles",
            data: limitedResults,
            totalResults: filtered.length // Tambahkan info total hasil untuk konteks
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