require("dotenv").config();

import * as mongodb from "mongodb";
import { CronJob } from 'cron';
import { main } from "crawler";

async function initDB(db: mongodb.Db): Promise<void> {
    try {
        await db.createCollection("cars");
    } catch (e) {
        console.error(e);
    }
}

async function crawl(db: mongodb.Db) {
    const cars = await main()
    if (!(cars instanceof Error)) {
        for (const car of cars) {
            try {
                db.collection("cars").updateOne(car, { $set: { ...car } }, { upsert: true });
            } catch (e) {
                console.error(e);
            } finally {
            }
        }
    }
}

(async () => {
    try {
        const express = require("express");
        let cors = require("cors");
        const bodyParser = require("body-parser");
        const logger = require("morgan");

        const API_PORT = process.env.SERVER_PORT;
        const app = express();
        app.use(cors());
        const router = express.Router();

        const dbName = "wlagcars"
        // this is our MongoDB database

        let dbRoute = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.DB_HOST}:27017`;
        if (process.env.MONGO_CONN !== undefined) {
            dbRoute = process.env.MONGO_CONN
        }

        console.log(dbRoute)

        // connects our back end code with the database
        const client = await mongodb.connect(dbRoute, { useNewUrlParser: true });
        const db = await client.db(dbName);
        await initDB(db);

        console.debug("Registering cronjob...")
        new CronJob('0 * * * *', function () {
            console.log("Triggering crawler");
            crawl(db);
        }, null, true, undefined, undefined, true);
        console.debug("Job registered.")


        const cars = await db.collection("cars");

        // (optional) only made for logging and
        // bodyParser, parses the request body to be a readable json format
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(logger("dev"));

        // this is our create method
        // this method adds new data in our database
        router.post("/putData", async (req, res) => {
            try {
                cars.insertOne(req.body)
                return res.json({ success: true });
            }
            catch (err) {
                return res.json({ success: false, error: err });
            }
        });

        // this is our get method
        // this method fetches all available data in our database
        router.get("/getData", async (req, res) => {
            try {
                const data = await cars.aggregate([{ $project: { _id: 0 } }]).toArray()
                // return res.json({ success: true, data: { aaData: data } });
                return res.json({ success: true, data });
            } catch (err) {
                return res.json({ success: false, error: err });
            }
        });

        router.get("/crawl", async (req, res) => {
            crawl(db);
            return res.json({ success: true, message: "Crawler started." })
        })

        // append /api for our http requests
        app.use("/api", router);

        // launch our backend into a port
        app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
    } catch (e) {
        console.error(e)
    }
})()
