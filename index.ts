import express from "express"
import { Request, Response } from "express"
import fetch from "node-fetch"
import * as dotenv from "dotenv"
import cors from "cors"
import { FilteredData, ForecastData, ForecastDataSingle } from "./interfaces"

dotenv.config()

const app = express()


function findMinAndMax(entireResult: any, dayList: any) {
    const combinedArrays: any = [];

    for (let i = 0; i < dayList.length; i++) {
        const item = entireResult[dayList[i]];
        combinedArrays.push(item)
    }

    const mergedArray: any[] = [];

    combinedArrays.forEach((array: any) => {
        let mergedFields: any;

        ['date', 'main', 'weather'].forEach((field) => {
            if (field === 'main') {
                const temperatures = array.reduce(
                    (merged: any, obj: any) => {
                        merged.min.push(obj[field].min);
                        merged.max.push(obj[field].max);
                        return merged;
                    },
                    { min: [], max: [] }
                );
                const maxDate = array.reduce((max: any, obj: any) => (obj.date > max ? obj.date : max), '');
                const biggestMaxTemp = Math.max(...temperatures.max);
                const lowestMinTemp = Math.min(...temperatures.min);
                const weatherArray = array.map((obj: any) => { return { main: obj['weather'][0].main, description: obj['weather'][0].description } });
                const otherFields = array.map((obj: any) => {
                    return {
                        feels: obj['main'].feels,
                        current: obj['main'].current,
                        wind: obj['main'].wind,
                        pressure: obj['main'].pressure,
                        humidity: obj['main'].humidity
                    }
                });
                const fields = otherFields[0]
                const weather = weatherArray[0]

                mergedFields = {
                    maxDate,
                    biggestMaxTemp,
                    lowestMinTemp,
                    weather,
                    fields
                };
            }
        });

        mergedArray.push(mergedFields);
    });

    return mergedArray;
}

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World")
})

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

app.post("/api/forecast", async (req: Request, res: Response) => {
    const response: any = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${req.body.lat}&lon=${req.body.long}&units=imperial&appid=${process.env.VITE_API_KEY}`)
    if (response.status !== 200) return res.json({ err: response })
    const data: ForecastData = await response.json()
    const filteredData = data.list.map((x: ForecastDataSingle) => {
        return {
            date: x.dt_txt,
            main: {
                min: x.main.temp_min,
                max: x.main.temp_max,
                feels: x.main.feels_like,
                current: x.main.temp,
                wind: x.wind.speed,
                pressure: x.main.pressure,
                humidity: x.main.humidity
            },
            weather: x.weather
        }
    })
    const result: any = {}
    const listOfDays: any = []
    filteredData.forEach((singleData) => {
        if (!result[singleData.date.slice(8, 10)]) {
            result[singleData.date.slice(8, 10)] = [];
        }
        result[singleData.date.slice(8, 10)].push(singleData);
        if (!listOfDays.includes(singleData.date.slice(8, 10))) {
            listOfDays.push(singleData.date.slice(8, 10))
        }

    })
    const sendData = findMinAndMax(result, listOfDays)
    res.json(sendData)
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
