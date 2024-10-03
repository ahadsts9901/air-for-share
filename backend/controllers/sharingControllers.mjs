import { errorMessages } from "../utils/errorMessages.mjs"

export const getFilesController = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: errorMessages?.serverError,
            error: error?.message
        })
    }
}