const sgMail = require('@sendgrid/mail')

const dotenv = require('dotenv');
dotenv.config();


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEMail = async({
    to,
    from,
    subject,
    text,
    html
})=>
{
    const msg = {
        to,
        from,
        subject,
        text,
        html
    }
      sgMail
        .send(msg)
        .then((result) => {
          console.log('Email sent',result)
        })
        .catch((error) => {
          console.error(error)
        })
}


module.exports  = sendEMail;