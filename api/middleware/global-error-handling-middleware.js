
const globalErrorHandlingMiddleware = (err,req,res,next)=>{
    console.log("error",err);
    res.status(500).json({
        message:"Internal Server Error"
    })
}


export default  globalErrorHandlingMiddleware