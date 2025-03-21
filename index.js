const express = require('express');
const morgan = require('morgan');

const app = express();



// will need this to handle json
app.use(express.static('dist'))
app.use(express.json());

morgan.token('req_body', function (req, res) {
    return req.body ? JSON.stringify(req.body) : null;
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req_body'));

const PORT = process.env.PORT || 3001;

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

// app.get('/', (req, res) => {
//     res.send('<h1>Hello, world!</h1>')
// })

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id === id);
    if (person) {
        res.json(person);
    }
    else {
        res.sendStatus(404).end();
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(p => p.id !== id);

    res.sendStatus(204).end();
})

app.get('/info', (req, res) => {
    const text = `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date(Date.now()).toString()}</p>`;
    res.send(text);
})

const generateId = () => {
    return Math.round(Math.random() * 1000).toString();
}

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    }
    else if (persons.find(p => p.name === body.name)) {
        return res.status(409).json({
            error: 'name is already in phonebook'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person);

    res.json(person);
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});