
const generateotp =  ()=>{
     return (Math.random()*99999+100000).toFixed().toString();
}

const otphtml = (otp)=>{
     return `
<div style="max-width: 448px; margin: 40px auto; background-color: #ffffff; border: 1px solid #f3f4f6; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden; font-family: ui-sans-serif, system-ui, sans-serif; text-align: center;">
  <div style="padding: 32px;">
    <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">
      Enter this code to complete your request. Valid for <span style="font-weight: 600; color: #1f2937;">10 minutes</span>.
    </p>
    
    <div style="display: inline-block; padding: 16px 32px; background-color: #f5f3ff; border: 2px dashed #4f46e5; border-radius: 16px;">
      <span style="font-size: 32px; font-weight: 900; letter-spacing: 12px; color: #4f46e5; margin-left: 12px;">
        ${otp}
      </span>
    </div>
  </div>
  
  
</div>
`;
}

export {otphtml,generateotp}