const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const indexRouter = require('./routes/index')
const countriesRouter = require('./routes/countries')

const app = express()

app.use(expressLayouts)
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(indexRouter)
app.use('/countries', countriesRouter)

const port = process.env.PORT || 4000

app.listen(port, () => { console.log(`Server is running on port ${port}`) })