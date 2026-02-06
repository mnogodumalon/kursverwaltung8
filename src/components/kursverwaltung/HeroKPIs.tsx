import { BookOpen, Users, Euro } from 'lucide-react';
import type { Kurs, Anmeldung } from './types';

interface HeroKPIsProps {
  kurse: Kurs[];
  anmeldungen: Anmeldung[];
}

export function HeroKPIs({ kurse, anmeldungen }: HeroKPIsProps) {
  const today = new Date().toISOString().split('T')[0];
  const activeKurse = kurse.filter(k => k.startdatum <= today && k.enddatum >= today).length;
  const totalAnmeldungen = anmeldungen.length;
  const totalRevenue = anmeldungen
    .filter(a => a.bezahlt)
    .reduce((sum, a) => {
      const kurs = kurse.find(k => k.record_id === a.kurs);
      return sum + (kurs?.preis || 0);
    }, 0);

  const kpis = [
    {
      label: 'Aktive Kurse',
      value: activeKurse,
      suffix: `von ${kurse.length}`,
      icon: BookOpen,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Anmeldungen',
      value: totalAnmeldungen,
      suffix: 'gesamt',
      icon: Users,
      color: 'text-[hsl(158,60%,42%)]',
      bg: 'bg-[hsl(158,60%,42%)]/10',
    },
    {
      label: 'Einnahmen',
      value: totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
      suffix: 'EUR bezahlt',
      icon: Euro,
      color: 'text-[hsl(40,90%,40%)]',
      bg: 'bg-[hsl(40,90%,55%)]/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-card rounded-xl border border-border p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                {kpi.label}
              </p>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {kpi.value}
              </p>
              <p className="text-xs text-muted-foreground">{kpi.suffix}</p>
            </div>
            <div className={`${kpi.bg} ${kpi.color} p-3 rounded-lg`}>
              <kpi.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
