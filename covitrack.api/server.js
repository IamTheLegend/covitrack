import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dotenv = require('dotenv'); //required to use the .env file
dotenv.config(); //required to use the .env file
const port = process.env.PORT
import { allChooseData, allDataCountiesByState, countiesByStateTable, statesTable, customDataCountiesByState, customDataCountiesByFips } from "./helper_calls/helper_calls.js";
import { mapWidget } from './API_Widget/map_view_widget.js';
import { mortality_rate } from './API_Widget/mortality_rate.js';
import { raw_data } from './API_Widget/raw_data.js';
import { hospitalization_data } from './API_Widget/hospitalization_data.js';
import { infectionPopulationWidget } from './API_Widget/infection_population_widget.js'; //NOT USED

var corsOptions = {
    //origin: "http://localhost:4200",
    origin: "*" //testing
};

app.use(cors(corsOptions));
// default way to consume and produce data
app.use(bodyParser.json());

/* 
Allows for filed to be pulled through the API ->> for when using npm build
https://expressjs.com/en/starter/static-files.html
*/
//var distDir = __dirname + "/dist/";
//app.use(express.static(distDir));

/* Routes 
API routes are specified after app."method"("route URL",(req, res))
*/
app.get("/api/status", (req, res) => {
    res.status(200).json({ status: "API is working" });
    // res.json({}); how to send data back
});
app.get("/", (req, res) => {
    res.status(200).json({ status: "API is working" });
});

//helpers
/**
 * Read helper_calls.js
 */
app.get("/api/allChooseData", (req, res) => {
    const type = req.query.type;
    async function getAllChooseData(type) {
        const apiData = await allChooseData(type);
        res.send(apiData);
    }
    getAllChooseData(type);
});

/**
 * Read helper_calls.js
 */
app.get("/api/allDataCountiesByState", (req, res) => {
    const state = req.query.state;
    async function getAllDataCountiesByState(state) {
        const apiData = await allDataCountiesByState(state);
        res.send(apiData);
    }
    getAllDataCountiesByState(state);
});

/**
 * Read helper_calls.js
 */
app.get("/api/countiesByStateTable", (req, res) => {
    const state = req.query.state;
    async function getCountiesByStateTable(state) {
        const apiData = await countiesByStateTable(state);
        res.send(apiData);
    }
    getCountiesByStateTable(state);
});

/**
 * Read helper_calls.js
 */
app.get("/api/statesTable", (req, res) => {
    async function getStatesTable() {
        const apiData = await statesTable();
        res.send(apiData);
    }
    getStatesTable();
});

/**
 * Read helper_calls.js
 */
 app.get("/api/customDataCountiesByState", (req, res) => {
    const state = req.query.state;
    async function getCustomDataCountiesByState(state) {
        const apiData = await customDataCountiesByState(state);
        res.send(apiData);
    }
    getCustomDataCountiesByState(state);
});

/**
 * Read helper_calls.js
 */
 app.get("/api/customDataCountiesByFips", (req, res) => {
    const fip = req.query.fip;
    async function getCustomDataCountiesByFips(fip) {
        const apiData = await customDataCountiesByFips(fip);
        res.send(apiData);
    }
    getCustomDataCountiesByFips(fip);
});


/**
 * Returns the data necessary for the map Widget in the frontend
 */
app.get("/api/mapWidget", (req, res) => {
    async function getMapWidget() {
        const apiData = await mapWidget();
        res.send(apiData);
    }
    getMapWidget();
});

/**     //NOT USED
 * Returns the data necessary for the infected population widget in the frontend
 */
app.get("/api/infectionPopulationWidget", (req, res) => {
    async function getinfectionPopulationWidget() {
        const apiData = await infectionPopulationWidget();
        res.send(apiData);
    }
    getinfectionPopulationWidget();
});

/**
 * Returns the data necessary for the mortality rate widget in the frontend
 * works by parsing the JSON in the request and breaking it down
 * to be passed as a parameter to the function in charge of this data
 */
app.post("/api/mortalityRate", function (req, res) {
    const keysJSON = Object.keys(req.body)
    let lengthJSON = keysJSON.length;
    let reqeustParam = [];
    for (let i = 0; i < lengthJSON; i++) {
        reqeustParam.push(keysJSON[i]);
        reqeustParam.push(req.body[keysJSON[i]]);
    };
    async function getMortality_rate(reqeustParam) {
        const apiData = await mortality_rate(reqeustParam);
        res.send(apiData);
    }
    getMortality_rate(reqeustParam);
});

/**
 * Returns the data necessary for the hospitalization data widget in the frontend
 * works by parsing the JSON in the request and breaking it down
 * to be passed as a parameter to the function in charge of this data
 */
app.post("/api/hospitalizationData", function (req, res) {
    const keysJSON = Object.keys(req.body)
    let lengthJSON = keysJSON.length;
    let reqeustParam = [];
    for (let i = 0; i < lengthJSON; i++) {
        reqeustParam.push(keysJSON[i]);
        reqeustParam.push(req.body[keysJSON[i]]);
    };
    async function getHospitalization_Data(reqeustParam) {
        const apiData = await hospitalization_data(reqeustParam);
        res.send(apiData);
    }
    getHospitalization_Data(reqeustParam);
});

app.post("/api/rawData", function (req, res) {
    const keysJSON = Object.keys(req.body)
    let lengthJSON = keysJSON.length;
    let reqeustParam = [];
    for (let i = 0; i < lengthJSON; i++) {
        reqeustParam.push(keysJSON[i]);
        reqeustParam.push(req.body[keysJSON[i]]);
    };
    async function getRawData(reqeustParam) {
        const apiData = await raw_data(reqeustParam);
        res.send(apiData);
    }
    getRawData(reqeustParam);
});

// sets the port to listen for requests.
app.listen(port, () => console.log(`Listening on port ${port}`));
