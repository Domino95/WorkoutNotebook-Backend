const { response } = require('express')
const jwt = require('jsonwebtoken')
const createTokens = require('../createTokens')

module.exports = async (req, res, next) => {
    const accesToken = req.headers.accestoken
    try {
        decodenToken = jwt.verify(accesToken, process.env.SECRET_ACCES_TOKEN)
        req.userId = decodenToken.userId
    }
    catch (error) {
        const refreshToken = req.headers.refreshtoken
        if (refreshToken) {
            try {
                decodenToken = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN)
                const tokens = await createTokens(decodenToken.userId, process.env.SECRET_ACCES_TOKEN, process.env.SECRET_REFRESH_TOKEN)
                console.log("created new tokens")
                res.send({ tokens })
            }
            catch (error) {
                res.status(500)
                res.send({ error })
            }
        }
        else {
            console.log("accesToken  timeleft")
        }
    }
    next()
}
