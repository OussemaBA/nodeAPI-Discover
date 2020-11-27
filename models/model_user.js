import mongoose from 'mongoose';
import uuidv1 from 'uuid/v1';
import crypto from 'crypto';
const ObjectId =mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    
    name: {
        first: {
            type: String,
            required:true
        },
        last: {
            type: String,
            required:true
        },
        middle: {
            type: String,
            required:true
        },
    },
    hashed_password: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["male", "Female"],
    },
    age: Number,
    email: {
        type: String,
        required: ["email"],
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now,
    },
    update: Date,
    photo:{
          data:Buffer,
          contentType:String
    },
    about:{
            type:String,
            trim:true
    },
    following:[{type:ObjectId,ref:"User"}],
    followers:[{type:ObjectId,ref:"User"}],
    resetPasswordLink: {
        data: String,
        default: ""
    }

    
    /* education: {
         type: String,
         required: true
     },
     experience: [{
         type: String,
         detail: {
             position: String,
             company: String,
         }
     }],*/

});


userSchema.virtual('password')
    .get(function () {

        return this._password;
    })
    .set(function (password) {
        this._password = password;

        this.salt = uuidv1();

        this.hashed_password = this.encryptPassword(password);
    })


userSchema.methods = {

    authenticate:function(plainText){
        return this.encryptPassword(plainText)==this.hashed_password;
    },

    encryptPassword: function (password) {
        if (!password) return "";

        try {

            return crypto.createHmac('sha256', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return err;
        }

    }
}

export default mongoose.model("User", userSchema);