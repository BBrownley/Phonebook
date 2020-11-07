const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use(
  morgan((tokens, req, res) => {
    console.log(JSON.stringify(req.body));
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body)
    ].join(" ");
  })
);

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(`
  
    Phonebook has info for ${persons.length} people

    ${new Date()}

  `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(id);

  const person = persons.find(person => person.id === id);
  console.log(person);

  if (person) {
    res.json(person);
  } else {
    res.status(400).json({
      error: "content missing"
    });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

function generateID() {
  return Math.floor(Math.random() * Math.floor(999999999));
}

app.post("/api/persons", (req, res) => {
  const body = req.body;
  console.log(body);

  const nameAlreadyExists = persons.find(
    person => person.name === req.body.name
  );

  if (!req.body.name || !req.body.number) {
    res.status(400).json({
      error: "Name or number is missing"
    });
  } else if (nameAlreadyExists) {
    res.status(400).json({
      error: "Name already exists in phonebook"
    });
  } else {
    const person = {
      id: generateID(), //randomly generated id
      name: body.name,
      number: body.number
    };
    console.log(person);

    persons = persons.concat(person);

    res.json(person);
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
