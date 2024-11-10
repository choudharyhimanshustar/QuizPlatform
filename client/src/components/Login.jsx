import { useNavigate } from "react-router-dom"
import './Login.css'
import axios from 'axios'
import { useState } from "react";
export default function Login() {
    const navigate = useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
   
    const handleClick=async()=> {
        console.log("This function Called");
        try
        {
            const response=await 
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`,{
                email:email,
                password:password
            })
            const data=response.data;
            
            if(data.error)
            {
                alert(data.error);
            }
            else
            {
                localStorage.setItem('token',data.token);
                localStorage.setItem('id',data.id);
                console.log("User Login Successfully")
                navigate('/');
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
    function handleSignUP() {
        navigate('/SignUp')
    }
    return (
        <div className="Login">
            <form className="LoginForm">
            <label>Email</label>
                <input
                    type="email"
                    required="true"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Enter Email" />
                <label>Password</label>
                <input
                    type="text"
                    required="true"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Enter Password" />
            </form>
            <div className="buttonCSS">
                <button onClick={() => handleClick()}>Login</button>
                <button onClick={() => handleSignUP()}>SignUp</button>
            </div>

        </div>


    )
}