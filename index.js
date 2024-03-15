
const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const port = 3006;

let tasks = [
    { taskId: 1, cronExpression: '*/2 * * * *', enabled: true },
    { taskId: 2, cronExpression: '0 0 * * *', enabled: false },
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/tasks', async (req, res) => {
    try {
        const response = await fetch('http://localhost:8083/tasks');
        if (response.ok) {
            const tasks = await response.json();
            res.json(tasks);
        } else {
            console.error('Failed to fetch tasks');
            res.sendStatus(500);
        }
    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500);
    }
});

app.post('/tasks/:taskId/cancel', async (req, res) => {
    const taskId = parseInt(req.params.taskId);
    try {
        const response = await fetch(`http://localhost:8083/tasks/${taskId}/cancel`, { method: 'POST' });
        if (response.ok) {
            res.sendStatus(200);
        } else if (response.status === 404) {
            res.sendStatus(404);
        } else {
            throw new Error('Failed to cancel task');
        }
    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500);
    }
});

app.post('/tasks/:taskId/enable', async (req, res) => {
    const taskId = parseInt(req.params.taskId);
    try {
        const response = await fetch(`http://localhost:8083/tasks/${taskId}/enable`, { method: 'POST' });
        if (response.ok) {
            res.sendStatus(200);
        } else if (response.status === 404) {
            res.sendStatus(404);
        } else {
            throw new Error('Failed to enable task');
        }
    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500);
    }
});

app.post('/tasks/:taskId/disable', async (req, res) => {
    const taskId = parseInt(req.params.taskId);
    try {
        const response = await fetch(`http://localhost:8083/tasks/${taskId}/disable`, { method: 'POST' });
        if (response.ok) {
            res.sendStatus(200);
        } else if (response.status === 404) {
            res.sendStatus(404);
        } else {
            throw new Error('Failed to disable task');
        }
    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500);
    }
});

app.put('/tasks/:taskId/reschedule', async (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const { cronExpression } = req.body;

    try {
        console.log(cronExpression);
        const response = await fetch(`http://localhost:8083/tasks/${taskId}/reschedule`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cronExpression : cronExpression }),
        });

        console.log(response.status);
        if (response.ok) {
            console.log('Reschedule operation was successful');
            res.sendStatus(200);
        } else if (response.status === 400) {
            console.error('Invalid cron expression provided');
            res.sendStatus(400);
        } else {
            console.error('Unknown server error');
            res.sendStatus(500);
        }
    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.sendStatus(500);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
