import { Router } from 'express'
import { pool } from '../helper/db.js'

const router = Router()

// Get all todos for DB 
router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM task', (err, result) => {
        if (err) {
            return next(err)
        }
        res.status(200).json(result.rows || [])
    })
})

// Creating a new todo task 
router.post('/create', (req, res, next) => {
    const { task } = req.body

    if (!task) {
        const error = new Error('Task is required')
        error.status = 400
        return next(error)
    }

    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *', [task.description],
         (err, result) => {
        if (err) {
            return next(err)
        }
        res.status(201).json({id: result.rows[0].id, description: task.description})
    })
})

// Delete a todo task by selected ID
router.delete('/delete/:id', (req, res, next) => {
    const { id } = req.params

    console.log(`Deleting task with ID: ${id}`)

    pool.query('DELETE FROM task WHERE id = $1',
         [id], (err, result) => {
        if (err) {
            return next(err)
        }
        if (result.rowCount === 0) {
            const error = new Error('Task not found')
            error.status = 404
            return next(error)
        }
        res.status(200).json({id: id})
    })
})

export default router
