import { Document, model, Schema } from 'mongoose';

export const User = model('User', new Schema({

}));

export interface UserDocument extends Document {

}
