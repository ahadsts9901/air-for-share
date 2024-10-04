import { Schema, model } from "mongoose";

export const dataExample = {
    isText: "boolean",
    textData: {
        text: "string"
    },
    fileData: {
        filePath: "string",
        filename: "string",
        fileSize: "number"
    },
    location: {
        latitude: "number",
        longitude: "number"
    }
}

let sharingSchema = new Schema({
    isText: {
        type: Boolean,
        required: true,
    },
    textData: {
        text: {
            type: String,
            required: true,
            minlength: 1,
            default: null
        }
    },
    fileData: {
        filePath: {
            type: String,
            required: true,
            default: null
        },
        filename: {
            type: String,
            required: true,
            default: null
        },
        fileSize: {
            type: Number,
            required: true,
            default: null
        }
    },
    location: {
        type: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        },
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

let sharingModel;

try {
    sharingModel = model('sharings');
} catch (error) {
    sharingModel = model('sharings', sharingSchema);
}

export { sharingModel };