import express from "express"
import { Request, Response } from "express"
import fetch from "node-fetch"
import * as dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.post("/api/weather", (req: Request, res: Response) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${req.body.lat}&lon=${req.body.long}&units=imperial&appid=${process.env.VITE_API_KEY}`)
        .then(async (response) => {
            const data = await response.json()
            res.json(data)
        })
        .catch(err => {
            res.json(err)
        })
})

app.post("/api/forecast", (req: Request, res: Response) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${req.body.lat}&lon=${req.body.long}&units=imperial&appid=${process.env.VITE_API_KEY}`)
        .then(async (response) => {
            const data = await response.json()
            res.json(data)
        })
        .catch(err => {
            res.json(err)
        })
})

app.post("/api/search", (req: Request, res: Response) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${req.body.word}&limit=5&appid=${process.env.VITE_API_KEY}`)
        .then(async (response) => {
            const data = await response.json()
            res.json(data)
        })
        .catch(err => {
            res.json(err)
        })
})

app.listen(process.env.VITE_PORT, () => console.log(`Server on port ${process.env.VITE_PORT || 3001}`))

export default app
