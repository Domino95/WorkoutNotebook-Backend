const { buildSchema } = require('graphql')

module.exports = buildSchema(`

type User {
    _id: ID! 
    email: String!
    password: String!
    name:String!
    goal: String!
    photoUrl: String!
    confirmed: Boolean!
    workouts: [Training!]!
}
type loginResponse{
    userId: ID!
    accesToken: String!
    refreshToken: String!
}

type Exercises {
    _id: ID!
    name: String!
    series: [Series]!
}
type Series {
    _id: ID!
    number: Int!
    weight: Float!
    reps: Int!
}
    type Training{
    _id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    creator: ID!
     exercises: [Exercises]!
}

type TrainingResponse{
    _id: ID!
    creator: ID!
    name: String!
    createdAt: String!
}

type updatedResponse{
    name:String!
    _id: ID!
    updatedAt: ID!
    createdAt: String!
     date: String!
     creator: ID!
     exercises: [Exercises]!
    }

type deleteResponse{
_id: ID!
}


type RootQuery{
    getUser(userId: ID!): User!
    login(email: String!, password: String!): loginResponse
    getWorkouts(userId: ID!): [Training!]!
}
type RootMutation{
    createUser(email: String!, password: String!, name:String! ): User
    updateUser(userId: ID!, name: String!, goal: String!, photo: String): User
    createTraining(userId: ID!, name: String!): TrainingResponse!
    addExercises(trainingId: ID!, name: String!): updatedResponse!
    addSeries( trainingId: ID!, name: String!, weight: Float!,reps: Int!): updatedResponse!
    deleteSeries(trainingId: ID!, seriesId: ID!, name: String!): updatedResponse!
    deleteExercise(trainingId: ID!, exerciseId: ID!): updatedResponse!
    deleteTraining(trainingId: ID!): deleteResponse!

}   
schema {
    query: RootQuery
    mutation: RootMutation
}
`)