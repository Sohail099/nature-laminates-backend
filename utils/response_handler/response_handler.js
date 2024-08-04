module.exports.response_handler= (res, error)=>{
    res.status(500).json({
        statusCode:500,
        status:`error`,
        message:error.message
    });
}

