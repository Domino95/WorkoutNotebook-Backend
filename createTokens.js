const jwt = require('jsonwebtoken')
module.exports = createTokens = async (userId, keyAccesToken, keyRefreshToken) => {
    const accesToken = await jwt.sign({ userId }, keyAccesToken, { expiresIn: '10m' })
    const refreshToken = await jwt.sign({ userId }, keyRefreshToken, { expiresIn: '30d' })
    return { accesToken, refreshToken }
}