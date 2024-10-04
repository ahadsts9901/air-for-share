import { sharingModel } from "../models/sharingModel.mjs"
import { errorMessages } from "../utils/errorMessages.mjs"

export const sendTextController = async (req, res, next) => {

    // {
    //     isText: "boolean",
    //         textData: {
    //         text: "string"
    //     },
    //     fileData: {
    //         filePath: "string",
    //             filename: "string",
    //                 fileSize: "number"
    //     },
    //     location: {
    //         latitude: "number",
    //             longitude: "number"
    //     }
    // }

    const { text, latitude, longitude } = req?.body

    if (!text || text?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.noTextProvided
        })
    }

    if (!latitude) {
        return res.status(400).send({
            message: errorMessages?.noLatitude
        })
    }

    if (isNaN(latitude)) {
        return res.status(400).send({
            message: errorMessages?.invalidLatitude
        })
    }

    if (!longitude) {
        return res.status(400).send({
            message: errorMessages?.noLongitude
        })
    }

    if (isNaN(longitude)) {
        return res.status(400).send({
            message: errorMessages?.invalidLongitude
        })
    }

    try {

        const payload = {
            isText: true,
            textData: { text: text },
            location: { latitude: latitude, longitude: longitude }
        }

        const resp = await sharingModel.create(payload)

        return res.send({
            message: errorMessages?.textSaved
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }
}

export const _ = async (req, res, next) => {
    try {

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }
}