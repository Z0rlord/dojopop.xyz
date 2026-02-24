export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="py-4 px-6 border-b border-surface-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">DP</span>
            </div>
            <span className="font-bold text-lg">Dojo Pop</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-muted-foreground hover:text-foreground transition">Sign In</a>
            <a 
              href="/signup" 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6">
            <span>🥋</span>
            <span>Now in beta — Join 3 schools already using Dojo Pop</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your martial arts journey,
            <span className="text-primary"> digitized</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Replace paper attendance sheets and scattered notes with one beautiful app. 
            Track every session, celebrate every promotion, and build a permanent record 
            of your progress from white belt to black belt.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-hover transition shadow-lg shadow-primary/20"
            >
              Start Your Free Account
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-surface text-foreground border border-surface-border rounded-xl font-semibold hover:bg-background transition"
            >
              See How It Works
            </a>
          </div>
          
          <p className="text-sm text-muted mt-4">No credit card required. Free for students.</p>
        </div>
      </section>

      {/* App Preview / Demo */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="bg-background rounded-2xl p-8 shadow-xl border border-surface-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Check in with a tap</h2>
                <p className="text-muted-foreground mb-6">
                  No more paper sign-in sheets. Students scan their personal QR code 
                  to check in — it takes 2 seconds and works even without internet.
                </p>
                <ul className="space-y-3">
                  {[
                    "Unique QR code for every student",
                    "NFC tap support on modern phones",
                    "Offline mode stores check-ins locally",
                    "Automatic attendance tracking"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-accent/20 text-accent rounded-full flex items-center justify-center text-xs">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-surface rounded-xl p-6 border border-surface-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <p className="font-semibold">Tom Jones</p>
                    <p className="text-sm text-muted-foreground">Blue Belt • 3 Stripes</p>
                  </div>
                </div>
                
                <div className="bg-background rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="font-bold text-accent">12 sessions</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Current Streak</span>
                    <span className="font-bold text-primary">5 days 🔥</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">DOJO Tokens</span>
                    <span className="font-bold">340 ⭐</span>
                  </div>
                </div>
                
                <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium">
                  Check In Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to run a modern dojo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From attendance tracking to belt promotions, Dojo Pop handles the paperwork 
              so you can focus on teaching.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📱",
                title: "QR Check-ins",
                description: "Students scan their unique code. No apps to install, works on any phone."
              },
              {
                icon: "🥋",
                title: "Belt Tracking",
                description: "Digital belt progression with stripes, promotions, and history."
              },
              {
                icon: "⭐",
                title: "DOJO Tokens",
                description: "Gamified rewards for attendance, streaks, and achievements."
              },
              {
                icon: "📹",
                title: "Video Library",
                description: "Upload technique videos. Students earn tokens for sharing knowledge."
              },
              {
                icon: "💬",
                title: "Direct Messaging",
                description: "Encrypted chat between instructors and students via Nostr."
              },
              {
                icon: "🏆",
                title: "Leaderboards",
                description: "Monthly competitions with token prizes for top performers."
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-surface rounded-xl border border-surface-border hover:border-primary/50 transition">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Whom */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Built for every martial artist</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧑‍🎓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">For Students</h3>
              <p className="text-muted-foreground">
                Track your journey, earn rewards for consistent training, 
                and connect with your dojo community.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">For Instructors</h3>
              <p className="text-muted-foreground">
                Manage classes, track student progress, handle promotions, 
                and communicate with your students.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏫</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">For School Owners</h3>
              <p className="text-muted-foreground">
                Modernize operations, reduce admin work, and keep students 
                engaged with gamification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to modernize your dojo?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join schools already using Dojo Pop to track attendance, 
            engage students, and grow their community.
          </p>
          
          <a
            href="/signup"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-hover transition shadow-lg shadow-primary/20"
          >
            Get Started Free
          </a>
          
          <p className="text-sm text-muted mt-4">Free for students. Schools pay only for advanced features.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-surface border-t border-surface-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">DP</span>
                </div>
                <span className="font-bold">Dojo Pop</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The digital dojo passport for martial arts schools.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/terms" className="hover:text-foreground transition">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-foreground transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition">GDPR</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition">Discord</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-surface-border text-center text-sm text-muted-foreground">
            <p>© 2026 Dojo Pop. Made for martial artists, by martial artists.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
