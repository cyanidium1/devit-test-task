import { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [concurrency, setConcurrency] = useState(1);
    const [isDisabled, setIsDisabled] = useState(false);
    const [results, setResults] = useState([]);

    const startRequests = () => {
        setIsDisabled(true);
        const concurrencyLimit = parseInt(concurrency, 10);
        const requestsPerSecond = concurrencyLimit;
        let index = 1;
        const activeRequests = new Set();

        console.log(`начинаем запросы с лимитом: ${concurrencyLimit}, запросов в сек: ${requestsPerSecond}`);

        const sendRequest = () => {
            if (index > 1000) return;

            const requestIndex = index;
            index++;

            activeRequests.add(requestIndex);

            console.log(`отправляемс #${requestIndex}`);

            axios.get(`/api?index=${requestIndex}`)
                .then(response => {
                    console.log(`ответ на запрос #${response.data.index}`);
                    setResults(prevResults => [...prevResults, `ответ на запрос ${response.data.index}`]);
                })
                .catch(error => {
                    console.error(`ошибка #${requestIndex}: ${error.response ? error.response.status : error.message}`);
                    setResults(prevResults => [...prevResults, `ошиба с запросом ${requestIndex}: ${error.response ? error.response.status : error.message}`]);
                })
                .finally(() => {
                    activeRequests.delete(requestIndex);
                    console.log(`запрос #${requestIndex} выполнен, активные запоосы: ${activeRequests.size}`);
                    if (index <= 1000) {
                        setTimeout(sendRequest, 1000 / requestsPerSecond);
                    }
                });
        };

        const manageRequests = () => {
            while (activeRequests.size < concurrencyLimit && index <= 1000) {
                sendRequest();
            }
            if (index <= 1000) {
                setTimeout(manageRequests, 1000 / requestsPerSecond);
            }
        };

        manageRequests();
    };

    return (
        <div>
            <input
                type="number"
                min="0"
                max="100"
                value={concurrency}
                onChange={e => setConcurrency(e.target.value)}
                required
            />
            <button onClick={startRequests} disabled={isDisabled}>Start</button>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>{result}</li>
                ))}
            </ul>
        </div>
    );
}
