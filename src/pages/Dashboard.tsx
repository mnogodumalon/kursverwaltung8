import { useState, useEffect, useCallback } from 'react';
import { GraduationCap, BookOpen, Users, UserCheck, Building2, ClipboardList } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { LivingAppsService, extractRecordId, createRecordUrl } from '@/services/livingAppsService';
import { APP_IDS } from '@/types/app';
import { HeroKPIs } from '@/components/kursverwaltung/HeroKPIs';
import { KurseTab } from '@/components/kursverwaltung/KurseTab';
import { DozentenTab } from '@/components/kursverwaltung/DozentenTab';
import { TeilnehmerTab } from '@/components/kursverwaltung/TeilnehmerTab';
import { RaeumeTab } from '@/components/kursverwaltung/RaeumeTab';
import { AnmeldungenTab } from '@/components/kursverwaltung/AnmeldungenTab';
import { Skeleton } from '@/components/ui/skeleton';
import type { TabType, Kurs, Dozent, Teilnehmer, Raum, Anmeldung } from '@/components/kursverwaltung/types';
import type { Kurse, Dozenten, Teilnehmer as TeilnehmerAPI, Raeume, Anmeldungen } from '@/types/app';

// Adapter: API -> UI
function apiToKurs(k: Kurse): Kurs {
  return {
    record_id: k.record_id,
    titel: k.fields.titel || '',
    beschreibung: k.fields.beschreibung || '',
    startdatum: k.fields.startdatum || '',
    enddatum: k.fields.enddatum || '',
    max_teilnehmer: k.fields.max_teilnehmer || 0,
    preis: k.fields.preis || 0,
    dozent: extractRecordId(k.fields.dozent) || '',
    raum: extractRecordId(k.fields.raum) || '',
  };
}
function apiToDozent(d: Dozenten): Dozent {
  return { record_id: d.record_id, name: d.fields.name || '', email: d.fields.email || '', telefon: d.fields.telefon || '', fachgebiet: d.fields.fachgebiet || '' };
}
function apiToTeilnehmer(t: TeilnehmerAPI): Teilnehmer {
  return { record_id: t.record_id, name: t.fields.name || '', email: t.fields.email || '', telefon: t.fields.telefon || '', geburtsdatum: t.fields.geburtsdatum || '' };
}
function apiToRaum(r: Raeume): Raum {
  return { record_id: r.record_id, raumname: r.fields.raumname || '', gebaeude: r.fields.gebaeude || '', kapazitaet: r.fields.kapazitaet || 0 };
}
function apiToAnmeldung(a: Anmeldungen): Anmeldung {
  return { record_id: a.record_id, teilnehmer: extractRecordId(a.fields.teilnehmer) || '', kurs: extractRecordId(a.fields.kurs) || '', anmeldedatum: a.fields.anmeldedatum || '', bezahlt: a.fields.bezahlt || false };
}

