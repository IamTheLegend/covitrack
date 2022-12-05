import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
dotenv.config();

/**
 * Requests from CovidActNow all the JSON data of the requested type
 * @param {*} request state, counties, cbsas
 * @returns the entire JSON from CovidActNow
 */
export async function allChooseData(request) {
    const type = request;
    const covidActNowApiKey = process.env.CovidActNowApiKey;

    //Checks the request parameter is acceptable
    if (type == "states" || type == "counties" || type == "cbsas") {
        let headersList = {
            //none needed here for covidactnow
        }
        let response = await fetch("https://api.covidactnow.org/v2/" + type + ".json?apiKey=" + covidActNowApiKey, {
            method: "GET",
            headers: headersList
        });

        if (!response.status || response.status === 200) {
            let apiData = await response.json(); //or response.text() -> check to see with front end whats better
            //console.log("response Status: " + response.status + "-> Response_Text: " + response.statusText);
            return (apiData);
        } else { //some kind of error
            let message;
            switch (response.status) {
                default:
                    const response = "status_code: " + response.status + " status_text: " + response.statusText;
                    return response;
            }
        }
    }
    else {
        const message = 'Wrong request parameter for type, choose from: states or counties or cbsas, received: ' + type;
        return message;
    }
};

/**
 * Requests from CovidActNow all the JSON data of the requested state's counties
 * @param {*} state to get the counties of
 * @returns the entire JSON from CovidActNow
 */
export async function allDataCountiesByState(state) {
    const covidActNowApiKey = process.env.CovidActNowApiKey;
    //Checks the request parameter is acceptable maybe by creating a table of them
    let headersList = {
        //none needed here for covidactnow
    }
    let response = await fetch("https://api.covidactnow.org/v2/counties.json?apiKey=" + covidActNowApiKey, {
        method: "GET",
        headers: headersList
    });

    if (!response.status || response.status === 200) {
        let apiData = await response.json(); //or response.text() -> check to see with front end whats better
        //console.log("response Status: " + response.status + "-> Response_Text: " + response.statusText);
        const counties = [];

        if (state == undefined) // default to FL
        {
            for (let i = 0; i < apiData.length; i++) {
                if (apiData[i].state == "FL")
                    counties.push(apiData[i])
            }
            return (counties);
        } else {
            for (let i = 0; i < apiData.length; i++) {
                if (apiData[i].state == state)
                    counties.push(apiData[i])
            }
            return (counties);
        }
    } else { //some kind of error
        switch (response.status) {
            default:
                const message = "status_code: " + response.status + " status_text: " + response.statusText;
                return message;
        }
    }
};

/**
 * List of name and id of all the US states
 * @returns JSON with name and ID per state
 */
export async function statesTable() {
    const covidActNowApiKey = process.env.CovidActNowApiKey;
    let headersList = {
        //none needed here for covidactnow
    }
    let response = await fetch("https://api.covidactnow.org/v2/states.json?apiKey=" + covidActNowApiKey, {
        method: "GET",
        headers: headersList
    });
    if (!response.status || response.status === 200) {
        let apiData = await response.json();
        const states = [];
        for (let i = 0; i < apiData.length; i++) {
            states.push({
                "state_code": apiData[i].state,
                "state_id": apiData[i].fips
            })
        }
        return (states);
    } else { //some kind of error
        switch (response.status) {
            default:
                const message = "status_code: " + response.status + " status_text: " + response.statusText;
                return message;
        }
    }
};

/**
 * List of name and id of all the counties per state
 * @param {*} state to get the counties of
 * @returns JSON with name and ID of counties per state
 */
