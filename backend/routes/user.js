const router = require("express").Router()
const { getUser, getUsers, login, register, deleteUser } = require('../controller/user')
const { isAdmin, auth } = require("../middleware/auth")

router.post("/register", register)
router.post("/login", login)
router.get("/", isAdmin,getUsers)
router.get("/:id", auth, getUser)
router.delete("/:id", auth, deleteUser)

module.exports = router
