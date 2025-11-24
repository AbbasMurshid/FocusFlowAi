import axios from 'axios';

const BREVO_API_KEY = process.env.BREVO_API_KEY;

export const sendVerificationEmail = async (email: string, code: string) => {
    if (!BREVO_API_KEY) {
        console.error('BREVO_API_KEY is not defined');
        return;
    }

    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: {
                    name: 'FocusFlow AI',
                    email: 'no-reply@focusflow.ai', // Use a valid sender domain or the one verified in Brevo
                },
                to: [
                    {
                        email: email,
                    },
                ],
                subject: 'Verify your email address',
                htmlContent: `
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
            },
            {
                headers: {
                    'accept': 'application/json',
                    'api-key': BREVO_API_KEY,
                    'content-type': 'application/json',
                },
            }
        );

        console.log('Message sent:', response.data.messageId);

    } catch (error: any) {
        console.error('Error sending email:', error.response?.data || error.message);
    }
};