export async function countiesByStateTable(state) {
    const covidActNowApiKey = process.env.CovidActNowApiKey;
    //Checks the request parameter is acceptable maybe by creating a table of them
    let headersList = {
        //none needed here for covidactnow
    }
    let response = await fetch("https://api.covidactnow.org/v2/counties.json?apiKey=" + covidActNowApiKey, {
        method: "GET",
        headers: headersList
    });

    if (!response.status || response.status === 200) {
        let apiData = await response.json(); //or response.text() -> check to see with front end whats better
        //console.log("response Status: " + response.status + "-> Response_Text: " + response.statusText);
        const counties = [];

        if (state == undefined) // default to FL
        {
            for (let i = 0; i < apiData.length; i++) {
                if (apiData[i].state == "FL")
                    counties.push({
                        "state_code": apiData[i].state,
                        "county_name": apiData[i].county,
                        "county_id": apiData[i].fips
                    })
            }
            return (counties);
        } else {
            for (let i = 0; i < apiData.length; i++) {
                if (apiData[i].state == state)
                    counties.push({
                        "state_code": apiData[i].state,
                        "county_name": apiData[i].county,
                        "county_id": apiData[i].fips
                    })
            }
            return (counties);
        }
    } else { //some kind of error
        switch (response.status) {
            default:
                const message = "status_code: " + response.status + " status_text: " + response.statusText;
                return message;
        }
    }
};

/**
 * To use by the API call mortality_rate and the hozpitalization_data
 * call CovidActNow counties API and returns all counites or the counties in the STATE specified
 * @param {*} state to filter what counties to return
 * @returns the data that the app uses to decrease size by county
 */
export async function customDataCountiesByState(state) {
    const covidActNowApiKey = process.env.CovidActNowApiKey;
    //Checks the request parameter is acceptable maybe by creating a table of them
    let headersList = {
        //none needed here for covidactnow
    }
    let response = await fetch("https://api.covidactnow.org/v2/counties.json?apiKey=" + covidActNowApiKey, {
        method: "GET",
        headers: headersList
    });

    if (!response.status || response.status === 200) {
        let apiData = await response.json(); //or response.text() -> check to see with front end whats better
        //console.log("response Status: " + response.status + "-> Response_Text: " + response.statusText);
        const counties = [];

        if (state == undefined) // default to FL
        {
            for (let i = 0; i < apiData.length; i++) {
                counties.push({
                    "state_code": apiData[i].state,
                    "county_name": apiData[i].county,
                    "county_id": apiData[i].fips,
                    "population": apiData[i].population,
                    "cases": apiData[i].actuals.cases,
                    "deaths": apiData[i].actuals.deaths,
                    "hospital_beds_total": apiData[i].actuals.hospitalBeds.capacity, //TotalBeds
                    "hospital_beds_occupied": apiData[i].actuals.hospitalBeds.currentUsageTotal, //OccupiedBeds
                    "hospital_beds_free": ((apiData[i].actuals.hospitalBeds.capacity) - (apiData[i].actuals.hospitalBeds.currentUsageTotal)) //FreeBeds
                })
            }
            return (counties);
        } else {
            for (let i = 0; i < apiData.length; i++) {
                if (apiData[i].state == state) {
                    counties.push({
                        "state_code": apiData[i].state,
                        "county_name": apiData[i].county,
                        "county_id": apiData[i].fips,
                        "population": apiData[i].population,
                        "cases": apiData[i].actuals.cases,
                        "deaths": apiData[i].actuals.deaths,
                        "hospital_beds_total": apiData[i].actuals.hospitalBeds.capacity, //TotalBeds
                        "hospital_beds_occupied": apiData[i].actuals.hospitalBeds.currentUsageTotal, //OccupiedBeds
                        "hospital_beds_free": ((apiData[i].actuals.hospitalBeds.capacity) - (apiData[i].actuals.hospitalBeds.currentUsageTotal)) //FreeBeds
                    })
                }
            }
            return (counties);
        }
    } else { //some kind of error
        switch (response.status) {
            default:
                const message = "status_code: " + response.status + " status_text: " + response.statusText;
                return message;
        }
    }
};

/**
 * To use by the API call mortality_rate and the hozpitalization_data
 * call CovidActNow specific COUNTY API and returns the county's data
 * @param {*} fip of the county to search for
 * @returns the data that the app uses to decrease size by county
 */
