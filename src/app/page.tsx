export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-red-500 mb-6">
          Dojo Pop
        </h1>
        <p className="text-2xl md:text-3xl text-gray-400 mb-4">
          Proof of Practice
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          The digital dojo passport for martial arts schools. Track progress, 
          earn rewards, preserve technique.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/signup"
            className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
          >
            Join Now
          </a>
          <a
            href="/login"
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
          >
            Sign In
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">QR Check-in</h3>
              <p className="text-gray-400">
                Quick, contactless check-ins. Students scan their unique QR code to track attendance.
              </p>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Belt Tracking</h3>
              <p className="text-gray-400">
                Digital belt rank progression. Track stripes, promotions, and training history.
              </p>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">DOJO Tokens</h3>
              <p className="text-gray-400">
                Earn tokens for training. Redeem for gear, discounts, and exclusive access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Schools */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">For Martial Arts Schools</h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-red-500">Manage Your Dojo</h3>
              <ul className="space-y-2 text-gray-400">
                <li>✓ Student attendance tracking</li>
                <li>✓ Class scheduling</li>
                <li>✓ Belt promotion management</li>
                <li>✓ Instructor dashboards</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-red-500">Engage Students</h3>
              <ul className="space-y-2 text-gray-400">
                <li>✓ Gamified training rewards</li>
                <li>✓ Leaderboards</li>
                <li>✓ Video technique library</li>
                <li>✓ Direct messaging</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-red-600 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to modernize your dojo?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join the beta and be among the first to use Dojo Pop.
        </p>
        <a
          href="/signup"
          className="px-8 py-4 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Get Started Free
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-center text-gray-500">
        <div className="flex justify-center gap-6 mb-4">
          <a href="/terms" className="hover:text-white transition">Terms of Service</a>
          <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
        </div>
        <p>© 2026 Dojo Pop. All rights reserved.</p>
        <p className="mt-2">Made for martial artists, by martial artists.</p>
      </footer>
    </div>
  );
}
