import { isValidObjectId } from "mongoose"
import { sharingModel } from "../models/sharingModel.mjs"
import { errorMessages } from "../utils/errorMessages.mjs"

// text controllers
export const sendTextController = async (req, res, next) => {

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

// file controllers
export const sendFilesController = async (req, res, next) => {

    const { latitude, longitude } = req?.body
    const { files } = req

    if (!files || !files?.length || !files[0]) {
        return res.status(400).send({
            message: errorMessages?.filesReqiured
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
        const payload = files?.map((file) => {
            return {
                isText: false,
                textData: { text: null },
                fileData: {
                    filePath: file?.path,
                    filename: file?.originalname,
                    fileSize: file?.size
                },
                location: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                },
            }
        })

        const resp = await sharingModel.create(payload)

        console.log("payload", payload)

        return res.send({
            message: errorMessages?.fileSaved
        })

    } catch (error) {
        console.error(error)
        return res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }
}

export const getFilesController = async (req, res, next) => {

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
        const nearbyFiles = await sharingModel.find({
            isText: false,
            location: {
                $geoWithin: {
                    $centerSphere: [[+longitude, +latitude], 100 / 6378.1]
                }
            }
        })

        if (!nearbyFiles) {
            return res.status(404).send({
                message: errorMessages?.noNearbyFiles
            });
        }

        return res.send({
            message: errorMessages?.filesFetched,
            data: nearbyFiles
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        });
    }

}

export const removeFileController = async (req, res, next) => {

    const { latitude, longitude } = req?.query;
    const { docId } = req?.params

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

    if (!docId || docId?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.idIsReqiured
        });
    }

    if (!isValidObjectId(docId)) {
        return res.status(400).send({
            message: errorMessages?.idInvalid
        });
    }

    try {

        const doc = await sharingModel.findOne({
            _id: docId,
            isText: true,
            location: {
                $geoWithin: {
                    $centerSphere: [[+longitude, +latitude], 100 / 6378.1]
                }
            }
        })

        if (!doc) {
            return res.status(401).send({
                message: errorMessages?.unAuthError
            })
        }

        const deleteResp = await sharingModel.findByIdAndDelete(docId)

        return res.send({
            message: errorMessages?.filesCleared,
        });

    } catch (error) {
        console.error(error)
        return res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }
}

// 03051938181