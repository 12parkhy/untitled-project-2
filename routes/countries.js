const express = require('express')
const router = express.Router()
const { getData, urls } = require('../public/javascripts/coronaData')

router.get('/:countryCode', async (req, res) => {
    try {
        if ((req.params.countryCode)[0] == (req.params.countryCode)[0].toLowerCase()) {
            const countriesCurrentData = await getData(urls['countriesCurrentUrl'])
            for (let i = 0; i < countriesCurrentData.length; i++) {
                if (countriesCurrentData[i]['country'].toLowerCase().replace(' ', '-') == req.params.countryCode) {
                    return res.render('country', {
                        countryCurrentData: countriesCurrentData[i]
                    })
                }
            }
        } else {
            const tempData = await getData(urls['countryCurrentUrl'] + req.params.countryCode)
            const countryCurrentData = await tempData[0]
            res.render('country', {
                countryCurrentData
            })
        }
    } catch (error) {
        console.error(error)
    }
})

module.exports = router