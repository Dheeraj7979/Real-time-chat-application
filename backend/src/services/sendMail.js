import nodemailer from 'nodemailer'

const transporter =await nodemailer.createTransport({
     secure:true,
     host:'smtp.gmail.com',
     port:465,
     auth:{
          user:process.env.EMAIL_USER,
          pass:process.env.EMAIL_PASSWORD

     }
     
});

const sendMail = async function(to,sub,msg){
     try{
          await transporter.sendMail({
          from:process.env.EMAIL_USER,
          to:to,
          subject:sub,
          html:msg
     });
     console.log(`email sent in ${to}`);

     }catch(err){
          console.log(err)
     }
}



export {sendMail}