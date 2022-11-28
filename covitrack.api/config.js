//https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786

// NOT USED 
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    covidActNowApiKey: process.env.CovidActNowApiKey,
    port: process.env.PORT
};