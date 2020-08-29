const createTable = async (data) => {
    const tableBody = document.getElementById('countriesTableBody')
    let addition = ''
    let count = 0
    for (let i = 0; i < data.length; i++) {
        count++
        addition = addition + `<tr>
        <td>${count}</td>
        <td>
            <a href="/countries/${data[i].countryCode != null && data[i].countryCode != '' ? data[i].countryCode
                : data[i].country.toLowerCase().replace(' ', '-')}">
                ${data[i].country}
            </a>
        </td>
        <td>
            ${data[i].totalConfirmed.toLocaleString()}
        </td>
        <td>
            ${data[i].activeCases.toLocaleString()}
        </td>
        <td>
            ${data[i].totalCritical.toLocaleString()}
        </td>
        <td>
            ${data[i].totalRecovered.toLocaleString()}
        </td>
        <td>
            ${data[i].totalDeaths.toLocaleString()}
        </td>
        <td>
            ${data[i].dailyConfirmed.toLocaleString()}
        </td>
        <td>
            ${data[i].dailyDeaths.toLocaleString()}
        </td>
        <td>
            ${data[i].totalConfirmedPerMillionPopulation.toLocaleString()}
        </td>
        <td>
            ${data[i].totalDeathsPerMillionPopulation != null ? data[i].totalDeathsPerMillionPopulation.toLocaleString() : data[i].totalDeathsPerMillionPopulation}
        </td>
        <td>
            ${(data[i].lastUpdated).split('T')[0]}
        </td>
    </tr>`
    }
    tableBody.innerHTML = addition
}
const generateData = async () => {
    const countriesCurrentData = await getData(urls['countriesCurrentUrl'])
    createTable(countriesCurrentData)
}
generateData()
const searchData = (value, data) => {
    const inputValue = value.toLowerCase()
    const searchedData = []
    for (let i = 0; i < data.length; i++) {
        const country = data[i].country.toLowerCase()
        if (country.includes(inputValue)) {
            searchedData.push(data[i])
        }
    }
    return searchedData
}
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('fa-sort') && event.target.parentElement.id == 'country') {
        const searchedValue = document.getElementById('searchCountries').value
        let countriesCurrentData = null
        if (searchedValue == null || searchedValue == '') {
            countriesCurrentData = await getData(urls['countriesCurrentUrl'])
        } else {
            const tempData = await getData(urls['countriesCurrentUrl'])
            countriesCurrentData = searchData(searchedValue, tempData)
        }
        if (!event.target.classList.contains('ascending')) {
            const sortedData = await countriesCurrentData.sort((a, b) => {
                if (a.country.toLowerCase() > b.country.toLowerCase()) {
                    return 1
                } else if (a.country.toLowerCase() < b.country.toLowerCase()) {
                    return -1
                } else {
                    return 0
                }
            })
            createTable(sortedData)
            event.target.classList.add('ascending')
            event.target.classList.remove('descending')
        } else if (!event.target.classList.contains('descending')) {
            const sortedData = await countriesCurrentData.sort((a, b) => {
                if (a.country.toLowerCase() < b.country.toLowerCase()) {
                    return 1
                } else if (a.country.toLowerCase() > b.country.toLowerCase()) {
                    return -1
                } else {
                    return 0
                }
            })
            createTable(sortedData)
            event.target.classList.add('descending')
            event.target.classList.remove('ascending')
        }
    }
})
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('fa-sort') && event.target.parentElement.id != 'country') {
        const searchedValue = document.getElementById('searchCountries').value
        let countriesCurrentData = null
        if (searchedValue == null || searchedValue == '') {
            countriesCurrentData = await getData(urls['countriesCurrentUrl'])
        } else {
            const tempData = await getData(urls['countriesCurrentUrl'])
            countriesCurrentData = searchData(searchedValue, tempData)
        }
        const name = event.target.parentElement.id
        if (!event.target.classList.contains('ascending')) {
            const sortedData = await countriesCurrentData.sort((a, b) => {
                if (a[name] > b[name]) {
                    return 1
                } else if (a[name] < b[name]) {
                    return -1
                } else {
                    return 0
                }
            })
            createTable(sortedData)
            event.target.classList.add('ascending')
            event.target.classList.remove('descending')
        } else if (!event.target.classList.contains('descending')) {
            const sortedData = await countriesCurrentData.sort((a, b) => {
                if (a[name] < b[name]) {
                    return 1
                } else if (a[name] > b[name]) {
                    return -1
                } else {
                    return 0
                }
            })
            createTable(sortedData)
            event.target.classList.add('descending')
            event.target.classList.remove('ascending')
        }
    }
})
const searchCountriesInput = document.getElementById('searchCountries')
searchCountriesInput.addEventListener('keyup', async (event) => {
    const countriesCurrentData = await getData(urls['countriesCurrentUrl'])
    const searchedData = searchData(searchCountriesInput.value, countriesCurrentData)
    createTable(searchedData)
})