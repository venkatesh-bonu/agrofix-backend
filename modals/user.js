import mongoose,{ Schema,model,Types } from "mongoose";
import {hash} from 'bcrypt'

const schema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
},{
    timestamps : true
})


export const User = mongoose.models.User ||  model("User",schema);