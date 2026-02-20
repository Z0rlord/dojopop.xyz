export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last Updated: February 20, 2026</p>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Introduction</h2>
            <p>Dojo Pop ("we," "us," or "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect your personal information in compliance with GDPR (EU) and other applicable laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Information We Collect</h2>
            <h3 className="font-medium text-white mt-4 mb-1">2.1 Personal Information</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Name and contact details</strong> (email, phone)</li>
              <li><strong>Account credentials</strong> (QR codes, encrypted passwords)</li>
              <li><strong>Training data</strong> (attendance, belt rank, progress)</li>
              <li><strong>Payment information</strong> (processed by Crossmint, not stored by us)</li>
              <li><strong>Uploaded videos</strong> (technique demonstrations)</li>
            </ul>

            <h3 className="font-medium text-white mt-4 mb-1">2.2 Technical Information</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Device type and browser</li>
              <li>IP address (anonymized)</li>
              <li>Usage analytics</li>
              <li>Nostr public keys (for messaging)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. How We Use Your Information</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2">Purpose</th>
                  <th className="py-2">Legal Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-2">Provide the Service</td>
                  <td className="py-2">Contract performance</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2">Process payments</td>
                  <td className="py-2">Contract performance</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2">Send notifications</td>
                  <td className="py-2">Legitimate interest</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2">Improve the Service</td>
                  <td className="py-2">Legitimate interest</td>
                </tr>
                <tr>
                  <td className="py-2">Comply with laws</td>
                  <td className="py-2">Legal obligation</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Data Storage and Security</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Location:</strong> EU (Germany) via Neon PostgreSQL</li>
              <li><strong>Encryption:</strong> All data encrypted in transit (TLS) and at rest</li>
              <li><strong>Backups:</strong> Daily encrypted backups</li>
              <li><strong>Retention:</strong> Data kept while account is active, deleted 30 days after account closure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">5. Your Rights (GDPR)</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Access</strong> your personal data</li>
              <li><strong>Correct</strong> inaccurate data</li>
              <li><strong>Delete</strong> your data ("right to be forgotten")</li>
              <li><strong>Export</strong> your data</li>
              <li><strong>Object</strong> to processing</li>
              <li><strong>Withdraw consent</strong> at any time</li>
            </ul>
            <p className="mt-2">To exercise these rights, email: privacy@dojopop.com</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">6. Data Sharing</h2>
            <p className="mb-2">We do NOT sell your data. We share data only with:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Service providers</strong> (hosting, payment processing)</li>
              <li><strong>Legal authorities</strong> when required by law</li>
              <li><strong>Other users</strong> (only what you choose to share publicly)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">7. Third-Party Services</h2>
            <p className="mb-2">We use these third-party services:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Neon</strong> (database hosting)</li>
              <li><strong>Crossmint</strong> (payment processing)</li>
              <li><strong>Resend</strong> (email delivery)</li>
              <li><strong>Nostr relays</strong> (decentralized messaging)</li>
            </ul>
            <p className="mt-2">Each has their own privacy policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">8. Cookies and Tracking</h2>
            <p className="mb-2">We use minimal cookies:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Essential cookies:</strong> Session management, authentication</li>
              <li><strong>Analytics:</strong> Anonymous usage statistics</li>
            </ul>
            <p className="mt-2">You can disable non-essential cookies in your browser.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">9. Children&apos;s Privacy</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Users under 13 are not permitted</li>
              <li>Users 13-16 require parental consent</li>
              <li>Parents can request access to their child&apos;s data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">10. International Transfers</h2>
            <p>Data is stored in the EU. If transferred outside the EU (e.g., for disaster recovery), we ensure adequate protection via EU Standard Contractual Clauses.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">11. Data Breaches</h2>
            <p>If a data breach occurs:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>We will notify affected users within 72 hours</li>
              <li>We will report to supervisory authorities as required</li>
              <li>We will take immediate steps to secure data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">12. Changes to This Policy</h2>
            <p>We may update this policy. Significant changes will be notified via email.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">13. Contact Us</h2>
            <p><strong>Data Protection Officer:</strong></p>
            <p>Email: privacy@dojopop.com</p>
            <p className="mt-2"><strong>Supervisory Authority:</strong></p>
            <p>You have the right to complain to your local data protection authority.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">14. Consent</h2>
            <p>By using Dojo Pop, you consent to this Privacy Policy.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
