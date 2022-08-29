const nodemailer = require('nodemailer');



const Email = class {
   constructor(user, url) {
      this.to = user.email;
      this.firstName = user.name.split(' ')[0];
      this.url = url || 'www.aspiration.com';
      this.from = `Aspiration`;
   }

   newTransport() {
      return nodemailer.createTransport({
         host: 'smtp.mailtrap.io',
         port: 2525,

         auth: {
            user: "de5437cccca24d",
            pass: "14aa881b095b68"
         }
      });
   }

   async send(emailText, subject) {
      // Send the actual email

      // 2) Define the email options
      const emailOptions = {
         from: this.from,
         to: this.to,
         subject,
         text: emailText
      };

      // 3) Create a transport and send email
      await this.newTransport().sendMail(emailOptions);
   }
};

const createSendEmail = (email, _name, subject, emailText) => {

    const user = {
        email,
        name: _name,
    }

    const newEmail = new Email(user, 'https://www.aspiration.com/');
    
    newEmail.newTransport();
    newEmail.send(emailText, subject);
}

// createSendEmail('kamraansharief7@mail.com', 'Kamran Sharief', 'New Message', 'Thanks for your response')


module.exports = createSendEmail;
