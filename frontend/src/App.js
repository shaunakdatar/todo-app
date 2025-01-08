import React,{useState, useEffect} from 'react';
import './App.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import axios from 'axios';

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
      <div className="todo-container">
        <section className="todo-section">
          <h2>Add New Task</h2>
          <TodoForm todoList={todo} setTodo={setTodo} />
        </section>
        <section className="todo-section">
          <h2>Pending Tasks</h2>
          <TodoList todoList={todo} markDone={markDone} />
        </section>
        <section className="todo-section">
          <h2>Completed Tasks</h2>
          <TodoList todoList={donetask} />
        </section>
      </div>
    </div>
  );
}

export default App;
