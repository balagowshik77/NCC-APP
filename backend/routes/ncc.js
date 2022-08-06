const { registerNcc, loginNcc } = require("../controller/ncc")

const router = require("express").Router()

router.post("/register", registerNcc)
router.post("/login", loginNcc)

module.exports = router
