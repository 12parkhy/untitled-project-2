const express = require('express')
const router = express.Router()
const { getData, urls } = require('../public/javascripts/coronaData')

router.get('/', async (req, res) => {
    try {
        const globalCurrentData = await getData(urls["globalCurrentUrl"])
        const countriesCurrentData = await getData(urls["countriesCurrentUrl"])
        res.render('index', {
            globalCurrentData,
            countriesCurrentData
        })
    } catch (error) {
        console.error(error)
    }
})

module.exports = router