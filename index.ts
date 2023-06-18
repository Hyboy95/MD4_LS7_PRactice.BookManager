import express from "express";
import bodyParser from "body-parser";

import { DataBase } from "./src/models/data-source";
import { bookRoutes } from "./src/router/book.router";

const PORT = 3000;
const app = express();

app.set("view engine", "ejs");
app.set('views', './src/views');
app.use(express.static('./src//public'))

DataBase
    .connect()
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));

app.use(bodyParser.json());

app.use(bookRoutes);

app.listen(PORT, () => {
    console.log("App running on port: " + PORT)
})
