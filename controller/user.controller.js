const userModel = require("../models/user.model");
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const sendEMail = require("../services/email_service");
const tokenModel = require("../models/token.model");
const uuid = require('uuid');

class UserController {

    validateSignupDetails = ({ fname,
        lname,
        email,
        passwordOne,
        passwordTwo})=>{

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        const passwordRegex =/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        if(!(fname && lname && email && passwordOne && passwordTwo))
        {
            return {statusCode:404,status:0,message:' Missing fields. Minimum fname,lname,email,passwordOne,passwordTwo fields are necessary.'}
        }


        if(!emailRegex.test(email))
        {
            return {statusCode:400,status:0,message:' Not a valid email.'}
        }


        if(passwordOne !== passwordTwo)
        {
            return {statusCode:400,status:0,message:'Passwords not matching!'}
        }

        console.log(passwordOne,'pasone',passwordRegex.test(passwordOne))
        if(!passwordRegex.test(passwordOne))
        {
            return {statusCode:400,status:0,message:`Password need to contain At least 8 characters long
            ,Contains at least one uppercase letter
            ,Contains at least one lowercase letter
            ,Contains at least one number`}
        }


        return {status:1,message:'valid data'}
    }
    login = async(req,res,next)=>{


        let {
            email,
            password:userLoginPassword
        } = req.body;

        console.log(req.body)

        let result = await userModel.find({email});

        console.log(result,'<--result');

        if(result && result.length == 0)
        {
            return res.status(404).send({
                message:'User does not exists.'
            })
        }


        if(result[0].password !== userLoginPassword)
        {
            return res.status(400).send({
                message:'Invalid password!'
            })
        }

        if(!result || (result && result.length == 0))
        {
            return res.status(404).send({
                message:'User not found!'
            })
        }

        let userDetails = result[0];

        let {password,...restOfUserData} = userDetails;

        const token = jwt.sign({user_id:userDetails.id}, process.env.JWT_KEY);

        

        res.status(200).send({
            message:'User logged in successfully.',
            token,
            ...restOfUserData
        })


    }
    signup = async(req,res,next)=>{


        let {
            fname,
            lname,
            email,
            passwordOne,
            passwordTwo
        } = req.body;

        console.log(req.body)

        let result = await userModel.find({email});

        let validationResult = this.validateSignupDetails({
            fname,
            lname,
            email,
            passwordOne,
            passwordTwo
        })

        console.log(validationResult,'<=== result vali')

        if(validationResult.status == 0)
        {
            return res.status(validationResult.statusCode).send({
                message:validationResult.message
            })
        }


        if(result && result.length > 0 && result.status == 'active')
        {
            return res.status(400).send({
                message:'User already present in the database.'
            })
        }

        if(result && result.length > 0 && result[0].status == 'inactive')
        {
            let deleteUserStatus = await userModel.deleteUser({
                email
            })
    
        }

        const newUuid = uuid.v4();
        let createUserStatus = await userModel.createUser({
            id:newUuid,
            fname,
            lname,
            email,
            status:'inactive',
            password:passwordOne
        })


        const token = uuid.v4();
        let activationToken = await tokenModel.createToken({
            user_id:newUuid,
            token:token,
            created_at:new Date()
        })

        if(activationToken !== 1)
        {
             return res.status(400).send({
                 message:'Something went wrong.',
             })
        }

        const activationLink = process.env.FRONTEND_URL+`/activate-account?token=${token}`;

        sendEMail({
            to:email,
            from:'borkarsaish7@gmail.com',
            subject:'Email Activation',
            text: `Please click on this link to activate your account: ${activationLink}`
        }).then((result)=>{
            console.log(result)
            console.log(email,'email sent to')
        }).catch((error)=>{
            console.log(error)
        })

         res.status(200).send({
             message:'User Created Successfully.',
         })


    }
    activateAccount = async(req,res,next)=>{


        let {
            token
        } = req.body;

        let activationToken = await tokenModel.find({
            token:token,
        })

        console.log(activationToken)

        if(activationToken && activationToken.length == 0)
        {
            return res.status(400).send({
                message:'Activation token is not valid.'
            })
        }

        if(activationToken[0].used_at !== null)
        {
            return res.status(400).send({
                message:'Activation token already used.'
            })
        }

        console.log(activationToken[0].created_at,activationToken);
//        return;
        const timestampValue = new Date();

        console.log(timestampValue,activationToken[0].created_at)

        const timestamp1 = new Date(activationToken[0].created_at); // first timestamp
        const timestamp2 = new Date(timestampValue); // second timestamp

        const differenceInMilliseconds = Math.abs(timestamp2.getTime() - timestamp1.getTime());
        console.log(differenceInMilliseconds)
        if (differenceInMilliseconds > 10 * 60 * 1000)  {
            return res.status(400).send({
        message:'Activation token has been expired.'
            })
        }


        let userDetails = await userModel.find({
            id:activationToken[0].user_id
        })

        let updateUser = await userModel.updateUser({
            status:'active'
        },{
            id:activationToken[0].user_id
        })


        let updateActivationTokenRecord = await tokenModel.updateToken({
            used_at:new Date()
        },{
           token:token
        })

        console.log(updateUser)
        if(updateUser !== 1)
        {
            return res.status(400).send({
                message:'Something went wrong. Please signup again.'
            })
    
        }

        res.status(200).send({
            message:'Account activated successfully.'
        })


    }


}



module.exports = new UserController;