import { model, models, Schema } from "mongoose";

export interface IHandwrittingDataModel {
	email : String;
    img : String;
    date : Date;
}
const HandWrittingDataSchema = new Schema<IHandwrittingDataModel>(
	{
        email : {
            type: String,
            required: true
        },
        img : {
            type: String,
            required: true
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
const HandWrittingData = models.HandWrittingData || model("HandWrittingData", HandWrittingDataSchema);
export default HandWrittingData;
