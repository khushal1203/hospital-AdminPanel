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

export default transporter;