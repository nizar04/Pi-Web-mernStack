const express = require('express');
const router = express.Router();
const gravatar =  require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const {check,validationResult} = require('express-validator');
const User = require('../../model/User');
const nodemailer = require('nodemailer');
const randomstring = require ('randomstring');
const mailer = require('../../misc/mailer');
const transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/',[
    check('name', 'name is required').not().isEmpty(),
    check('email', 'please include a valid email').isEmail(),
    check('password', 'enter a password with 6 or greater').isLength({min:6})
], async(req, res) => {

   const errors = validationResult(req);
   if(!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
   }
const {name, email, password} = req.body;
try {
    //see if user exists
let user = await User.findOne({ email});
if(user){
   return res.status(400).json({errors: [{msg: 'user already exists'}]});
}

    //Get users gravatar
const avatar= gravatar.url(email,{
    s:'200',
    r:'pg',
    d:'mm'
});
user = new User({
    name,
    email,
    avatar,
    password
});
    //encrypt passsword
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(password, salt);
// generate secret token 
const secretToken = randomstring.generate(6);
user.secretToken =secretToken;
await user.save();
//send email

const html = `hi there, 
<br/>
thank you for regestering!
<br/><br/>
please verify you account<br/>
Token <b>${secretToken}</b>
<a href ="http://localhost:3000/verify">http://localhost:3000/verify</a>`;
   

await mailer.sendMail('nizar.mejri@esprit.tn',user.email,'please verify your account',html)

//return json webtoken
    const payload = {
        user:{
            id: user.id
        }
    }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err,token) => {
            if(err) throw err;
            res.json({token});
            }
            );

}catch(err){
    console.error(err.message);
    res.status(500).send('server  error');

}

});
module.exports = router;