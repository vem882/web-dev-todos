import express from 'express'
import cors from 'cors'
import pkg from 'pg'

const port = 3001
const { Pool } = pkg

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
const openDb = () => {
const pool = new Pool({
user: 'postgres',
host: 'localhost',
database: 'todo',
password: 'Enter_your_password',
port: 5432
})
return pool
}
app.get('/', (req, res) => {
const pool = openDb()
pool.query('SELECT * FROM task', (err, result) => {
if (err) {
return res.status(500).json({error: err.message})
}
res.status(200).json(result.rows)
})
})

app.post('/create', (req, res) => {
    const pool = openDb()
    const { task } = req.body

    if (!task) {
        return res.status(400).json({ error: 'Task is required' })
    }

    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *', [task.description],
         (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.status(201).json({id:result.rows[0], description: task.description})
    })
})

app.delete('/delete/:id', (req, res) => {
    const pool = openDb()
    const { id } = req.params

    console.log(`Deleting task with ID: ${id}`)
    pool.query('DELETE FROM task WHERE id = $1',
         [id], (err, result) => {
        if (err) {
            console.error(err.message)
            return res.status(500).json({ error: err.message })
        }
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' })
        }
        res.status(200).json({id:id})
    })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
