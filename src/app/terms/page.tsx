export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last Updated: February 20, 2026</p>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using Dojo Pop (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Description of Service</h2>
            <p className="mb-2">Dojo Pop is a martial arts school management platform that provides:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Student attendance tracking via QR code and NFC</li>
              <li>Belt rank progression tracking</li>
              <li>Digital token rewards (DOJO tokens)</li>
              <li>Video technique library</li>
              <li>Messaging between instructors and students</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. User Accounts</h2>
            <h3 className="font-medium text-white mt-4 mb-1">3.1 Eligibility</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>You must be at least 13 years old to use the Service</li>
              <li>Students under 18 must have parental consent</li>
              <li>Martial arts schools must be legally registered entities</li>
            </ul>

            <h3 className="font-medium text-white mt-4 mb-1">3.2 Account Security</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>You are responsible for maintaining your QR code and login credentials</li>
              <li>Do not share your authentication credentials with others</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Acceptable Use</h2>
            <p className="mb-2">You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Use the Service for any illegal purpose</li>
              <li>Upload inappropriate or violent content (outside martial arts context)</li>
              <li>Harass, abuse, or intimidate other users</li>
              <li>Attempt to hack or disrupt the Service</li>
              <li>Share another user&apos;s personal information without consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">5. Content and Data</h2>
            <h3 className="font-medium text-white mt-4 mb-1">5.1 Your Content</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>You retain ownership of videos and content you upload</li>
              <li>You grant us license to store and display this content within the Service</li>
              <li>Do not upload copyrighted material you don&apos;t own</li>
            </ul>

            <h3 className="font-medium text-white mt-4 mb-1">5.2 Data Storage</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Training attendance data is stored securely</li>
              <li>Video content may be archived for technique preservation</li>
              <li>Data is stored in the EU (Germany) via Neon PostgreSQL</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">6. DOJO Tokens</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>DOJO tokens are digital rewards with no monetary value</li>
              <li>Tokens cannot be exchanged for cash</li>
              <li>We reserve the right to modify the token system at any time</li>
              <li>Tokens may be revoked for violations of these terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">7. Payments</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Some features require payment via Crossmint</li>
              <li>All payments are processed securely</li>
              <li>Refunds are handled on a case-by-case basis</li>
              <li>Subscription fees are billed in advance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">8. Termination</h2>
            <p className="mb-2">We may suspend or terminate your account for:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Violation of these terms</li>
              <li>Fraudulent activity</li>
              <li>Non-payment of fees</li>
              <li>Extended inactivity (12+ months)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">9. Limitation of Liability</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The Service is provided &quot;as is&quot; without warranties</li>
              <li>We are not liable for injuries sustained during martial arts training</li>
              <li>We are not responsible for disputes between dojos and students</li>
              <li>Maximum liability is limited to fees paid in the last 12 months</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">10. Changes to Terms</h2>
            <p>We may update these terms at any time. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">11. Governing Law</h2>
            <p>These terms are governed by the laws of Poland. Disputes will be resolved in Warsaw courts.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">12. Contact</h2>
            <p>For questions about these terms, contact: legal@dojopop.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
