import { model, models, Schema } from "mongoose";

export interface IAudioDataModel {
	email : String;
    audio : String;
    date : Date;
}
const AudioDataSchema = new Schema<IAudioDataModel>(
	{
        email : {
            type: String,
            required: true
        },
        audio : {
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
const AudioData = models.AudioData || model("AudioData", AudioDataSchema);
export default AudioData;
