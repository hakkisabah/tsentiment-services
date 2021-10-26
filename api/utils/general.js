exports.genRes = function (data, statusCode, errors) {
    statusCode = statusCode || 200;
    errors = errors || [];

    return {
        data: data || null,
        statusCode,
        errors
    }
};