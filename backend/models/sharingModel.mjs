import { Schema, model } from "mongoose";

let sharingSchema = new Schema({
    isText: {
        type: Boolean,
        required: true,
    },
    textData: {
        text: {
            type: String,
            minlength: 1,
            default: null
        }
    },
    fileData: {
        filePath: {
            type: String,
            default: null
        },
        filename: {
            type: String,
            default: null
        },
        fileSize: {
            type: Number,
            default: null
        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

sharingSchema.index({ location: '2dsphere' });
let sharingModel;

try {
    sharingModel = model('sharings');
} catch (error) {
    sharingModel = model('sharings', sharingSchema);
}

export { sharingModel };