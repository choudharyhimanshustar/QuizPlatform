const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
    const authHeader = req.headers['authorization'];
   
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (token) {
            jwt.verify(token, process.env.Secret_Key, (err, user) => {
                if (err)
                    res.status(403);
                else {
                    res.user = user;
                    res.json("Welcome")
                }
            })
        }
        else {
            res.status(401);
        }
    }

})
module.exports = router