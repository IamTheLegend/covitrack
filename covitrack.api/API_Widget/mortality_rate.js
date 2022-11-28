import { allChooseData, customDataCountiesByFips } from "../helper_calls/helper_calls.js";

/**
 * Provides the frontend data regarding the mortality rate of the state or county
 * @param {*} reqeustParam JSON array that can contain states's and/or counties's fips (unique IDs)
 * @returns the data necessary for the front end widget as a JSON
 */
export async function mortality_rate(reqeustParam) {
    let type;
    let idsArr = [];
    let returnArr = [];

    if (reqeustParam == undefined) { //send all states
        const apiData = await allChooseData("states");
        const arr = [];
        for (let i = 0; i < apiData.length; i++) {
            states.push({
                "state_code": apiData[i].state,
                "state_id": apiData[i].fips,
                "population": apiData[i].population,
                "cases": apiData[i].actuals.cases,
                "deaths": apiData[i].actuals.deaths
            })
        }
        return arr;
    } else { //check reqeustParam
        // Counties is more important than state
        if (reqeustParam.length > 2) {
            for (let i = 0; i < reqeustParam.length; i = i + 2) {
                if (reqeustParam[i] == "counties") {
                    type = reqeustParam[i];
                    for (const id of reqeustParam[i + 1]) {
                        idsArr.push(id)
                    }
                }
            }
        } else { // only state on the request
            type = reqeustParam[0];
            for (const id of reqeustParam[1]) {
                idsArr.push(id)
            }
        }

        if (type == "states") {
            const apiData = await allChooseData("states"); // its only 53 states so its fast
            for (const id of idsArr) {
                for (let i = 0; i < apiData.length; i++) {
                    if (id == apiData[i].fips) {
                        returnArr.push({
                            "state_id": apiData[i].fips,
                            "state_code": apiData[i].state,
                            "population": apiData[i].population,
                            "cases": apiData[i].actuals.cases,
                            "deaths": apiData[i].actuals.deaths
                        })
                    }
                }
            }
            idsArr = [];
            return returnArr;
        } else { //type == "counties"
            for (const id of idsArr) {
                const apiData = await customDataCountiesByFips(id);
                returnArr.push({
                    "state_code": apiData[0].state_code,
                    "county_name": apiData[0].county_name,
                    "county_id": apiData[0].county_id,
                    "population": apiData[0].population,
                    "cases": apiData[0].cases,
                    "deaths": apiData[0].deaths
                })
            }
        idsArr = [];
        return returnArr;
        }
    }
};