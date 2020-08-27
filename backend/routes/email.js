const express = require("express");
const nodemailer = require("nodemailer");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require('dotenv').config();


const routerEmail = express.Router();

routerEmail.post("", (req, res) => {
    console.log("request came");
    let user = req.body;
    sendMail(user, info => {
        res.status(201).json({
            message: 'Email sent succesfully'
        });
    }).then(() => {
        console.log(`The mail has been sent and the id is ${info.messageId}`);
    });
});

async function sendMail(user, callback) {
       let userQuestions = [];
       let counter = 1;

        for (let i of user.answer) {
            userQuestions.push([`${counter++}.${i['questionName']} --- Answer: ${i.answer}      `]);
        }


    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    // support@tech387.com
    let mailOptions = {
        from: '"Tech387 - App Estimation"<technodemailer@gmail.com>', // sender address
        to: `support@tech387.com , ${user.usersEmail}`, // list of receivers
        subject: "Regards from Tech387 Team - Here is your app estimation", // Subject line
        html: `<h1>Hi ${user.usersName}</h1><br>
                <p>We are very happy for contacting you.</p>
                <p>We want to send you your app estimation.</p> <hr>
                <p>Estimated time for your app was ${user.estimatedTime} hours</p>
          <p>Your estimated app price was $ ${user.estimatedPrice}</p> <br>
          <p>${userQuestions}</p>
          <br><br><br>
    <h4>We can't wait to hear from you again. Cheers!!!</h4>`
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log('Error!!', err)
        } else {
            console.log('Email sent!')
        }
    });

    callback(info);
}



module.exports = routerEmail;
