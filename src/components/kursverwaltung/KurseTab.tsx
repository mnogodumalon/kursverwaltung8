import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { Kurs, Dozent, Raum } from './types';

interface KurseTabProps {
  kurse: Kurs[];
  dozenten: Dozent[];
  raeume: Raum[];
  onAdd: (kurs: Omit<Kurs, 'record_id'>) => void;
  onUpdate: (id: string, kurs: Omit<Kurs, 'record_id'>) => void;
  onDelete: (id: string) => void;
}

const emptyKurs: Omit<Kurs, 'record_id'> = {
  titel: '', beschreibung: '', startdatum: '', enddatum: '',
  max_teilnehmer: 20, preis: 0, dozent: '', raum: '',
};

export function KurseTab({ kurse, dozenten, raeume, onAdd, onUpdate, onDelete }: KurseTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Kurs | null>(null);
  const [form, setForm] = useState(emptyKurs);

  const openCreate = () => { setEditing(null); setForm(emptyKurs); setDialogOpen(true); };
  const openEdit = (k: Kurs) => {
    setEditing(k);
    setForm({ titel: k.titel, beschreibung: k.beschreibung, startdatum: k.startdatum, enddatum: k.enddatum, max_teilnehmer: k.max_teilnehmer, preis: k.preis, dozent: k.dozent, raum: k.raum });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.titel || !form.startdatum || !form.enddatum) return;
    if (editing?.record_id) {
      onUpdate(editing.record_id, form);
    } else {
      onAdd(form);
    }
    setDialogOpen(false);
  };

  const getStatus = (k: Kurs) => {
    const today = new Date().toISOString().split('T')[0];
    if (k.startdatum > today) return { label: 'Geplant', variant: 'secondary' as const };
    if (k.enddatum < today) return { label: 'Beendet', variant: 'outline' as const };
    return { label: 'Aktiv', variant: 'default' as const };
  };

  const getDozentName = (id: string) => dozenten.find(d => d.record_id === id)?.name || '—';
  const getRaumName = (id: string) => {
    const r = raeume.find(r => r.record_id === id);
    return r ? `${r.raumname} (${r.gebaeude})` : '—';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Kurse</h2>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Neuer Kurs
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Titel</TableHead>
              <TableHead className="hidden md:table-cell">Dozent</TableHead>
              <TableHead className="hidden md:table-cell">Raum</TableHead>
              <TableHead className="hidden lg:table-cell">Zeitraum</TableHead>
              <TableHead className="hidden sm:table-cell">Preis</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kurse.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Noch keine Kurse angelegt
                </TableCell>
              </TableRow>
            )}
            {kurse.map((k) => {
              const status = getStatus(k);
              return (
                <TableRow key={k.record_id} className="hover:bg-accent/50 transition-colors">
                  <TableCell className="font-medium">{k.titel}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{getDozentName(k.dozent)}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{getRaumName(k.raum)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {k.startdatum && new Date(k.startdatum).toLocaleDateString('de-DE')} – {k.enddatum && new Date(k.enddatum).toLocaleDateString('de-DE')}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell font-medium">{k.preis.toLocaleString('de-DE')} €</TableCell>
                  <TableCell><Badge variant={status.variant}>{status.label}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(k)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(k.record_id!)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Kurs bearbeiten' : 'Neuer Kurs'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Titel *</Label>
              <Input value={form.titel} onChange={e => setForm({ ...form, titel: e.target.value })} placeholder="z.B. Python Grundkurs" />
            </div>
            <div className="grid gap-2">
              <Label>Beschreibung</Label>
              <Textarea value={form.beschreibung} onChange={e => setForm({ ...form, beschreibung: e.target.value })} placeholder="Kurzbeschreibung..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Startdatum *</Label>
                <Input type="date" value={form.startdatum} onChange={e => setForm({ ...form, startdatum: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Enddatum *</Label>
                <Input type="date" value={form.enddatum} onChange={e => setForm({ ...form, enddatum: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Max. Teilnehmer</Label>
                <Input type="number" value={form.max_teilnehmer} onChange={e => setForm({ ...form, max_teilnehmer: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label>Preis (EUR)</Label>
                <Input type="number" step="0.01" value={form.preis} onChange={e => setForm({ ...form, preis: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Dozent</Label>
                <Select value={form.dozent} onValueChange={v => setForm({ ...form, dozent: v })}>
                  <SelectTrigger><SelectValue placeholder="Auswählen..." /></SelectTrigger>
                  <SelectContent>
                    {dozenten.map(d => (
                      <SelectItem key={d.record_id} value={d.record_id!}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Raum</Label>
                <Select value={form.raum} onValueChange={v => setForm({ ...form, raum: v })}>
                  <SelectTrigger><SelectValue placeholder="Auswählen..." /></SelectTrigger>
                  <SelectContent>
                    {raeume.map(r => (
                      <SelectItem key={r.record_id} value={r.record_id!}>{r.raumname} ({r.gebaeude})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSave}>{editing ? 'Speichern' : 'Erstellen'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kurs löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dieser Kurs wird unwiderruflich gelöscht. Sind Sie sicher?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) { onDelete(deleteId); setDeleteId(null); } }}>
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
