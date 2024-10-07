import { isValidObjectId } from "mongoose"
import moment from "moment"
import { sharingModel } from "../models/sharingModel.mjs"
import { errorMessages } from "../utils/errorMessages.mjs"
import { removeFileFromPath } from "../utils/functions.mjs"
import { __dirname } from "../server.mjs"
import fs from "fs"
import _path from "path"
import { _1gbSize } from "../utils/core.mjs"

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

        const totalFileSize = files.reduce((sum, file) => sum + file.size, 0)

        if (totalFileSize > _1gbSize) {
            return res.status(403).send({
                message: errorMessages?.fileSizeExceeded
            })
        }

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

    const { latitude, longitude, path } = req?.query;
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

    if (!path || path?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.noPath
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
            isText: false,
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

        await removeFileFromPath(doc?.fileData?.filePath)

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

export const downloadFilecontroller = async (req, res, next) => {

    const { path, filename } = req?.query

    if (!path || path?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.noPath
        });
    }

    if (!filename || filename?.trim() === "") {
        return res.status(400).send({
            message: errorMessages?.noFilename
        });
    }

    try {
        const fullPath = _path.resolve(__dirname, path);

        if (!fs.existsSync(fullPath)) {
            return res.status(404).send({
                message: 'file not found'
            });
        }

        const fileData = fs.readFileSync(fullPath);
        const base64File = fileData.toString('base64');

        res.send({
            message: errorMessages?.filesFetched,
            data: {
                base64: base64File,
                filename: filename
            }
        })

    } catch (error) {
        console.error(error)
        return res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }
}

export const autoDeleteFilesController = async (req, res, next) => {
    try {
        const fiveMinutesAgo = moment().subtract(5, 'minutes').toDate();
        const query = { createdOn: { $lt: fiveMinutesAgo }, isText: false };

        const allFiles = await sharingModel.find(query).select("fileData");

        await Promise.all(allFiles.map(async (file) => {
            await removeFileFromPath(file?.fileData?.filePath);
        }));

        await sharingModel.deleteMany(query);

        res.send({
            message: errorMessages?.filesDeleted
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        });
    }
};