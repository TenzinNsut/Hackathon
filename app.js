const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { fileURLToPath } = require('url');
const { fstat } = require('fs');
const { send } = require('process');

const app = express();

// multer endinge setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        // console.log(file)
        cb(null,file.fieldname + "_" + Date.now() + "_" + file.originalname)
    }
});

const upload = multer({ storage: storage }).single('image');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//static folder 
app.use(express.static(__dirname + "/public"));


// connecting pages
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
})
app.get('/apply', function (req, res) {
    res.sendFile(__dirname + "/apply.html");
})

// ------------------H O M E - P A G E---------------------

app.post('/', function (req, res) { 

    let name = req.body.name;
    let email = req.body.email
    let message = req.body.message

    let format = `
    <h1>Users Thought</h1>
    <h3>Users Details</h3>
    <ul>
    <li>Name: ${name}</li>
    <li>Email: ${email}</li>
    </ul>
    <h3>Message</h3>
    <p>${message}</p>
    `;

    
    let msg = {
        form: `${email}`,
        to: "hackathon.official4@gmail.com",
        subject: "Users thoughts",
        html: format
    }

    
    nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "hackathon.official4@gmail.com",
            pass: 'ugvypcbqhqjikmxp'
        },

        port: 465,
        host: 'smtp.gmail.com',
    })

    .sendMail(msg, (err, respose) => {
        if (err) {
            res.sendFile(__dirname + '/fail.html');
        } else {
            res.sendFile(__dirname + '/success.html');
        }
    });


});



// ------------------APPLICANTS PAGE-----------------------
app.post('/apply', function (req, res) {
  

    upload(req, res, function (err) {
        if (err) {
            return res.sendFile(__dirname + "/fail.html");
        } else {
            let name = req.body.name;
            let email = req.body.email
            let phone = req.body.phone;
            let speciality = req.body.speciality;
            let experience = req.body.experience;

            let path = req.file.path;
            let format = `
            <h1>New Application Request</h1>
       
            <h3>Applicants Details</h3>
       
            <ul>
            <li>Name: ${name}</li>
            <li>Email: ${email}</li>
            <li>Mobile Number: ${phone}</li>
            <li>Speciality: ${speciality}</li>
            <li>Experience: ${experience} years</li>
            </ul>
       
           
           `;
       
            var transpoter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "hackathon.official4@gmail.com",
                    pass: 'ugvypcbqhqjikmxp'
                },
            })

            var mailOptions = {
                form: `${email}`,
                to: "hackathon.official4@gmail.com",
                subject: "New Application Request",
                html: format,
                attachments: [
                    {
                        path: path
                    }
                ]
                
            }
            
            transpoter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    return res.sendFile(__dirname + "/fail.html")
                } else {
                    // return res.sendFile(__dirname + "/success.html")
                    fs.unlink(path, function (err) {
                        if (err) {
                            return res.sendFile(__dirname + "/fail.html")
                        } else {
                            return res.sendFile(__dirname + "/success.html")
                        }

                    });
                }
            })
        }
    });
    
});









// redirect pages

app.post('/success', function (req, res) {
    res.redirect('/');
})

app.post('/fail', function (req, res) { 
    res.redirect('/apply');
})



// ports
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`server is listening on ${port}`);
});