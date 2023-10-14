// index.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: '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',
});

// Define a route for the root path ("/") and send a simple response
app.get('/', (req, res) => {
    res.send('Please input your desired project: ');
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const completion = await openai.Completion.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
        });

        const assistantResponse = completion.choices[0].text;

        res.json({ response: assistantResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const answerContainer = document.getElementById('answer-container');

    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userQuestion = userInput.value;
        const response = await askChatGPT(userQuestion);
        answerContainer.textContent = response;
    });
});

async function askChatGPT(question) {
    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: question }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch response from Chat GPT.');
    }

    const data = await response.json();
    return data.response;
}

