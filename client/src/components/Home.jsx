import './Home.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { io } from "socket.io-client";
import { useEffect } from 'react';
export default function Home() {
    const socket = io("http://localhost:2000");
    const navigate = useNavigate();
    function isExpired(token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return (payload.exp * 1000) < Date.now();
    }
    const takeQuiz = async (req, res) => {
        const token = await localStorage.getItem('token');
        console.log(token);
        console.log(process.env.REACT_APP_BACKEND_URL)
        if (token === null || isExpired(token)) {
            navigate('/login');
        }
        try {
            const response = await
                axios.get(`${process.env.REACT_APP_BACKEND_URL}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },

                    withCredentials: true,  // Ensures cookies/auth headers are sent with the request
                });
            
            navigate('/Quiz')
        } catch (error) {
            if (error) {
                console.log(error);
                navigate('/login');
            }
        }
    }

  

    return (
        <div className='Home'>
            <img src="https://i.pinimg.com/originals/44/92/70/449270eb456ea874288017b9a5c76d8d.gif" className="BannerIMG" />
            <button className='Quiz' onClick={takeQuiz}>Take Quiz</button>
        </div>
    )
}