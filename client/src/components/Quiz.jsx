import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import './Quiz.css'
const socket = io("http://localhost:2000");
export default function Quiz() {
    const [question, setQuestion] = useState(null);
    const [scoreboard, setScoreboard] = useState(0);
    const [answer, setAnswer] = useState("");
    const [leaderboard, setLeaderboard] = useState([]);
    const navigate=useNavigate();
    console.log(scoreboard);

    const handleOptionSelect = (selectedOption) => {
        setAnswer(selectedOption);
    };
    const submitAnswer = () => {
        socket.emit("submit_answer", { participantId: socket.id, answer });
        setAnswer("");
    };
    useEffect(() => {
        let chosenUsername = localStorage.getItem("username");
        if (!chosenUsername) {
            chosenUsername = prompt("Enter your name:");
            localStorage.setItem("username", chosenUsername);
        }

        socket.emit("start_quiz", { participantId: socket.id, username: chosenUsername });
        socket.on("quiz_started", (questionData) => {
            console.log("Quiz Started");
            setQuestion(questionData);
        });
        socket.on("update_score", (scores) => setScoreboard(scores));
        socket.on("quiz_ended", ({ score }) => {
            navigate(`/QuizEnded/${score}`);
        });
        socket.on("leaderboard_update", (updatedLeaderboard) => setLeaderboard(updatedLeaderboard));
        return () => {
            socket.off("quiz_started");
            socket.off("update_score");
            socket.off("leaderboard_update");
            socket.off("quiz_ended");
        };
    }, [])
    return (
        <div className="QuizComponent">

            <div>
                {question && (<><h2>{question.text}</h2>
                    <div>
                        {question.options.map((option, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    name="answer"
                                    value={option}
                                    checked={answer === option}
                                    onChange={() => handleOptionSelect(option)}
                                />
                                <label>{option}</label>
                            </div>
                        ))}
                    </div></>)}

                <button onClick={submitAnswer} className="SubmitAnswerBtn">Submit Answer</button>
            </div>





            <h3>Scoreboard</h3>
            <h2>{scoreboard}</h2>
            <h3>Leaderboard</h3>
            <div className="LeaderboardContainer">
                {leaderboard.map((participant, index) => (
                    <div key={index} className="LeaderboardEntry">
                        <span className="Username">{participant.username}</span>
                        <span className="Score">{participant.score}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}