import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {
  state = {
    tasks: [
      { id: 0, name: 'Shopping' },
      { id: 1, name: 'Go out with a dog' }
    ],
    taskName: ''
  };

  componentDidMount() {
    this.socket = io('http://localhost:8000/');
  };

  removeTask(id) {
    const { tasks } = this.state;
    const index = tasks.indexOf(tasks.find(task => task.id === id));
    tasks.splice(index, 1);
    this.socket.emit('removeTask', id);
  };

  submitForm(event) {
    event.preventDefault();
    console.log('event.target[0].value:', event.target[0].value);
    console.log(this.state);
    this.addTask(this.state.taskName);
    // this.socket.emit('addTask', taskName);
  };

  addTask(task) {
    console.log('addTask:', task);
    this.setState(this.state.tasks.push(task));
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
              <li key={task.id} className="task">{task.name}<button className="btn btn--red" onClick={() => this.removeTask(task.id)}>Remove</button></li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={this.submitForm}>
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={(event) => this.setState({ taskName: event.target.value })} />
            {console.log('taskName:', this.state.taskName)}
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;