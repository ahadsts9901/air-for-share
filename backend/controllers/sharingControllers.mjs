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

        const deleteTextResp = await sharingModel.deleteMany({
            isText: true,
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], 100 / 6378.1]
                }
            }
        })

        const payload = {
            isText: true,
            textData: { text: text },
            fileData: { filePath: null, filename: null, fileSize: null },
            location: {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
        };

        const resp = await sharingModel.create(payload)

        return res.send({
            message: errorMessages?.textSaved
        })

    } catch (error) {
        console.error(error)
        return res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }
}

export const getTextController = async (req, res, next) => {

    const { latitude, longitude } = req?.query;

    if (!latitude) {
        return res.status(400).send({
            message: errorMessages?.noLatitude
        });
    }

    if (!longitude) {
        return res.status(400).send({
            message: errorMessages?.noLongitude
        });
    }

    try {
        const nearbyText = await sharingModel.findOne({
            isText: true,
            location: {
                $geoWithin: {
                    $centerSphere: [[+longitude, +latitude], 100 / 6378.1]
                }
            }
        }).sort({ _id: -1 })

        if (!nearbyText) {
            return res.status(404).send({
                message: errorMessages?.noNearbyText
            });
        }

        return res.send({
            message: errorMessages?.textFetched,
            data: nearbyText
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        });
    }

}

export const removeTextController = async (req, res, next) => {

    const { latitude, longitude } = req?.query;

    if (!latitude) {
        return res.status(400).send({
            message: errorMessages?.noLatitude
        });
    }

    if (!longitude) {
        return res.status(400).send({
            message: errorMessages?.noLongitude
        });
    }

    try {

        const deleteTextResp = await sharingModel.deleteMany({
            isText: true,
            location: {
                $geoWithin: {
                    $centerSphere: [[+longitude, +latitude], 100 / 6378.1]
                }
            }
        })

        return res.send({
            message: errorMessages?.textCleared,
        });

    } catch (error) {
        console.error(error)
        return res.status(500).send({
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