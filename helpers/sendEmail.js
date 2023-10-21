import nodemailer from 'nodemailer';


const {
    NODEMAILER_USER, 
    NODEMAILER_PASSWORD 
} = process.env; 

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASSWORD ,
 },
};    

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
    console.log(data)
    const email = { ...data, from: NODEMAILER_USER};

    await transport.sendMail(email);
    return true;
};
  
export default sendEmail;
