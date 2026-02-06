// Local UI types (will be replaced by LivingApps generated types)
export interface Dozent {
  record_id?: string;
  name: string;
  email: string;
  telefon: string;
  fachgebiet: string;
}

export interface Teilnehmer {
  record_id?: string;
  name: string;
  email: string;
  telefon: string;
  geburtsdatum: string;
}

export interface Raum {
  record_id?: string;
  raumname: string;
  gebaeude: string;
  kapazitaet: number;
}

export interface Kurs {
  record_id?: string;
  titel: string;
  beschreibung: string;
  startdatum: string;
  enddatum: string;
  max_teilnehmer: number;
  preis: number;
  dozent: string; // record_id of Dozent
  raum: string;   // record_id of Raum
}

export interface Anmeldung {
  record_id?: string;
  teilnehmer: string; // record_id of Teilnehmer
  kurs: string;       // record_id of Kurs
  anmeldedatum: string;
  bezahlt: boolean;
}

export type TabType = 'kurse' | 'dozenten' | 'teilnehmer' | 'raeume' | 'anmeldungen';
