const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    role: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    name: {
        type: String,
    },
    surname: {
        type: String,
    },
    google: {
        type: String,
    },
    facebook: {
        type: String,
    },
    password: {
        type: String,
    },
    tel1: {
        type: String,
    },
    tel2: {
        type: String,
    },
    date: {
        type: String,
    },
    gender: {
        type: String,
    },
    scholar: {
        type: String,
    },
    country: {
        type: String,
    },
    institution: {
        type: String,
    },
    school: {
        type: String,
    },
    contact: {
        type: String,
    }
},  {
    timestamps: true
});

UserSchema.methods.encript = async password => {
    const salt = await bcrypt.genSalt(11);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.compare = async function(password){
    return await bcrypt.compare(password, this.password)
}

module.exports = model('User', UserSchema);
