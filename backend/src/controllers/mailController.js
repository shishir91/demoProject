// import nodemailer from "nodemailer";
const nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class MailController {
  async notifyAdmin(userEmail) {
    try {
      const mailOptions = {
        from: "shreeyanch86@gmail.com",
        to: "shresthashishir91@gmail.com",
        subject: "New Message Scheduled",
        html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #333;">🚨 New Message Scheduled</h2>
            <p style="color: #555;">
            A new message has just been scheduled by a user with email id ${userEmail}. Please review the details in the admin panel.
            </p>
            <div style="text-align: center; margin-top: 20px;">
                <a href="http://samparka.co/work" 
                style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">
                View Scheduled Messages
                </a>
            </div>
        </div>
        `,
      };
      await new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            return reject(error);
          } else {
            console.log("Email sent successfully");
            resolve(info);
          }
        });
      });

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async mailCustomers({
    user,
    pass,
    email,
    subject,
    message,
    points,
    storeName,
    customerName,
    reward,
  }) {
    try {
      let transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user,
          pass,
        },
      });
      const formattedMessage = message
        .replace("[points_earned]", points)
        .replace("[store_name]", storeName)
        .replace("[customer_name]", customerName)
        .replace("[reward_name]", reward);

      const mailOptions = {
        from: user,
        to: email,
        subject: subject,
        html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            ${formattedMessage}
        </div>
        `,
        // html: `
        //  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        //     <h2 style="color: #333;">Congratulation 🎉 </h2>
        //     <p style="color: #555;">You have received ${points} points.</p>
        //     <div style="text-align: center; margin-top: 20px;">
        //         <a href="https://${storeURL}.samparka.co/loyality"
        //         style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">
        //         View Points
        //         </a>
        //     </div>
        // </div>
        // `,
      };
      await new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            return reject(error);
          } else {
            console.log("Email sent successfully");
            resolve(info);
          }
        });
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = new MailController();
