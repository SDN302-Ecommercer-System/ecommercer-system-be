import ApiResponse from "../dto/ApiResponseCustom.js";

export const verifyName = (req, res, next) => {
   const {name} = req.body;

   if (!name) {
        res.send(new ApiResponse(400, 'Name is required', null, false));
        return;
   }
   next();
}

