import React from 'react';
const TodoList = ({todoList,markDone = {}}) => {
  const hasMarkDone = typeof markDone === 'function' || Object.keys(markDone).length > 0;
    return(<ul>
    {todoList.map((task) => (
      <li key={task.id}>
        {task.task}
        {hasMarkDone && ( // Show button only if markDone has a value
            <button onClick={() => markDone(task)}>
              Done
            </button>
          )}
      </li>
    ))}
  </ul>);
}

export default TodoList;