import { useEffect, useState } from 'react'  
import { useUser } from '../context/useUser'
import '../App.css'
import axios from 'axios'
import Row from '../components/Row'

const url = "http://localhost:3001"

function App() {
  const [task, setTask] = useState('') 
  const [tasks, setTasks] = useState([])
  const { user, logout } = useUser()

  useEffect(() => {
    axios.get(url)
      .then(response => {
        setTasks(response.data)
      })
      .catch(error => {
        alert(error.response.data ? error.response.data.message : error)
      })
  }, [])

const addTask = () => {
  const headers = {headers: {Authorization: user.token}}
  const newTask = { description: task }

  axios.post(url + "/create", {task: newTask},headers)
    .then(response => {
      setTasks([...tasks,response.data])
      setTask('')
  })
  .catch(error => {
    alert(error.response ? error.response.data.error.message : error)
  })
}
const deleteTask = (deleted) => {
  const headers = {headers: {Authorization: user.token}}
  console.log(headers)
  axios.delete(url + "/delete/" + deleted,headers)
    .then(response => {
      setTasks(tasks.filter(item => item.id !== deleted))
    })
    .catch(error => {
      alert(error.response ? error.response.data.error.message : error)
    })
}


  return (
    <>
      <div id="container">
      
      <div className="app-header">
        <div className="header-content">
          <h2 className="app-title">Todos</h2>
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      
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
          onClick={addTask}
        >
          Add Task
        </button>
      </form>
      
      <div className="task-list">
        {
          tasks.map(item => (
            <Row key={item.id} item={item} deleteTask={deleteTask} />
          ))
        }
      </div>
      </div>
    </>
  )
}

export default App
