const fetch = require('node-fetch')

const urls = {
    countriesInfoUrl: "https://api.covid19api.com/countries",
    globalCurrentUrl: "http://api.coronatracker.com/v3/stats/worldometer/global",
    countriesCurrentUrl: "http://api.coronatracker.com/v3/stats/worldometer/country",
    countryCurrentUrl: "http://api.coronatracker.com/v3/stats/worldometer/country?countryCode=",
    globalHistoryUrl: "http://api.coronatracker.com/v3/stats/worldometer/totalTrendingCases",
    countryHistoryUrl: "https://corona.azure-api.net/timeline/"
}

const getData = async(url) => {
    try {
        const response = await fetch(url)
        const json = await response.json()
        return json
    } catch (error) {
        console.error(error)
    }
}

module.exports = { getData, urls }