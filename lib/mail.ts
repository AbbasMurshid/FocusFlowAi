import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (email: string, code: string) => {
    // If no SMTP credentials, log the code (for dev/demo)
    if (!process.env.SMTP_USER || process.env.SMTP_USER.includes('your-email')) {
        console.log('====================================================');
        console.log(`[DEV] Verification Code for ${email}: ${code}`);
        console.log('====================================================');
        return; // Don't attempt to send if no real credentials
    }

    try {
        const info = await transporter.sendMail({
            from: `"FocusFlow AI" <${process.env.SMTP_FROM || 'focusflowai.noreply@gmail.com'}>`,
            to: email,
            subject: 'Verify your email address',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Verify your email</h2>
                    <p>Thanks for signing up for FocusFlow AI! Please use the following code to verify your email address:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #6C5CE7;">${code}</span>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                </div>
            `,
        });

        console.log('Message sent: %s', info.messageId);

        // Preview only available when sending through an Ethereal account
        if (nodemailer.getTestMessageUrl(info)) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw, just log. We don't want to crash the request if email fails in dev.
        // In prod, you might want to handle this differently.
    }
};
