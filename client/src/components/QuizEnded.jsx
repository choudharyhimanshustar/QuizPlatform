import { useParams } from 'react-router-dom';
export default function QuizEnded() {
    const { score } = useParams();

    return (<div>
        <h1>Quiz Ended</h1>
        <h2>Your Score: {score}</h2>
    </div>)
}