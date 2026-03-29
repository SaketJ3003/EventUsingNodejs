const {createHmac, randomBytes} = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.pre('save', function(next){
    const user = this;

    if(!user.isModified('password')) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');
    
    this.salt = salt;
    this.password = hashedPassword;

    next;
});

userSchema.static('matchPassword', async function (email, password) {
    const user = await this.findOne({ email });
    if(!user) throw new Error("User Not Found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest('hex');

    if(hashedPassword !== userProvidedHash) {
        return null;
    }
    return user
})


const User = mongoose.model('User', userSchema);

module.exports = User;