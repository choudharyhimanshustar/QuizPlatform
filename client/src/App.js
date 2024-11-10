import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp';
import Quiz from './components/Quiz'
import QuizEnded from './components/QuizEnded';
function App() {
  return (
   <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signUp" element={<SignUp/>}/>
      <Route path="/Quiz" element={<Quiz/>}/>
      <Route path='/QuizEnded/:score' element={<QuizEnded/>}/>
    </Routes>
   </Router>
  );
}

export default App;
