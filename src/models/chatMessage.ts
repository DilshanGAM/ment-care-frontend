import { model, models, Schema } from "mongoose";

export interface IChatMessage {
	email : String;
    message : String;
    role : String;
    img : String;
    date : Date;
}
const UserSchema = new Schema<IChatMessage>(
	{
        email : {
            type: String,
            required: true
        },
        message : {
            type: String,
            required: true
        },
        role : {
            type: String,
            required: true
        },
        img : {
            type: String,
            required: false
        },
        date : {
            type: Date,
            default: Date.now
        }
	},
	{
		timestamps: true,
		toJSON: {
			versionKey: false,
			virtuals: true,
			transform: (_, ret) => {
				delete ret._id;
			},
		},
	}
);
const ChatMessage = models.ChatMessage || model("ChatMessage", UserSchema);
export default ChatMessage;
