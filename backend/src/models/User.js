import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
{
name: { type: String, trim: true, required: true },
email: { type: String, unique: true, lowercase: true, required: true, index: true },
passwordHash: { type: String, required: true },
role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
avatarColor: { type: String, default: '#8b5cf6' },
},
{ timestamps: true }
);


userSchema.methods.toJSON = function () {
const obj = this.toObject();
delete obj.passwordHash;
return obj;
};


export default mongoose.model('User', userSchema);