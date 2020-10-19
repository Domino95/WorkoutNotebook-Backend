const { skip } = require('graphql-resolvers')

module.exports = isAuthenticated = (parent, args) => {
    if (args.userId) skip
    else throw new Error("Unauthorized")
}