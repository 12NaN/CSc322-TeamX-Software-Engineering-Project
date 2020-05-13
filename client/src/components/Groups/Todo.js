import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Todo.css';


function Task({ task, index, completeTask, removeTask }) {
    console.log(task)
    console.log(index)
    return (
        <div
            className="task"
            style={{ textDecoration: task.status ? "line-through" : "" }}
        >
            {task.text}
            

            <button style={{ background: "red" }} onClick={() => removeTask(index)}>x</button>
            <button onClick={() => completeTask(index)}>Complete</button>

        </div>
    );
}

function CreateTask({ addTask }) {
    const [value, setValue] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;

        addTask(value);
        setValue("");
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                className="input"
                value={value}
                placeholder="Add a new task"
                onChange={e => setValue(e.target.value)}
            />
        </form>
    );
}

function Todo(props) {
    const [tasksRemaining, setTasksRemaining] = useState(0);
    /*
    let arr = [];
    let j = props.tasks.map((i) => {
        arr.push(i)
    })
    */
    let arr = []
    const [tasks, setTasks] = useState(arr);

    useEffect(() => { setTasksRemaining(tasks.filter(task => !task.status).length) });


    const addTask = text => {
        const newTasks = [...tasks, { text, status: 0 }];
        console.log(text);
        axios.post(`/projects/${props.group}/add-todo`,
        {
            text: text,
            user_id: props.user,
            group_id: props.group,
            status: 0
        }
        ).then((r) =>{
            console.log(r);
        })
        setTasks(newTasks);
    };

    const completeTask = index => {
        const newTasks = [...tasks];
        newTasks[index].status = 1;
        axios.post(`/projects/${props.group}/update-todo/${newTasks[index]["id"]}`, {
            id: newTasks[index]["id"],
            text: newTasks[index]["text"],
            user_id: newTasks[index]["user_id"],
            status: newTasks[index]["status"],
            group_id: newTasks[index]["group_id"]
        }).then((r) =>{
            console.log(r)
        })
        setTasks(newTasks);
    };

    const removeTask = index => {
        const newTasks = [...tasks];

        axios.post(`/projects/${props.group}/remove-todo/${newTasks[index]["id"]}`, {
            id: newTasks[index]["id"]
        }).then(r =>
            console.log(r)
        )
        newTasks.splice(index, 1);
        setTasks(newTasks);
    };

    return (
        <div className="todo-container">
            <div className="header">Pending tasks ({tasksRemaining})</div>
            <div className="tasks">
                {tasks.map((task, index) => (
                    <Task
                    task={task}
                    index={index}
                    completeTask={completeTask}
                    removeTask={removeTask}
                    key={index}
                    />

                ))}
            </div>
            <div className="create-task" >
                <CreateTask addTask={addTask} />
            </div>
        </div>
    );
}

export default Todo;