
import  {NotFoundError,UnauthorizedError,ValidationError} from '../domain/errors/index.js'

const globalErrorHandlingMiddleware = (error,req,res,next)=> {
    if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({
            code:error.statusCode,
            message: error.message
        })
    } else if (error instanceof ValidationError) {
        res.status(error.statusCode).json({
            code:error.statusCode,
            message: error.message
        })
    } else if (error instanceof UnauthorizedError) {
        res.status(error.statusCode).json({
            code:error.statusCode,
            message: error.message
        })
        res.status(500).json({
            code:error.statusCode,
            message: "Internal Server Error"
        })
    }
}


export default  globalErrorHandlingMiddleware