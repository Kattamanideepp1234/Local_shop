import nodemailer from "nodemailer";

const sendEmail= async (to, subject, text)=> {
    const transpoter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false, 
        },
    }
    )

    await transpoter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    })

}

export default sendEmail;