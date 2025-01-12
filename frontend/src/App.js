import React,{useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import axios from 'axios';
import Register from './components/Register';
import Login from './components/Login';
import TodoPage from './components/TodoPage';

function App() {
  const [todo,setTodo] = useState([]);
  const [donetask, setDoneTask] = useState([]);
  
  useEffect(() => {
    fetchTodo();
    fetchDoneTask();
  },[]);

  const fetchTodo = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/todo');
      //console.log(response.data);
      setTodo(response.data)
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const fetchDoneTask = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/todo/donetask');
      //console.log(response.data);
      setDoneTask(response.data)
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const markDone = async (task) => {
    const response = await axios.post('http://localhost:4000/api/todo/markdone',task);
    console.log(response);
    if (response.data.id){
      setTodo(todo.filter((todotask) => todotask.id !== task.id));
      setDoneTask([...donetask,task]);
    }
  }
  
  return (
    <div className="App">
      <header className="app-header">
        <h1>Todo Application</h1>
      </header>
      <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path='/todo' element={<TodoPage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
