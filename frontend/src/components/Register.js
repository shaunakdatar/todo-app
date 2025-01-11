import React,{useState} from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({username: "", password:"",email:""});

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/register", formData);
            alert("User registered successfully!");
          } catch (error) {
            console.error(error);
            alert("Registration failed!");
          }
    }

    return (
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>
          <input type="text" name="username" placeholder="Username" onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
          <button type="submit">Register</button>
        </form>
      );
}

export default Register;