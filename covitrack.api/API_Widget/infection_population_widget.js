import { allChooseData } from "../helper_calls/helper_calls.js";

export async function infectionPopulationWidget() {
    const apiData = await allChooseData('states');

    const infectionPopulation = [];
    for (let i = 0; i < apiData.length; i++) {
        infectionPopulation.push({
            "state_code": apiData[i].state,
            "state_id": apiData[i].fips,
            "population": apiData[i].population,
            "cases": apiData[i].actuals.cases,
            "deaths": apiData[i].actuals.deaths
        })
    }
    //console.log(states)
    return infectionPopulation;
}
