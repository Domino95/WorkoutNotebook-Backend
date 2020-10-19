const Training = require('../../models/training')
const { combineResolvers } = require('graphql-resolvers')
const isAuthenticated = require('./isAuth')

module.exports = {
    createTraining: combineResolvers(isAuthenticated, async args => {
        try {
            const trainig = new Training({
                name: args.name,
                creator: args.userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            const result = await trainig.save()
            return { ...result._doc, createdAt: new Date(result.createdAt).toISOString() }
        }
        catch (error) {
            console.log(error)
            throw error
        }
    }),
    addExercises: combineResolvers(isAuthenticated, async args => {
        try {
            const training = await Training.findById(args.trainingId)
            if (training) {
                training.updatedAt = new Date()
                training.exercises.push(
                    {
                        name: args.name,

                    })
                const result = await training.save()
                return { ...result._doc, createdAt: new Date(result.updatedAt).toISOString() }
            }
            else {
                throw new Error("Training not exist")
            }
        } catch (error) {
            throw error
        }
    }),
    addSeries: combineResolvers(isAuthenticated, async args => {
        try {
            const training = await Training.findById(args.trainingId)
            if (training) {
                training.updatedAt = new Date()
                let id = undefined
                training.exercises.map((item, index) => {
                    if (item.name === args.name) id = index
                })
                if (id !== undefined) {
                    training.exercises[id].series.push(
                        {
                            weight: args.weight,
                            reps: args.reps
                        }
                    )
                }
                else {
                    throw new Error("Exercise not exist")
                }
                const result = await training.save()
                return { ...result._doc, createdAt: new Date(result.updatedAt).toISOString() }
            }
            else {
                throw new Error("Training not exist")
            }
        } catch (error) {
            throw error
        }
    }),
    getWorkouts: combineResolvers(isAuthenticated, async args => {
        try {
            const workouts = await Training.find({ creator: args.userId })
            if (workouts) {
                const data = workouts.map(item => {
                    return {
                        _id: item._id,
                        name: item.name,
                        createdAt: new Date(item.createdAt).toISOString(),
                        exercises: item.exercises
                    }
                })
                return data
            }

            else throw new Error("User dont have any workouts")
        }
        catch (error) {
            throw error
        }
    }
    ),
    deleteSeries: combineResolvers(isAuthenticated, async args => {
        try {
            const training = await Training.findById(args.trainingId)
            if (training) {
                training.updatedAt = new Date()
                let id = undefined
                let seriesId = undefined
                training.exercises.map((item, index) => {
                    if (item.name === args.name) id = index
                })
                if (id !== undefined) {
                    training.exercises[id].series.map((item, index) => {
                        if (item._id == args.seriesId) {
                            seriesId = index
                        }
                    })
                    if (seriesId !== undefined) {
                        training.exercises[id].series.splice(seriesId, 1)
                    }
                    else {
                        throw new Error("Series not exist")
                    }
                }
                else {
                    throw new Error("Exercise not exist")
                }
                const result = await training.save()
                return { ...result._doc, createdAt: new Date(result.updatedAt).toISOString() }
            }
            else {
                throw new Error("Training not exist")
            }
        } catch (error) {
            throw error
        }
    }),
    deleteExercise: combineResolvers(isAuthenticated, async args => {
        try {
            const training = await Training.findById(args.trainingId)
            if (training) {
                training.updatedAt = new Date()
                let exerciseId = undefined
                training.exercises.map((item, index) => {
                    if (item._id == args.exerciseId) exerciseId = index
                })
                if (exerciseId !== undefined) {
                    training.exercises.splice(exerciseId, 1)
                }
                else {
                    throw new Error("Exercise not exist")
                }
                const result = await training.save()
                return { ...result._doc, createdAt: new Date(result.updatedAt).toISOString() }
            }
            else {
                throw new Error("Training not exist")
            }
        } catch (error) {
            throw error
        }
    }),
    deleteTraining: combineResolvers(isAuthenticated, async args => {
        try {
            const deleted = await Training.findByIdAndDelete(args.trainingId)
            if (deleted) return deleted._id
        } catch (error) {
            throw error
        }
    })
}
