const express = require('express');
const app = express();
const port = 3000;

let requestCount = 0;
let lastRequestTime = Date.now();

app.get('/api', (req, res) => {
    const currentTime = Date.now();
    if (currentTime - lastRequestTime >= 1000) {
        lastRequestTime = currentTime;
        requestCount = 0;
    }

    requestCount += 1;

    if (requestCount > 50) {
        console.log('ту мач');
        return res.status(429).send('ту мач');
    }

    const delay = Math.floor(Math.random() * 1000) + 1;
    setTimeout(() => {
        console.log(`отвечаемс на ${req.query.index} после ${delay}мс`);
        res.send({ index: req.query.index });
    }, delay);
});

app.listen(port, () => {
    console.log(`серв на http://localhost:${port}`);
});
