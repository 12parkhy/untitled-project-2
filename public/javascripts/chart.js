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
const generateGlobalCharts = async() => {
    const globalCurrentData = await getData(urls['globalCurrentUrl'])
    const globalCurrentPieChart = document.getElementById('globalCurrentPieChart').getContext('2d')
    const globalPieChart = new Chart(globalCurrentPieChart, {
        type: 'pie',
        data: {
            labels: ['Total Active Cases', 'Total Deaths', 'Total Recovered'],
            datasets: [{
                label: 'Global Pie Chart',
                data: [globalCurrentData.totalActiveCases, globalCurrentData.totalDeaths, globalCurrentData.totalRecovered],
                backgroundColor: ['pink', '#DC3545', '#28A745']
            }]
        },
        options: {
            title: {
                display: false,
                text: 'Global Pie Chart',
                fontSize: 25
            },
            tooltips: {
                callbacks: {
                    label: function(a, b) {
                        const value = b.datasets[a.datasetIndex].data[a.index].toLocaleString()
                        return value
                    }
                }
            }
        }
    })
    const globalHistoryData = await getData(urls['globalHistoryUrl'])
    const sortedGlobalHistoryData = await globalHistoryData.sort((a, b) => {
        if (a.lastUpdated > b.lastUpdated) {
            return 1
        } else if (a.lastUpdated < b.lastUpdated) {
            return -1
        } else {
            return 0
        }
    })
    const lastUpdated = await sortedGlobalHistoryData.map((d) => { return (new Date(d.lastUpdated)).toDateString() })
    const totalConfirmed = await sortedGlobalHistoryData.map((d) => { return d.totalConfirmed })
    const totalDeaths = await sortedGlobalHistoryData.map((d) => { return d.totalDeaths })
    const totalRecovered = await sortedGlobalHistoryData.map((d) => { return d.totalRecovered })
    const globalHistoryLineChart = document.getElementById('globalHistoryLineChart').getContext('2d')
    const globalLineChart = new Chart(globalHistoryLineChart, {
        type: 'line',
        data: {
            labels: lastUpdated,
            datasets: [{
                    label: 'Total Confirmed',
                    fill: false,
                    data: totalConfirmed,
                    backgroundColor: '#FFC107',
                    borderColor: '#FFC107'
                },
                {
                    label: 'Total Deaths',
                    fill: false,
                    data: totalDeaths,
                    backgroundColor: '#DC3545',
                    borderColor: '#DC3545'
                },
                {
                    label: 'Total Recovered',
                    fill: false,
                    data: totalRecovered,
                    backgroundColor: '#28A745',
                    borderColor: '#28A745'
                }
            ]
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: 'Global History Chart',
                fontSize: 25
            },
            scales: {
                xAxes: [{
                    ticks: {
                        display: true,
                        autoSkip: true,
                        maxTicksLimit: 4
                    }
                }],
                yAxes: [{
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString()
                        }
                    }
                }]
            },
            tooltips: {
                mode: 'index',
                callbacks: {
                    label: function(a, b) {
                        const value = b.datasets[a.datasetIndex].data[a.index].toLocaleString()
                        return value
                    }
                }
            }
        }
    })
}
const generateCountryCharts = async() => {
    const countryCode = (document.getElementById('countryCurrentPieChart').classList)["value"]
    let countryCurrentData
    if (countryCode[0] != countryCode[0].toLowerCase()) {
        const tempData = await (getData(urls['countryCurrentUrl'] + countryCode))
        countryCurrentData = await tempData[0]
    } else {
        const tempData = await getData(urls['countriesCurrentUrl'])
        for (let i = 0; i < tempData.length; i++) {
            if (tempData[i]['country'].toLowerCase().replace(' ', '-') == countryCode) {
                countryCurrentData = tempData[i]
                break
            }
        }
    }
    const countryCurrentPieChart = document.getElementById('countryCurrentPieChart').getContext('2d')
    const countryPieChart = new Chart(countryCurrentPieChart, {
        type: 'pie',
        data: {
            labels: ['Active Cases', 'Total Deaths', 'Total Recovered'],
            datasets: [{
                label: 'Country Pie Chart',
                data: [countryCurrentData.totalConfirmed - (countryCurrentData.totalDeaths + countryCurrentData.totalRecovered), countryCurrentData.totalDeaths, countryCurrentData.totalRecovered],
                backgroundColor: ['pink', '#DC3545', '#28A745']
            }]
        },
        options: {
            title: {
                display: false,
                text: 'Country Pie Chart',
                fontSize: 25
            },
            tooltips: {
                callbacks: {
                    label: function(a, b) {
                        const value = b.datasets[a.datasetIndex].data[a.index].toLocaleString()
                        return value
                    }
                }
            }
        }
    })
    const countriesInfo = await getData(urls['countriesInfoUrl'])
    let countryHistoryData
    for (let i = 0; i < countriesInfo.length; i++) {
        if (countriesInfo[i]['ISO2'] == countryCode) {
            countryHistoryData = await getData(urls['countryHistoryUrl'] + countriesInfo[i]['Slug'])
            break
        } else if (countriesInfo[i]['Slug'] == countryCode) {
            countryHistoryData = await getData(urls['countryHistoryUrl'] + countriesInfo[i]['Slug'])
            break
        }
    }
    const dates = countryHistoryData.map((d) => { return (new Date(d.Date)).toDateString() })
    const confirmed = countryHistoryData.map((d) => { return d.Confirmed })
    const deaths = countryHistoryData.map((d) => { return d.Deaths })
    const recovered = countryHistoryData.map((d) => { return d.Recovered })
    const countryHistoryLineChart = document.getElementById('countryHistoryLineChart').getContext('2d')
    const countryLineChart = new Chart(countryHistoryLineChart, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                    label: 'Total Confirmed',
                    fill: false,
                    data: confirmed,
                    backgroundColor: '#FFC107',
                    borderColor: '#FFC107'
                },
                {
                    label: 'Total Deaths',
                    fill: false,
                    data: deaths,
                    backgroundColor: '#DC3545',
                    borderColor: '#DC3545'
                },
                {
                    label: 'Total Recovered',
                    fill: false,
                    data: recovered,
                    backgroundColor: '#28A745',
                    borderColor: '#28A745'
                }
            ]
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: 'Country History Chart',
                fontSize: 25
            },
            scales: {
                xAxes: [{
                    ticks: {
                        display: true,
                        autoSkip: true,
                        maxTicksLimit: 4
                    }
                }],
                yAxes: [{
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString()
                        }
                    }
                }]
            },
            tooltips: {
                mode: 'index',
                callbacks: {
                    label: function(a, b) {
                        const value = b.datasets[a.datasetIndex].data[a.index].toLocaleString()
                        return value
                    }
                }
            }
        }
    })
}
generateGlobalCharts()
generateCountryCharts()