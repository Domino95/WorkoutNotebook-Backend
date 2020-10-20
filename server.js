const express = require('express')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || '4000'
const mongoose = require('mongoose')
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')
const app = express()
const authorization = require('./middleWare/authorization')
const User = require('./models/user.js')
const jwt = require('jsonwebtoken')
require('dotenv').config();

app.get('/confirmation/:token', async (req, res) => {
    try {
        const token = jwt.verify(req.params.token, process.env.SECRET_EMAIL_TOKEN);
        const user = await User.findById(token.userId)
        user.confirmed = true
        await user.save()
    } catch (error) {
        res.send('error');
    }
    return res.redirect('https://admiring-fermat-7f4b6e.netlify.app');
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, accesToken, refreshToken')
    if (req.method === "OPTIONS") {
        return res.sendStatus(200)
    }
    next()
})
app.use(authorization)
app.use(bodyParser.json({ limit: '50mb' }))
app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.9gwid.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        app.listen(PORT);

    }).catch(err => {
        console.log(err)
    })
