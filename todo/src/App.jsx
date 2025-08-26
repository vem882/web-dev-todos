import { useState } from 'react'  
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [task, setTask] = useState('') 
  const [tasks, setTasks] = useState([])
  const addTask = () => {
    setTasks([...tasks, task])
    setTask('')
  }
  const deleteTask = (deleted) => {
    const withoutDeleted = tasks.filter(item => item !== deleted)
    setTasks(withoutDeleted)
  }


  return (
    <>
      <div id="container">
      
      <h3>Todos</h3>
      <form>
        <input
          placeholder='Add new task'
          value={task}
          onChange={e => setTask(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTask()
            }
          }}
        />
        <button
          type='button'
          onClick={() => {
            setTasks([...tasks, task])
            setTask('')
          }}
        >
          Add Task
        </button>
      </form>
      <ul>
        {
          tasks.map(item => (
            <li>{item}
            <button className='delete-button' 
            onClick={() => deleteTask(item)}>
              Delete
            </button>

            </li>
          ))
        }
      </ul>
      </div>
    </>
  )
}

export default App
