'use client';

import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen px-4 py-20 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl float-animation"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-12">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
                            <SparklesIcon className="w-6 h-6 text-accent" />
                            <span className="text-xl font-bold font-heading">FocusFlow AI</span>
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                            Privacy & Security Policy
                        </h1>
                        <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="glass-card p-8 md:p-12 space-y-8 text-gray-300">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                            <p>
                                We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, and any other information you choose to provide.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                            <p>
                                We use the information we collect to provide, maintain, and improve our services, such as to:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Create and maintain your account;</li>
                                <li>Process your transactions and send related information;</li>
                                <li>Send you technical notices, updates, security alerts, and support messages;</li>
                                <li>Respond to your comments, questions, and requests;</li>
                                <li>Personalize and improve the services and provide content or features that match user profiles or interests.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
                            <p>
                                We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. We use industry-standard encryption to protect your data in transit and at rest.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Data Retention</h2>
                            <p>
                                We store the information we collect about you for as long as is necessary for the purpose(s) for which we originally collected it. We may retain certain information for legitimate business purposes or as required by law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Sharing of Information</h2>
                            <p>
                                We do not share your personal information with third parties except as described in this policy. We may share your information with:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Vendors, consultants, and other service providers who need access to such information to carry out work on our behalf;</li>
                                <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process;</li>
                                <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of FocusFlow AI or others.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
                            <p>
                                You have the right to access, correct, or delete your personal information. You can access and update your profile information through your account settings. If you wish to delete your account, you may do so through the settings page or by contacting us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Changes to this Policy</h2>
                            <p>
                                We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our homepage or sending you a notification).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at support@focusflownor.work.gd.
                            </p>
                        </section>
                    </div>

                    <div className="mt-8 text-center">
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
