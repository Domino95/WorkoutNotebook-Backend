const User = require('../../models/user')
const Training = require('../../models/training')
const { combineResolvers } = require('graphql-resolvers')
const bcrypt = require('bcrypt')
const createTokens = require('../../createTokens')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const { cloudinary } = require('../../cloudinary/cloudinary')
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});
module.exports = {
    getUser: combineResolvers(isAuthenticated, async args => {
        try {
            const user = await User.findById(args.userId)
            if (user) {
                const workouts = await Training.find({ creator: args.userId })
                if (workouts) return { ...user._doc, workouts }
            }
            else throw new Error("not found")
        }
        catch (error) {
            throw error
        }
    }
    ),
    createUser: async ({ email, password, name }) => {
        try {
            const existingUser = await User.findOne({ email: email })
            if (existingUser) {
                throw new Error("User already existing")
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 12)
                const user = new User({
                    email,
                    password: hashedPassword,
                    name,
                    goal: "unset",
                    photoUrl: "",
                    confirmed: false
                })
                const result = await user.save()
                result.password = "secret"
                try {
                    const emailToken = jwt.sign({ userId: result._id }, process.env.SECRET_EMAIL_TOKEN, { expiresIn: '365d' })
                    const url = `https://calm-brushlands-68977.herokuapp.com/confirmation/${emailToken}`
                    await transporter.sendMail({
                        from: 'workoutsnotebook@gmail.com',
                        to: email,
                        subject: 'Confirm Email',
                        html: `
                      <div style="display:flex;width: 240px;margin-left: auto;margin-right: auto;font-weight:700;">
                      <p style="font-size:2.0rem;color:#ffd901;">Workout</p>
                       <p style="font-size:1.5rem;
                        color:black;">Notebook</p>
                        </div>
                        <h1 style="text-align:center;color:black;">Please click this button to confirm your email</h1> 
                      <a href="${url}" style="text-decoration:none;" >
                       <div style='box-sizing:border-box;padding: 15px 65px 15px 65px; height:50px;
                        width:200px;margin: 60px auto 30px auto;background-color:#ffd901;border-radius:15px;color:black;'>Verify email</div></a> 
                        `,
                    });
                } catch (e) {
                    console.log(e);
                }
                return result

            }
        } catch (error) {
            throw error
        }
    },
    updateUser: combineResolvers(isAuthenticated, async args => {
        try {
            const user = await User.findById(args.userId)
            if (user) {
                if (args.photo !== 'null') {
                    const updateRespone = await cloudinary.uploader
                        .upload(args.photo, {
                            upload_preset: "WorkoutsNotebook"
                        })
                    user.photoUrl = updateRespone.secure_url
                }
                user.name = args.name,
                    user.goal = args.goal
                const result = await user.save()
                return { ...result._doc }
            }
            else throw new Error("user not exist")
        }
        catch (error) {
            throw error
        }
    }
    ),
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({ email: email })
            if (!user) throw new Error("Email or password is incorrect")
            if (await bcrypt.compare(password, user.password)) {
                const tokens = await createTokens(user.id, process.env.SECRET_ACCES_TOKEN, process.env.SECRET_REFRESH_TOKEN)
                return { userId: user.id, accesToken: tokens.accesToken, refreshToken: tokens.refreshToken }
            }
            else throw new Error("Email or password is incorrect")
        } catch (error) {
            throw error
        }
    }
}