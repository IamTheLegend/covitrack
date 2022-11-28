import { allChooseData } from "../helper_calls/helper_calls.js";

/**
 * scans the JSON with all the states's and takes out the data
 * that the map widget uses
 * @returns JSON of the data from all the states
 */
export async function mapWidget() {
    const apiData = await allChooseData('states');
    const states = [];
    for (let i = 0; i < apiData.length; i++) {
        states.push({
            "state_id": apiData[i].fips,
            "state_code": apiData[i].state,
            "cases": apiData[i].actuals.cases,
            "deaths": apiData[i].actuals.deaths
        })
    }
    return states;
};