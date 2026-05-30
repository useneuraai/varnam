import Link from "next/link";
import { getAllInvitations } from "@/lib/db";
import { TEMPLATES } from "@/lib/templates";
import { Sparkles, DollarSign, FileText, BarChart3, Globe, Shield, Power } from "lucide-react";
import GoldParticles from "@/components/animations/GoldParticles";

export default async function AdminDashboard() {
  const invitations = await getAllInvitations();

  // Calculate stats
  const totalInvites = invitations.length;
  
  // Sum up revenue
  const totalRevenue = invitations.reduce((acc, inv) => {
    // Find matching template to get its price
    const template = TEMPLATES.find((t) => t.slug === inv.template_slug);
    const price = template ? template.price : 499;
    return acc + price;
  }, 0);

  const averageOrderValue = totalInvites > 0 ? Math.round(totalRevenue / totalInvites) : 0;

  // Calculate template stats
  const templateUsage: Record<string, number> = {};
  invitations.forEach((inv) => {
    templateUsage[inv.template_slug] = (templateUsage[inv.template_slug] || 0) + 1;
  });

  return (
    <div className="relative min-h-screen bg-[#080708] text-[#fbf6df] overflow-hidden flex flex-col">
      <GoldParticles count={20} />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-gold-600/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-gold-400" />
            <span className="font-cinzel text-xl font-bold tracking-widest bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 bg-clip-text text-transparent">
              VARNAM ADMIN
            </span>
          </div>

          <Link href="/" className="font-montserrat text-xs tracking-widest text-gold-200/80 hover:text-gold-400 transition-colors">
            GO TO WEBSITE
          </Link>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="max-w-7xl mx-auto px-6 py-12 z-10 w-full flex-grow space-y-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold tracking-widest gold-gradient-text uppercase">
              Management Control
            </h1>
            <p className="font-serif text-xs text-gold-200/60 mt-1">
              Real-time transaction volumes, visitor creations, and templates status.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue */}
          <div className="glass-card p-6 border border-gold-500/10 rounded-none bg-black/40 flex items-center gap-6">
            <div className="p-4 bg-gold-500/5 rounded-full border border-gold-400/20">
              <DollarSign className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <span className="font-montserrat text-[10px] tracking-widest text-gold-400/60 uppercase">TOTAL EARNINGS</span>
              <h3 className="font-cinzel text-2xl font-bold text-gold-300 mt-1">₹{totalRevenue.toLocaleString()}</h3>
            </div>
          </div>

          {/* Invitations */}
          <div className="glass-card p-6 border border-gold-500/10 rounded-none bg-black/40 flex items-center gap-6">
            <div className="p-4 bg-gold-500/5 rounded-full border border-gold-400/20">
              <FileText className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <span className="font-montserrat text-[10px] tracking-widest text-gold-400/60 uppercase">INVITATIONS CREATED</span>
              <h3 className="font-cinzel text-2xl font-bold text-gold-300 mt-1">{totalInvites}</h3>
            </div>
          </div>

          {/* Average Ticket */}
          <div className="glass-card p-6 border border-gold-500/10 rounded-none bg-black/40 flex items-center gap-6">
            <div className="p-4 bg-gold-500/5 rounded-full border border-gold-400/20">
              <BarChart3 className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <span className="font-montserrat text-[10px] tracking-widest text-gold-400/60 uppercase">AVERAGE VALUE (AOV)</span>
              <h3 className="font-cinzel text-2xl font-bold text-gold-300 mt-1">₹{averageOrderValue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Bottom split: Order Logs & Template status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Orders log */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-gold-400">
              <FileText className="w-4 h-4" />
              <span className="font-montserrat text-[10px] tracking-widest uppercase font-bold">Transaction logs</span>
            </div>

            <div className="glass-card border border-gold-500/10 bg-black/40 overflow-x-auto rounded-none">
              {invitations.length === 0 ? (
                <div className="py-12 text-center text-gold-200/40 italic font-serif text-sm">
                  No wedding invitations have been purchased yet.
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gold-600/10 font-montserrat text-[9px] tracking-widest uppercase text-gold-400">
                      <th className="p-4 font-bold">Couple Names</th>
                      <th className="p-4 font-bold">Template Type</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Order Reference</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-serif text-xs text-gold-100">
                    {invitations.map((inv) => (
                      <tr key={inv.slug} className="border-b border-gold-600/5 hover:bg-gold-500/5 transition-colors">
                        <td className="p-4 font-semibold">
                          {inv.bride_name} &amp; {inv.groom_name}
                        </td>
                        <td className="p-4 text-gold-200/70 font-sans text-[10px] uppercase tracking-wider">
                          {inv.template_slug.replace("-", " ")}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-green-950/40 border border-green-500/30 text-green-400 font-sans text-[9px] tracking-wider uppercase font-bold">
                            PAID
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[10px] text-gold-200/50">
                          {inv.payment_id}
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/invite/${inv.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-200 font-sans text-[9px] tracking-widest uppercase font-bold border border-gold-500/20 px-2 py-1 bg-black/40"
                          >
                            <Globe className="w-3 h-3" />
                            VIEW INVITE
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Template Popularity / Configs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gold-400">
              <Sparkles className="w-4 h-4" />
              <span className="font-montserrat text-[10px] tracking-widest uppercase font-bold">Active templates</span>
            </div>

            <div className="glass-card border border-gold-500/10 bg-black/40 p-6 rounded-none space-y-6">
              {TEMPLATES.map((tpl) => {
                const count = templateUsage[tpl.slug] || 0;
                
                return (
                  <div key={tpl.slug} className="flex items-center justify-between border-b border-gold-600/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="font-cinzel text-sm text-gold-300 font-bold tracking-wide">{tpl.name}</span>
                      <span className="font-montserrat text-[9px] tracking-widest text-gold-200/60 uppercase mt-0.5">
                        {count} USES • ₹{tpl.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-green-950/40 border border-green-500/30 text-green-400 font-sans text-[9px] tracking-wider uppercase font-bold">
                        ACTIVE
                      </span>
                      <button className="p-2 border border-gold-500/20 text-gold-400 hover:text-red-400 transition-colors" title="Toggle active status">
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-6 border-t border-gold-600/10 bg-black/60 z-10 text-center">
        <p className="font-serif text-xs text-gold-200/50">
          © {new Date().getFullYear()} Varnam Wedding Invites. Admin Management Panel.
        </p>
      </footer>
    </div>
  );
}
