// const {hash} = require('bcryptjs')


const AppError = require('../utils/AppError')
const sqliteConnection= require('../database/sqlite')

class UsersController {

   async create(req,res) {
        const {name,email,password} = req.body
       
        const database = await sqliteConnection()
        const checkUserExists = await database.get('SELECT * FROM users WHERE email = (?)', [email])
    
        if (checkUserExists) {
            throw new AppError('Email ja existe!', 400)
        }

        // const hashedPassword = hash(password, 8)

        await database.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name,email,password])

        return res.status(201).json()
    }


    async update (req, res) {

        const {name, email, password, old_password} = req.body
        const {id}= req.params

        const database = await sqliteConnection();

        const user = await database.get("SELECT * FROM users WHERE id = (?)",[id])

        if (!user) {
            throw new AppError("Usuario nao encontrado", 400);

        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("este Email ja existe", 400)
        }

        user.name = name ?? user.name
        user.email = email ?? user.email



        if (password && !old_password){

            throw new AppError ("informe a antiga senha ", 400)
        }


        if (password == old_password){

            throw new AppError ("Informe uma senha diferente da antiga", 400)
        }


        if (password && old_password) {

            const checkOldPassword = user.password == old_password

            if (!checkOldPassword) {

                throw new AppError("Senha antiga não confere", 400)
            }

            user.password = password
        }


        await database.run (`
            UPDATE users SET 
            name = ?,
            email= ?,
            password= ?,
            updated_at = DATETIME ('NOW')
            WHERE id = ?`,
            [user.name, user.email, user.password, id]    
            )

        
     
        return res.json()
    }    



    async delete (req, res) {

        const {id, password} = req.body

        const database =  await sqliteConnection()

        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

        if (!user) {

            throw new AppError("Este usuario não existe", 400)
        }

        if (password) {

            const check = password == user.password

            if(!check){

                throw new AppError("Senha incorreta", 400)
            }
        }

        await database.get("DELETE FROM users WHERE id = (?)",[id]) 
        

        return res.json()

        
        }

    }

module.exports = UsersController;