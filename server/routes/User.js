const express = require("express");
const { createUser, login, getAllUsers } = require("../controllers/User");

const router = express.Router();

router.post("/register",createUser);
router.post("/login",login);
router.get("/getAllUsers",getAllUsers);


module.exports = router;