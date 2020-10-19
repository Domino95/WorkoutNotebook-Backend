const trainingResolvers = require("./training")
const userResolvers = require("./user")

const rootResolver = {
    ...trainingResolvers,
    ...userResolvers,
}

module.exports = rootResolver