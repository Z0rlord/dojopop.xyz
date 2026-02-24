import Link from "next/link";

// Hard-edge button component
function Button({ 
  href, 
  children, 
  variant = "primary" 
}: { 
  href: string; 
  children: React.ReactNode; 
  variant?: "primary" | "secondary";
}) {
  const baseClasses = "inline-block uppercase tracking-[0.2em] text-sm font-bold px-8 py-4 border-2 border-neutral-950 transition-colors duration-150 active:translate-x-[1px] active:translate-y-[1px]";
  
  const variantClasses = variant === "primary" 
    ? "bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950"
    : "bg-transparent text-neutral-950 hover:bg-neutral-950 hover:text-neutral-50";

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </Link>
  );
}

// Section divider
function SectionDivider() {
  return <div className="border-t-2 border-neutral-900 w-full" />;
}

// Tile component
function Tile({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="border-2 border-neutral-900 p-6 bg-surface">
      <span className="text-xs uppercase tracking-[0.2em] font-semibold text-accent">{number}</span>
      <h3 className="font-heading text-xl font-bold mt-2 mb-3 tracking-tight">{title}</h3>
      <p className="text-base leading-relaxed">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b-2 border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-black text-sm">DP</span>
            </div>
            <span className="font-heading font-black text-xl tracking-tight">DOJO POP</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm uppercase tracking-widest font-semibold border-b-2 border-transparent hover:border-accent transition-colors">
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="text-sm uppercase tracking-widest font-bold bg-accent text-accent-foreground px-6 py-2 border-2 border-accent hover:bg-transparent hover:text-accent transition-colors"
            >
              Join
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b-2 border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-block border-2 border-accent px-3 py-1 mb-6">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-accent">Official Practice Record</span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6">
                TRAIN.
                <br />
                LOG.
                <br />
                PROVE.
              </h1>
              
              <p className="text-lg md:text-xl leading-relaxed max-w-md">
                A permanent training record for real practitioners.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-accent font-black text-xl">→</span>
                  <p className="text-base">Tap check-ins. No apps to install.</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-accent font-black text-xl">→</span>
                  <p className="text-base">Rank + attendance history. Permanent.</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-accent font-black text-xl">→</span>
                  <p className="text-base">Lineage + school registry. Verified.</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/signup" variant="primary">Join</Button>
                <Button href="/login" variant="secondary">Sign In</Button>
              </div>
              
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Used by schools across disciplines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Points */}
      <section className="border-b-2 border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-6">
            <Tile 
              number="01" 
              title="Tap Check-In"
              description="QR + NFC. No apps. No friction. Students scan, instructor verifies."
            />
            <Tile 
              number="02" 
              title="Permanent Record"
              description="Attendance, rank, lineage. Stored forever. Export anytime."
            />
            <Tile 
              number="03" 
              title="Verified Registry"
              description="Schools register. Instructors certify. Students prove."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b-2 border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-12">
            HOW IT WORKS
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Sign Up", desc: "Create your record. Get your QR." },
              { step: "2", title: "Train", desc: "Check in at class. Build history." },
              { step: "3", title: "Prove", desc: "Share rank. Verify lineage." },
            ].map((item) => (
              <div key={item.step} className="border-l-4 border-accent pl-6">
                <span className="font-heading text-4xl font-black text-accent">{item.step}</span>
                <h3 className="font-heading text-xl font-bold mt-2 mb-2">{item.title}</h3>
                <p className="text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Shot */}
      <section className="border-b-2 border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="border-2 border-neutral-900 bg-surface p-4">
            <div className="border-2 border-neutral-900 bg-background p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold text-accent">Student Record</span>
                  <h3 className="font-heading text-2xl font-bold mt-2 mb-4">Your Training Log</h3>
                  <ul className="space-y-2 text-base">
                    <li>→ Total sessions: 127</li>
                    <li>→ Current streak: 12 days</li>
                    <li>→ Rank: Blue Belt</li>
                    <li>→ School: Warsaw BJJ Academy</li>
                  </ul>
                </div>
                <div className="border-2 border-neutral-900 p-4 bg-background">
                  <div className="aspect-square bg-neutral-200 flex items-center justify-center">
                    <span className="text-neutral-400 font-heading font-bold">QR CODE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Split Section */}
      <section className="border-b-2 border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2">
            <div className="px-6 py-16 md:py-24 border-b-2 md:border-b-0 md:border-r-2 border-neutral-900">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-accent">For Students</span>
              <h3 className="font-heading text-2xl font-bold mt-2 mb-4">Own Your Progress</h3>
              <ul className="space-y-3 text-base">
                <li>→ Permanent training history</li>
                <li>→ Verified rank credentials</li>
                <li>→ Cross-school portability</li>
              </ul>
            </div>
            
            <div className="px-6 py-16 md:py-24">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-accent">For Instructors</span>
              <h3 className="font-heading text-2xl font-bold mt-2 mb-4">Run Your Dojo</h3>
              <ul className="space-y-3 text-base">
                <li>→ Digital attendance ledger</li>
                <li>→ Belt promotion tracking</li>
                <li>→ Student lineage records</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-b-2 border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight mb-6">
            START YOUR RECORD.
          </h2>
          
          <p className="text-lg mb-8 max-w-md mx-auto">
            Join schools already using Dojo Pop to verify training and certify rank.
          </p>
          
          <Button href="/signup" variant="primary">Join Now</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-accent flex items-center justify-center">
                  <span className="text-accent-foreground font-black text-sm">DP</span>
                </div>
                <span className="font-heading font-black text-xl">DOJO POP</span>
              </div>
              <p className="text-sm text-neutral-400">Official practice record.</p>
            </div>
            
            <div>
              <h4 className="font-heading font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/signup" className="hover:text-neutral-50 transition-colors">Join</Link></li>
                <li><Link href="/login" className="hover:text-neutral-50 transition-colors">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/terms" className="hover:text-neutral-50 transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-neutral-50 transition-colors">Privacy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>hello@dojopop.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 pt-8 text-center text-sm text-neutral-500">
            <p>© 2026 DOJO POP. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
