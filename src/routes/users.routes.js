const {Router} = require('express')


const UsersController= require('../controllers/UsersController');
const AppError = require('../utils/AppError');
const usersRoutes = Router();


function myMiddleware(req,res,next){

    if (req.body.name == null || !req.body.name ) {
        
        throw new AppError('campo obrigatorio', 400)

    } else {
        console.log('passou')
        next()
    }

}





const usersController = new UsersController()


usersRoutes.post("/", myMiddleware, usersController.create  ) 
usersRoutes.put("/:id", usersController.update)
usersRoutes.delete("/", usersController.delete)

module.exports = usersRoutes

