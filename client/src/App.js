import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: ''
  };

  componentDidMount() {
    this.socket = io.connect('http://localhost:8000/');
    this.socket.on('addTask', newTask => this.addTask(newTask));
    this.socket.on('removeTask', taskId => this.removeTask(taskId));
    this.socket.on('updateData', tasks => this.updateTasks(tasks));
  };

  removeTask(id, local) {
    this.setState({ tasks: this.state.tasks.filter(task => task.id !== id) });
    if (local === true) {
      this.socket.emit('removeTask', id);
    };
  };

  submitForm = (event) => {
    event.preventDefault();
    const task = { id: uuidv4(), name: this.state.taskName };
    this.addTask(task);
    this.socket.emit('addTask', task);
    this.setState({ taskName: '' });
  };

  addTask(task) {
    this.setState({ tasks: [...this.state.tasks, task] });
  };

  updateTasks(tasks) {
    this.setState({ tasks: tasks });
  };

  render() {
    const { tasks, taskName } = this.state;
    // console.log('tasks:', this.state.tasks);

    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className="task">
                {task.name}
                <button
                  className="btn btn--red"
                  onClick={() => this.removeTask(task.id, true)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={this.submitForm}>
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={taskName}
              onChange={(event) => this.setState({ taskName: event.target.value })}
            />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;