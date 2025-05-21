import { model, models, Schema } from "mongoose";

export interface IUsers {
	email : String;
    password : String;
    firstName : String;
    lastName : String;
    phone : String;
    type : String;
    diseases : String[];
    image : String;
}
const UserSchema = new Schema<IUsers>(
	{
        email : {
            type: String,
            required: true,
            unique: true
        },
        password : {
            type: String,
            required: true
        },
        firstName : {
            type: String,
            required: true
        },
        lastName : {
            type: String,
            required: true
        },
        type : {
            type: String,
            required: true,
            enum: ["patient", "doctor", "admin"],
            default: "patient"
        },
        diseases : {
            type: [String],
            required: false,
            default: []
        },
        image : {
            type: String,
            required: false
        },
        phone : {
            type: String,
            required: true
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
const User = models.Users || model("Users", UserSchema);
export default User;
