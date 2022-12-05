import { allChooseData, customDataCountiesByFips } from "../helper_calls/helper_calls.js";

/**
 * Provides the frontend data regarding the mortality rate of the state or county
 * @param {*} reqeustParam JSON array that can contain states's and/or counties's fips (unique IDs)
 * @returns the data necessary for the front end widget as a JSON
 */
export async function raw_data(reqeustParam) {
    let type;
    let idsArr = [];
    let returnArr = [];

    if (reqeustParam == undefined) { //send all states
        const apiData = await allChooseData("states");
        const arr = [];
        for (let i = 0; i < apiData.length; i++) {
            states.push({
                "state_code": apiData[i].state,
                "population": apiData[i].population || 0,
                "cases": apiData[i].actuals.cases || 0,
                "deaths": apiData[i].actuals.deaths || 0,
                "PositiveTests": apiData[i].actuals.positiveTests || 0,
                "NegativeTests": apiData[i].actuals.negativeTests || 0,
                "HospitalBeds_Capacity": apiData[i].actuals.hospitalBeds.capacity || 0,
                "HospitalBeds_CurrentUsageTotal": apiData[i].actuals.hospitalBeds.currentUsageTotal || 0,
                "HospitalBeds_CurrentUsageCovid": apiData[i].actuals.hospitalBeds.currentUsageCovid || 0,
                "HospitalBeds_weeklyCovidAdmissions": apiData[i].actuals.hospitalBeds.weeklyCovidAdmissions || 0,
                "VaccinationsInitiated": apiData[i].actuals.vaccinationsInitiated || 0,
                "VaccinationsCompleted": apiData[i].actuals.vaccinationsCompleted || 0,
                "VaccinationsAdditionalDose": apiData[i].actuals.vaccinationsAdditionalDose || 0

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
                            "state_code": apiData[i].state,
                            // "state_id": apiData[i].fips|| 0,
                            "population": apiData[i].population || 0,
                            "cases": apiData[i].actuals.cases || 0,
                            "deaths": apiData[i].actuals.deaths || 0,
                            "PositiveTests": apiData[i].actuals.positiveTests || 0,
                            "NegativeTests": apiData[i].actuals.negativeTests || 0,
                            "HospitalBeds_Capacity": apiData[i].actuals.hospitalBeds.capacity || 0,
                            "HospitalBeds_CurrentUsageTotal": apiData[i].actuals.hospitalBeds.currentUsageTotal || 0,
                            "HospitalBeds_CurrentUsageCovid": apiData[i].actuals.hospitalBeds.currentUsageCovid || 0,
                            "HospitalBeds_weeklyCovidAdmissions": apiData[i].actuals.hospitalBeds.weeklyCovidAdmissions || 0,
                            "VaccinationsInitiated": apiData[i].actuals.vaccinationsInitiated || 0,
                            "VaccinationsCompleted": apiData[i].actuals.vaccinationsCompleted || 0,
                            "VaccinationsAdditionalDose": apiData[i].actuals.vaccinationsAdditionalDose || 0
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
                    "population": apiData[0].population || 0,
                    "cases": apiData[0].cases || 0,
                    "deaths": apiData[0].deaths || 0,
                    "PositiveTests": apiData[0].positiveTests || 0,
                    "NegativeTests": apiData[0].negativeTests || 0,
                    "HospitalBeds_Capacity": apiData[0].hospital_beds_total || 0,
                    "HospitalBeds_CurrentUsageTotal": apiData[0].hospital_beds_occupied || 0,
                    "HospitalBeds_CurrentUsageCovid": apiData[0].HospitalBeds_CurrentUsageCovid || 0,
                    "HospitalBeds_weeklyCovidAdmissions": apiData[0].HospitalBeds_weeklyCovidAdmissions || 0,
                    "VaccinationsInitiated": apiData[0].vaccinationsInitiated || 0,
                    "VaccinationsCompleted": apiData[0].vaccinationsCompleted || 0,
                    "VaccinationsAdditionalDose": apiData[0].vaccinationsAdditionalDose || 0
                })
            }
            idsArr = [];
            return returnArr;
        }
    }
};