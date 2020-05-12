import React, { Component } from 'react';
import axios from 'axios';
import './Todo.css';

class Todo extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: this.props.group,
            tasks: []
        }
    }
    componentDidMount(){
        axios.get(`/projects/${this.state.id}`)
        .then(res => {
            this.setState({
                tasks: res.data["Todo"]
            })
            return res;
        })
    }
    render() {
        return (
            /*
            let title = this.state.tasks.map((i) => )
            */
           /*
            <div
            className="task"
            style={{ textDecoration: task.completed ? "line-through" : "" }}
            >
                
            {task.title}

            <button style={{ background: "red" }} onClick={() => removeTask(index)}>x</button>
            <button onClick={() => completeTask(index)}>Complete</button>                
            </div>
            */
           <div>

           </div>
        );
    }
}

export default Todo;

/*


function CreateTask({ addTask }) {
    const [value, setValue] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        axios.post(`/projects/${props.group}`).then(response =>
        {
            //    console.log("TODOOOOOOOOOOO")
            //    console.log(response.data["Todo"][0]);
            //    return response.data["Todo"];
            return response;
        })
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
    const taskValues =  () => {
        axios.get(`/projects/${props.group}`).then(response =>
        {
            console.log("TODOOOOOOOOOOO")
            console.log(response.data["Todo"][0]);
            return response.data["Todo"];
        })
    }
    console.log(taskValues);
    const [tasks, setTasks] = useState(

        [
        {
            title: "Grab some Pizza",
            completed: true
        },
        {
            title: "Do your workout",
            completed: true
        },
        {
            title: "Hangout with friends",
            completed: false
        }
    
    ]);
    console.log(tasks)
    useEffect(() => { setTasksRemaining(tasks.filter(task => !task.completed).length) });


    const addTask = title => {
        const newTasks = [...tasks, { title, completed: false }];
        setTasks(newTasks);
    };

    const completeTask = index => {
        const newTasks = [...tasks];
        newTasks[index].completed = true;
        setTasks(newTasks);
    };

    const removeTask = index => {
        const newTasks = [...tasks];
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
*/