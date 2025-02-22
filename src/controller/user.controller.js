import ApiResponse from '../dto/ApiResponseCustom.js';
import * as userService from '../services/user.service.js'

export const getHello = (req, res) => {
   const responseData = userService.getHello(req, res);
   res.send(new ApiResponse(200, 'Name was custom test CD', responseData, true)); 
}