export async function customDataCountiesByFips(fip) {
    const covidActNowApiKey = process.env.CovidActNowApiKey;
    //Checks the request parameter is acceptable maybe by creating a table of them
    let headersList = {
        //none needed here for covidactnow
    }
    let response = await fetch("https://api.covidactnow.org/v2/counties.json?apiKey=" + covidActNowApiKey, {
        method: "GET",
        headers: headersList
    });

    if (!response.status || response.status === 200) {
        let apiData = await response.json(); //or response.text() -> check to see with front end whats better
        //console.log("response Status: " + response.status + "-> Response_Text: " + response.statusText);
        const counties = [];

        if (fip == undefined) // default to FL
        {
            for (let i = 0; i < apiData.length; i++) {
                counties.push({
                    "state_code": apiData[i].state,
                    "county_name": apiData[i].county,
                    "county_id": apiData[i].fips,
                    "population": apiData[i].population,
                    "cases": apiData[i].actuals.cases,
                    "deaths": apiData[i].actuals.deaths,
                    "PositiveTests": apiData[i].actuals.positiveTests,
                    "NegativeTests": apiData[i].actuals.negativeTests,
                    "hospital_beds_total": apiData[i].actuals.hospitalBeds.capacity, //TotalBeds
                    "hospital_beds_occupied": apiData[i].actuals.hospitalBeds.currentUsageTotal, //OccupiedBeds
                    "HospitalBeds_CurrentUsageCovid": apiData[i].actuals.hospitalBeds.currentUsageCovid,
                    "hospital_beds_free": ((apiData[i].actuals.hospitalBeds.capacity) - (apiData[i].actuals.hospitalBeds.currentUsageTotal)), //FreeBeds
                    "HospitalBeds_weeklyCovidAdmissions": apiData[i].actuals.hospitalBeds.weeklyCovidAdmissions,
                    "VaccinationsInitiated": apiData[i].actuals.vaccinationsInitiated,
                    "VaccinationsCompleted": apiData[i].actuals.vaccinationsCompleted,
                    "VaccinationsAdditionalDose": apiData[i].actuals.vaccinationsAdditionalDose
                })
            }
            return (counties);
        } else {
            for (let i = 0; i < apiData.length; i++) {
                if (apiData[i].fips == fip) {
                    counties.push({
                        "state_code": apiData[i].state,
                        "county_name": apiData[i].county,
                        "county_id": apiData[i].fips,
                        "population": apiData[i].population,
                        "cases": apiData[i].actuals.cases,
                        "deaths": apiData[i].actuals.deaths,
                        "PositiveTests": apiData[i].actuals.positiveTests,
                        "NegativeTests": apiData[i].actuals.negativeTests,
                        "hospital_beds_total": apiData[i].actuals.hospitalBeds.capacity, //TotalBeds
                        "hospital_beds_occupied": apiData[i].actuals.hospitalBeds.currentUsageTotal, //OccupiedBeds
                        "HospitalBeds_CurrentUsageCovid": apiData[i].actuals.hospitalBeds.currentUsageCovid,
                        "hospital_beds_free": ((apiData[i].actuals.hospitalBeds.capacity) - (apiData[i].actuals.hospitalBeds.currentUsageTotal)), //FreeBeds
                        "HospitalBeds_weeklyCovidAdmissions": apiData[i].actuals.hospitalBeds.weeklyCovidAdmissions,
                        "VaccinationsInitiated": apiData[i].actuals.vaccinationsInitiated,
                        "VaccinationsCompleted": apiData[i].actuals.vaccinationsCompleted,
                        "VaccinationsAdditionalDose": apiData[i].actuals.vaccinationsAdditionalDose
                    })
                }
            }
            return (counties);
        }
    } else { //some kind of error
        switch (response.status) {
            default:
                const message = "status_code: " + response.status + " status_text: " + response.statusText;
                return message;
        }
    }
};