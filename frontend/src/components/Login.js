import {useState} from 'react';
import axios from 'axios';
import { useNavigate, Link} from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({password:"",email:""});
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/login", formData);
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                alert('Login successful!');
                navigate('/todo');
            } else {
                alert('Login successful, but no token received.');
            }
            
          } catch (error) {
            console.error(error);
            alert("Login failed!");
          }
    }

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    }
    
    return (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
          <button type="submit">Login</button>
          <Link to="/register">Register</Link>
        </form>
    );
}

export default Login;