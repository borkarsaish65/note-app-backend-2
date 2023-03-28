const userModel = require("../models/user.model");
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const noteModel = require("../models/note.model");
const uuid = require('uuid');


class NoteController {

    createNote = async(req,res,next)=>{
        let {
            title,
            note
        } = req.body;

        let {
            user_id
        } = req;

        const newUuid = uuid.v4();
        let result = await noteModel.createNote({
            id:newUuid,
            title,
            text:note,
            user_id
        })

        console.log(result,'<==')


        if(result == 1){

            res.status(200).send({
                ...{
                    id:newUuid,
                    title,
                    text:note,
                    user_id
                },
                message:'Note added successfully.'
            })
    
        }


    }
    viewAllNotes = async(req,res,next)=>{


        let {
            user_id
        } = req;

        console.log(req.body)
        
        let allNotes = await noteModel.find({user_id});


        res.status(200).send({
            notes:allNotes
        })


    }
    editNote = async(req,res,next)=>{


        let {
            user_id
        } = req;

        let {
            id
        } = req.params;
        let {
            note,
            title
        } = req.body;

        let updateObj = {
            text:note,
            title
        };


        let noteData = await noteModel.find({id,user_id});

        if(!noteData)
        {
            res.status(404).send({
                message:'note not found!'
            })
        }

        for(let key in updateObj)
        {
            if(updateObj[key] == undefined)
            {
                delete updateObj[key];
            }
        }
        
        let result = await noteModel.editNotes({
            ...updateObj
        },{
            user_id,
            id
        })

        console.log(result,'<--result');

        if(!result)
        {
            res.status(404).send({
                message:'Updation failed'
            })
        }

        if(result == 1)
        {
            res.status(200).send({
                message:'Changes saved in the database.'
            })
        }

    }
    deleteNote = async(req,res,next)=>{


        let {
            id
        } = req.params;

        let {
            user_id
        } = req;

        console.log(req.body)
        
        let result = await noteModel.find({id,user_id});

        console.log(result,'<--result');

        if(result.length == 0)
        {
            res.status(404).send({
                message:'Note not found!'
            })
        }


        let deleteStatus = await noteModel.deleteNotes({
            user_id,
            id
        })

        if(deleteStatus == 1)
        {
            res.status(200).send({
                message:'Note deleted Successfully.'
            })
        }


    }


}



module.exports = new NoteController;