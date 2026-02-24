export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6">
            Dojo Pop
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground mb-4">
            Your Digital Dojo Passport
          </p>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
            The modern way to track your martial arts journey. Check in with a tap, 
            earn rewards for every session, and build a permanent record of your progress 
            from white belt to black belt and beyond.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/signup"
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold transition shadow-sm"
            >
              Join Now
            </a>
            <a
              href="/login"
              className="px-8 py-4 bg-surface hover:bg-background border border-surface-border rounded-xl font-semibold transition"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* What is Dojo Pop */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">What is Dojo Pop?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Dojo Pop is a digital companion for martial arts schools and students. 
            We replace paper attendance sheets and scattered spreadsheets with one 
            beautiful, simple app that tracks everything that matters.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-background rounded-xl">
              <div className="text-3xl mb-3">🥋</div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <p className="text-sm text-muted-foreground">
                Track your attendance, see your belt progression, earn DOJO tokens 
                for consistent training, and connect with your instructors.
              </p>
            </div>
            <div className="p-6 bg-background rounded-xl">
              <div className="text-3xl mb-3">👨‍🏫</div>
              <h3 className="font-semibold mb-2">For Instructors</h3>
              <p className="text-sm text-muted-foreground">
                Manage classes, track student progress, handle belt promotions, 
                and communicate with your dojo — all in one place.
              </p>
            </div>
            <div className="p-6 bg-background rounded-xl">
              <div className="text-3xl mb-3">🏫</div>
              <h3 className="font-semibold mb-2">For Schools</h3>
              <p className="text-sm text-muted-foreground">
                Modernize your operations with QR check-ins, automated attendance 
                reports, and tools that keep students engaged and coming back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-surface rounded-xl border border-surface-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">QR Check-in</h3>
              <p className="text-muted-foreground">
                Quick, contactless check-ins. Students scan their unique QR code to track attendance.
              </p>
            </div>

            <div className="p-6 bg-surface rounded-xl border border-surface-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Belt Tracking</h3>
              <p className="text-muted-foreground">
                Digital belt rank progression. Track stripes, promotions, and training history.
              </p>
            </div>

            <div className="p-6 bg-surface rounded-xl border border-surface-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">DOJO Tokens</h3>
              <p className="text-muted-foreground">
                Earn tokens for training. Redeem for gear, discounts, and exclusive access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Ready to modernize your dojo?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join the beta and be among the first to use Dojo Pop.
          </p>
          <a
            href="/signup"
            className="px-8 py-4 bg-background text-primary rounded-xl font-semibold hover:bg-surface transition shadow-sm"
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-surface text-center">
        <div className="flex justify-center gap-6 mb-4">
          <a href="/terms" className="text-muted-foreground hover:text-foreground transition">Terms of Service</a>
          <a href="/privacy" className="text-muted-foreground hover:text-foreground transition">Privacy Policy</a>
        </div>
        <p className="text-muted-foreground">© 2026 Dojo Pop. All rights reserved.</p>
        <p className="mt-2 text-sm text-muted">Made for martial artists, by martial artists.</p>
      </footer>
    </div>
  );
}