const tabs: { id: TabType; label: string; icon: typeof BookOpen }[] = [
  { id: 'kurse', label: 'Kurse', icon: BookOpen },
  { id: 'dozenten', label: 'Dozenten', icon: UserCheck },
  { id: 'teilnehmer', label: 'Teilnehmer', icon: Users },
  { id: 'raeume', label: 'Räume', icon: Building2 },
  { id: 'anmeldungen', label: 'Anmeldungen', icon: ClipboardList },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('kurse');
  const [loading, setLoading] = useState(true);

  const [kurse, setKurse] = useState<Kurs[]>([]);
  const [dozenten, setDozenten] = useState<Dozent[]>([]);
  const [teilnehmer, setTeilnehmer] = useState<Teilnehmer[]>([]);
  const [raeume, setRaeume] = useState<Raum[]>([]);
  const [anmeldungen, setAnmeldungen] = useState<Anmeldung[]>([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [kRaw, dRaw, tRaw, rRaw, aRaw] = await Promise.all([
        LivingAppsService.getKurse(),
        LivingAppsService.getDozenten(),
        LivingAppsService.getTeilnehmer(),
        LivingAppsService.getRaeume(),
        LivingAppsService.getAnmeldungen(),
      ]);
      setKurse(kRaw.map(apiToKurs));
      setDozenten(dRaw.map(apiToDozent));
      setTeilnehmer(tRaw.map(apiToTeilnehmer));
      setRaeume(rRaw.map(apiToRaum));
      setAnmeldungen(aRaw.map(apiToAnmeldung));
    } catch {
      toast.error('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // --- Kurse CRUD ---
  const handleAddKurs = async (data: Omit<Kurs, 'record_id'>) => {
    try {
      const result = await LivingAppsService.createKurseEntry({
        titel: data.titel, beschreibung: data.beschreibung,
        startdatum: data.startdatum, enddatum: data.enddatum,
        max_teilnehmer: data.max_teilnehmer, preis: data.preis,
        dozent: data.dozent ? createRecordUrl(APP_IDS.DOZENTEN, data.dozent) : undefined,
        raum: data.raum ? createRecordUrl(APP_IDS.RAEUME, data.raum) : undefined,
      });
      const newId = result?.id || result?.record_id;
      if (newId) setKurse(prev => [...prev, { ...data, record_id: newId }]);
      else await loadData();
      toast.success('Kurs erstellt');
    } catch { toast.error('Fehler beim Erstellen'); }
  };
  const handleUpdateKurs = async (id: string, data: Omit<Kurs, 'record_id'>) => {
    try {
      await LivingAppsService.updateKurseEntry(id, {
        titel: data.titel, beschreibung: data.beschreibung,
        startdatum: data.startdatum, enddatum: data.enddatum,
        max_teilnehmer: data.max_teilnehmer, preis: data.preis,
        dozent: data.dozent ? createRecordUrl(APP_IDS.DOZENTEN, data.dozent) : undefined,
        raum: data.raum ? createRecordUrl(APP_IDS.RAEUME, data.raum) : undefined,
      });
      const fresh = (await LivingAppsService.getKurse()).map(apiToKurs);
      setKurse(fresh);
      toast.success('Kurs aktualisiert');
    } catch { toast.error('Fehler beim Aktualisieren'); }
  };
  const handleDeleteKurs = async (id: string) => {
    try {
      await LivingAppsService.deleteKurseEntry(id);
      setKurse(prev => prev.filter(k => k.record_id !== id));
      toast.success('Kurs gelöscht');
    } catch { toast.error('Fehler beim Löschen'); }
  };

  // --- Dozenten CRUD ---
  const handleAddDozent = async (data: Omit<Dozent, 'record_id'>) => {
    try {
      const result = await LivingAppsService.createDozentenEntry({ name: data.name, email: data.email, telefon: data.telefon, fachgebiet: data.fachgebiet });
      const newId = result?.id || result?.record_id;
      if (newId) setDozenten(prev => [...prev, { ...data, record_id: newId }]);
      else await loadData();
      toast.success('Dozent erstellt');
    } catch { toast.error('Fehler beim Erstellen'); }
  };
  const handleUpdateDozent = async (id: string, data: Omit<Dozent, 'record_id'>) => {
    try {
      await LivingAppsService.updateDozentenEntry(id, { name: data.name, email: data.email, telefon: data.telefon, fachgebiet: data.fachgebiet });
      const fresh = (await LivingAppsService.getDozenten()).map(apiToDozent);
      setDozenten(fresh);
      toast.success('Dozent aktualisiert');
    } catch { toast.error('Fehler beim Aktualisieren'); }
  };
  const handleDeleteDozent = async (id: string) => {
    try {
      await LivingAppsService.deleteDozentenEntry(id);
      setDozenten(prev => prev.filter(d => d.record_id !== id));
      toast.success('Dozent gelöscht');
    } catch { toast.error('Fehler beim Löschen'); }
  };

  // --- Teilnehmer CRUD ---
  const handleAddTeilnehmer = async (data: Omit<Teilnehmer, 'record_id'>) => {
    try {
      const result = await LivingAppsService.createTeilnehmerEntry({ name: data.name, email: data.email, telefon: data.telefon, geburtsdatum: data.geburtsdatum || undefined });
      const newId = result?.id || result?.record_id;
      if (newId) setTeilnehmer(prev => [...prev, { ...data, record_id: newId }]);
      else await loadData();
      toast.success('Teilnehmer erstellt');
    } catch { toast.error('Fehler beim Erstellen'); }
  };
  const handleUpdateTeilnehmer = async (id: string, data: Omit<Teilnehmer, 'record_id'>) => {
    try {
      await LivingAppsService.updateTeilnehmerEntry(id, { name: data.name, email: data.email, telefon: data.telefon, geburtsdatum: data.geburtsdatum || undefined });
      const fresh = (await LivingAppsService.getTeilnehmer()).map(apiToTeilnehmer);
      setTeilnehmer(fresh);
      toast.success('Teilnehmer aktualisiert');
    } catch { toast.error('Fehler beim Aktualisieren'); }
  };
  const handleDeleteTeilnehmer = async (id: string) => {
    try {
      await LivingAppsService.deleteTeilnehmerEntry(id);
      setTeilnehmer(prev => prev.filter(t => t.record_id !== id));
      toast.success('Teilnehmer gelöscht');
    } catch { toast.error('Fehler beim Löschen'); }
  };

  // --- Raeume CRUD ---
  const handleAddRaum = async (data: Omit<Raum, 'record_id'>) => {
    try {
      const result = await LivingAppsService.createRaeumeEntry({ raumname: data.raumname, gebaeude: data.gebaeude, kapazitaet: data.kapazitaet });
      const newId = result?.id || result?.record_id;
      if (newId) setRaeume(prev => [...prev, { ...data, record_id: newId }]);
      else await loadData();
      toast.success('Raum erstellt');
    } catch { toast.error('Fehler beim Erstellen'); }
  };
  const handleUpdateRaum = async (id: string, data: Omit<Raum, 'record_id'>) => {
    try {
      await LivingAppsService.updateRaeumeEntry(id, { raumname: data.raumname, gebaeude: data.gebaeude, kapazitaet: data.kapazitaet });
      const fresh = (await LivingAppsService.getRaeume()).map(apiToRaum);
      setRaeume(fresh);
      toast.success('Raum aktualisiert');
    } catch { toast.error('Fehler beim Aktualisieren'); }
  };
  const handleDeleteRaum = async (id: string) => {
    try {
      await LivingAppsService.deleteRaeumeEntry(id);
      setRaeume(prev => prev.filter(r => r.record_id !== id));
      toast.success('Raum gelöscht');
    } catch { toast.error('Fehler beim Löschen'); }
  };

  // --- Anmeldungen CRUD ---
  const handleAddAnmeldung = async (data: Omit<Anmeldung, 'record_id'>) => {
    try {
      const result = await LivingAppsService.createAnmeldungenEntry({
        teilnehmer: createRecordUrl(APP_IDS.TEILNEHMER, data.teilnehmer),
        kurs: createRecordUrl(APP_IDS.KURSE, data.kurs),
        anmeldedatum: data.anmeldedatum, bezahlt: data.bezahlt,
      });
      const newId = result?.id || result?.record_id;
      if (newId) setAnmeldungen(prev => [...prev, { ...data, record_id: newId }]);
      else await loadData();
      toast.success('Anmeldung erstellt');
    } catch { toast.error('Fehler beim Erstellen'); }
  };
  const handleUpdateAnmeldung = async (id: string, data: Omit<Anmeldung, 'record_id'>) => {
    try {
      await LivingAppsService.updateAnmeldungenEntry(id, {
        teilnehmer: createRecordUrl(APP_IDS.TEILNEHMER, data.teilnehmer),
        kurs: createRecordUrl(APP_IDS.KURSE, data.kurs),
        anmeldedatum: data.anmeldedatum, bezahlt: data.bezahlt,
      });
      const fresh = (await LivingAppsService.getAnmeldungen()).map(apiToAnmeldung);
      setAnmeldungen(fresh);
      toast.success('Anmeldung aktualisiert');
    } catch { toast.error('Fehler beim Aktualisieren'); }
  };
  const handleDeleteAnmeldung = async (id: string) => {
    try {
      await LivingAppsService.deleteAnmeldungenEntry(id);
      setAnmeldungen(prev => prev.filter(a => a.record_id !== id));
      toast.success('Anmeldung gelöscht');
    } catch { toast.error('Fehler beim Löschen'); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />

      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Kursverwaltung</h1>
              <p className="text-xs text-muted-foreground font-medium">Kurse, Dozenten & Teilnehmer verwalten</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-[120px] rounded-xl" />
            ))}
          </div>
        ) : (
          <HeroKPIs kurse={kurse} anmeldungen={anmeldungen} />
        )}

        <div className="border-b border-border">
          <nav className="flex gap-1 overflow-x-auto pb-px -mb-px" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-[300px] rounded-xl" />
          </div>
        ) : (
          <>
            {activeTab === 'kurse' && (
              <KurseTab kurse={kurse} dozenten={dozenten} raeume={raeume} onAdd={handleAddKurs} onUpdate={handleUpdateKurs} onDelete={handleDeleteKurs} />
            )}
            {activeTab === 'dozenten' && (
              <DozentenTab dozenten={dozenten} onAdd={handleAddDozent} onUpdate={handleUpdateDozent} onDelete={handleDeleteDozent} />
            )}
            {activeTab === 'teilnehmer' && (
              <TeilnehmerTab teilnehmer={teilnehmer} onAdd={handleAddTeilnehmer} onUpdate={handleUpdateTeilnehmer} onDelete={handleDeleteTeilnehmer} />
            )}
            {activeTab === 'raeume' && (
              <RaeumeTab raeume={raeume} onAdd={handleAddRaum} onUpdate={handleUpdateRaum} onDelete={handleDeleteRaum} />
            )}
            {activeTab === 'anmeldungen' && (
              <AnmeldungenTab anmeldungen={anmeldungen} teilnehmer={teilnehmer} kurse={kurse} onAdd={handleAddAnmeldung} onUpdate={handleUpdateAnmeldung} onDelete={handleDeleteAnmeldung} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
