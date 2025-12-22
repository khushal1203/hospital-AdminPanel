import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendWelcomeEmail = async (email, fullName, password) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Hospital Admin Panel - Account Created Successfully',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Hospital Admin Panel</h1>
                    <p>Your account has been created successfully!</p>
                </div>
                
                <div class="content">
                    <h2>Hello ${fullName},</h2>
                    
                    <p>Congratulations! Your account for the Hospital Admin Panel has been created successfully. You now have access to our comprehensive hospital management system.</p>
                    
                    <div class="credentials">
                        <h3>Your Login Credentials:</h3>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Password:</strong> ${password}</p>
                    </div>
                    
                    <p><strong>Important Security Notice:</strong> Please change your password after your first login for security purposes.</p>
                    
                    <h3>What you can do with your account:</h3>
                    <ul>
                        <li>Manage donor information and profiles</li>
                        <li>Track document uploads and processes</li>
                        <li>Monitor hospital operations</li>
                        <li>Generate comprehensive reports</li>
                        <li>Access real-time updates and notifications</li>
                    </ul>
                    
                    <div style="text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_API_END_POINT?.replace('/api', '') || 'http://localhost:3000'}/auth/sign-in" class="button">Login to Your Account</a>
                    </div>
                    
                    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                    
                    <p>Best regards,<br>
                    Hospital Admin Panel Team</p>
                </div>
                
                <div class="footer">
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; 2024 Hospital Admin Panel. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully to:', email);
        return { success: true };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

export const sendPasswordResetEmail = async (email, fullName, resetUrl) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request - Hospital Admin Panel',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
                .container { max-width: 500px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 2px solid #e5e7eb; }
                .header { background: #402575; color: white; padding: 30px 25px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
                .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
                .content { padding: 30px 25px; background: #f8fafc; }
                .greeting { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 15px; }
                .message { font-size: 15px; color: #9ca3af; margin-bottom: 25px; line-height: 1.6; }
                .reset-box { background: white; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0; border: 1px solid #e5e7eb; }
                .reset-box h3 { margin: 0 0 10px 0; font-size: 16px; color: #1f2937; }
                .reset-box p { margin: 0 0 20px 0; color: #6b7280; font-size: 13px; }
                .button { display: inline-block; background: #402575; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; }
                .footer { text-align: center; padding: 20px; background: #f9fafb; color: #6b7280; font-size: 12px; }
                .footer p { margin: 3px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Password Reset</h1>
                    <p>Reset your account password</p>
                </div>
                
                <div class="content">
                    <div class="greeting">Hello ${fullName},</div>
                    
                    <div class="message">
                        Click the button below to reset your password for Hospital Admin Panel.
                    </div>
                    
                    <div class="reset-box">
                        <h3>Reset Your Password</h3>
                        <p>Link expires in 10 minutes</p>
                        <a href="${resetUrl}" class="button">Reset Password</a>
                    </div>
                    
                    <div class="message">
                        If you didn't request this, please ignore this email.
                    </div>
                    
                    <div class="message">
                        Best regards,<br>
                        <strong>Hospital Admin Panel Team</strong>
                    </div>
                </div>
                
                <div class="footer">
                    <p>This is an automated email. Please do not reply.</p>
                    <p>&copy; 2024 Hospital Admin Panel. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully to:', email);
        return { success: true };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, error: error.message };
    }
};

export default transporter;