const express = require('express');
const connect = require('./connection/db');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
require('dotenv').config();
const signUp = require('./SignUp')
const Login = require('./Login');
const Authenticate = require('./Authenticate')
const app = express();

connect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions));

app.use('', Authenticate);
app.use('/signUp', signUp);
app.use('/login', Login);

const PORT = process.env.PORT || 2000;
const HOST = '0.0.0.0'; // or specify a different host if necessary
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

let quizState = {
    participants: {},
    questions: [
        {
            text: "What is the output of the following code snippet?\n\n`console.log(typeof null);`",
            options: ["A) 'null'", "B) 'object'", "C) 'undefined'", "D) 'number'"],
            correctAnswer: "B) 'object'"
        },
        {
            text: "Which of the following is a JavaScript framework?",
            options: ["A) Flask", "B) Spring", "C) Angular", "D) Laravel"],
            correctAnswer: "C) Angular"
        },
        {
            text: "In Python, what does the `len()` function do?",
            options: ["A) Returns the length of a list", "B) Returns the size of a file", "C) Returns the data type of a variable", "D) Returns the memory address of an object"],
            correctAnswer: "A) Returns the length of a list"
        },
        {
            text: "What is the time complexity of binary search on a sorted array?",
            options: ["A) O(n)", "B) O(log n)", "C) O(n^2)", "D) O(n log n)"],
            correctAnswer: "B) O(log n)"
        },
        {
            text: "Which of these is NOT a valid way to declare a variable in JavaScript?",
            options: ["A) var x = 10;", "B) let x = 10;", "C) const x = 10;", "D) int x = 10;"],
            correctAnswer: "D) int x = 10;"
        },
        {
            text: "In HTML, which tag is used to define an unordered list?",
            options: ["A) <ul>", "B) <ol>", "C) <li>", "D) <list>"],
            correctAnswer: "A) <ul>"
        },
        {
            text: "What is the purpose of a constructor in object-oriented programming?",
            options: [
                "A) To initialize an object",
                "B) To delete an object",
                "C) To call other methods",
                "D) To handle errors"
            ],
            correctAnswer: "A) To initialize an object"
        },
        {
            text: "Which HTTP status code represents a 'Not Found' error?",
            options: ["A) 200", "B) 301", "C) 404", "D) 500"],
            correctAnswer: "C) 404"
        }
    ]
};

io.on("connection", (socket) => {


    // Host starts the quiz
    socket.on("start_quiz", ({ participantId, username }) => {
        quizState.participants[participantId] = { username, score: 0, questionIndex: 0 };
        const question = quizState.questions[quizState.participants[participantId].questionIndex];
        socket.emit("quiz_started", question);
        updateAndEmitLeaderboard();
    });
    socket.on("submit_answer", ({ participantId, answer }) => {
        const participant = quizState.participants[participantId];
        const question = quizState.questions[participant.questionIndex];
        console.log(answer);
        if (answer === question.correctAnswer) {
            console.log(quizState.participants[participantId].score);
            participant.score += 1;
        }

        io.to(participantId).emit("update_score", participant.score);
        participant.questionIndex += 1;
        if (participant.questionIndex < quizState.questions.length) {
            const nextQuestion = quizState.questions[participant.questionIndex];
            // Send the next question only to this participant
            io.to(participantId).emit("quiz_started", nextQuestion);
        } else {
            // If no more questions, send quiz end only to this participant
            io.to(participantId).emit("quiz_ended", { score: participant.score });
        }
        updateAndEmitLeaderboard();
    });
    const updateAndEmitLeaderboard = () => {
        // Create a sorted leaderboard array based on participants' scores
        const leaderboard = Object.values(quizState.participants)
            .sort((a, b) => b.score - a.score)
            .map(participant => ({ username: participant.username, score: participant.score }));

        // Emit the updated leaderboard to all connected clients
        io.emit("leaderboard_update", leaderboard);
    };
})


server.listen(PORT, HOST, () => {
    console.log(`Server connected on ${HOST}:${PORT}`);
});