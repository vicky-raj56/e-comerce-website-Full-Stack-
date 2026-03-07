import nodemailer from "nodemailer";
async function sendOTPMail(otp, email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailConfigurations = {
    // It should be a string of sender/server email
    from: process.env.MAIL_USER,

    to: email,

    // Subject of Email
    subject: "Password Reset OTP",
    html: `<p> Your OTP for Password rest is : <b> ${otp} </b> </p>`,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log("OTP Sent Successfully");
    // console.log(info);
  });
}
export default sendOTPMail;
