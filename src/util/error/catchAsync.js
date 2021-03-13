/**
 * catchAsync function
 * 
 * used by: * file
 * descriptions: get ride of try catch blocks
 * usage: combine with AppError
 *  const anAsyncFunc = catchAsync(async function(req, res, next){
 *      //code
 *      if(someError) return next(new AppError(...));
 *      //code
 *  });
 */
module.exports = catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};