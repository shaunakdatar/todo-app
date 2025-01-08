import React from 'react';
import axios from 'axios';
function TodoForm({todoList,setTodo}) {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const task = document.getElementById('task').value;
        const todo = {
            'task': task,
            'status':0
        }
        const response = await axios.post('http://localhost:4000/api/todo', todo);
        setTodo([...todoList, response.data]);
    }

    return (
        <div>
            <form>
                <input 
                    type="text"
                    placeholder = "Todo task"
                    id = "task"
                />
                <button 
                    type="submit"
                    onClick = {handleSubmit}
                >Submit</button>
            </form>
        </div>
    )

    
}

export default TodoForm;