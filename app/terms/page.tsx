'use client';

import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function TermsPage() {
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
                            Terms and Conditions
                        </h1>
                        <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="glass-card p-8 md:p-12 space-y-8 text-gray-300">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                            <p>
                                Welcome to FocusFlow AI. By accessing our website and using our services, you agree to be bound by these Terms and Conditions. Please read them carefully.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Intellectual Property Rights</h2>
                            <p>
                                Other than the content you own, under these Terms, AbbasMurshid and/or its licensors own all the intellectual property rights and materials contained in this Website.
                            </p>
                            <p className="mt-2">
                                You are granted limited license only for purposes of viewing the material contained on this Website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Restrictions</h2>
                            <p>You are specifically restricted from all of the following:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Publishing any Website material in any other media;</li>
                                <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
                                <li>Publicly performing and/or showing any Website material;</li>
                                <li>Using this Website in any way that is or may be damaging to this Website;</li>
                                <li>Using this Website in any way that impacts user access to this Website;</li>
                                <li>Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;</li>
                                <li>Engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Your Content</h2>
                            <p>
                                In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant AbbasMurshid a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. No Warranties</h2>
                            <p>
                                This Website is provided "as is," with all faults, and AbbasMurshid express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                            <p>
                                In no event shall AbbasMurshid, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. AbbasMurshid, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Indemnification</h2>
                            <p>
                                You hereby indemnify to the fullest extent AbbasMurshid from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">8. Severability</h2>
                            <p>
                                If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">9. Variation of Terms</h2>
                            <p>
                                AbbasMurshid is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">10. Assignment</h2>
                            <p>
                                The AbbasMurshid is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">11. Entire Agreement</h2>
                            <p>
                                These Terms constitute the entire agreement between AbbasMurshid and you in relation to your use of this Website, and supersede all prior agreements and understandings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law & Jurisdiction</h2>
                            <p>
                                These Terms will be governed by and interpreted in accordance with the laws of the State of Country, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Country for the resolution of any disputes.
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
