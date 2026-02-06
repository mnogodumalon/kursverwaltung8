import { useState } from 'react';
import { Pencil, Trash2, Plus, CheckCircle2, XCircle } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { Anmeldung, Teilnehmer, Kurs } from './types';

interface AnmeldungenTabProps {
  anmeldungen: Anmeldung[];
  teilnehmer: Teilnehmer[];
  kurse: Kurs[];
  onAdd: (a: Omit<Anmeldung, 'record_id'>) => void;
  onUpdate: (id: string, a: Omit<Anmeldung, 'record_id'>) => void;
  onDelete: (id: string) => void;
}

const emptyAnmeldung: Omit<Anmeldung, 'record_id'> = {
  teilnehmer: '', kurs: '', anmeldedatum: new Date().toISOString().split('T')[0], bezahlt: false,
};

export function AnmeldungenTab({ anmeldungen, teilnehmer, kurse, onAdd, onUpdate, onDelete }: AnmeldungenTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Anmeldung | null>(null);
  const [form, setForm] = useState(emptyAnmeldung);

  const openCreate = () => { setEditing(null); setForm({ ...emptyAnmeldung, anmeldedatum: new Date().toISOString().split('T')[0] }); setDialogOpen(true); };
  const openEdit = (a: Anmeldung) => {
    setEditing(a);
    setForm({ teilnehmer: a.teilnehmer, kurs: a.kurs, anmeldedatum: a.anmeldedatum, bezahlt: a.bezahlt });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.teilnehmer || !form.kurs) return;
    if (editing?.record_id) {
      onUpdate(editing.record_id, form);
    } else {
      onAdd(form);
    }
    setDialogOpen(false);
  };

  const getTeilnehmerName = (id: string) => teilnehmer.find(t => t.record_id === id)?.name || '—';
  const getKursTitel = (id: string) => kurse.find(k => k.record_id === id)?.titel || '—';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Anmeldungen</h2>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Neue Anmeldung
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Teilnehmer</TableHead>
              <TableHead>Kurs</TableHead>
              <TableHead className="hidden md:table-cell">Anmeldedatum</TableHead>
              <TableHead>Bezahlt</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anmeldungen.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Noch keine Anmeldungen vorhanden
                </TableCell>
              </TableRow>
            )}
            {anmeldungen.map((a) => (
              <TableRow key={a.record_id} className="hover:bg-accent/50 transition-colors">
                <TableCell className="font-medium">{getTeilnehmerName(a.teilnehmer)}</TableCell>
                <TableCell className="text-muted-foreground">{getKursTitel(a.kurs)}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                  {a.anmeldedatum && new Date(a.anmeldedatum).toLocaleDateString('de-DE')}
                </TableCell>
                <TableCell>
                  {a.bezahlt ? (
                    <Badge variant="default" className="bg-[hsl(158,60%,42%)] hover:bg-[hsl(158,60%,38%)]">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Bezahlt
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" /> Offen
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(a)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(a.record_id!)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Anmeldung bearbeiten' : 'Neue Anmeldung'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Teilnehmer *</Label>
              <Select value={form.teilnehmer} onValueChange={v => setForm({ ...form, teilnehmer: v })}>
                <SelectTrigger><SelectValue placeholder="Teilnehmer auswählen..." /></SelectTrigger>
                <SelectContent>
                  {teilnehmer.map(t => (
                    <SelectItem key={t.record_id} value={t.record_id!}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Kurs *</Label>
              <Select value={form.kurs} onValueChange={v => setForm({ ...form, kurs: v })}>
                <SelectTrigger><SelectValue placeholder="Kurs auswählen..." /></SelectTrigger>
                <SelectContent>
                  {kurse.map(k => (
                    <SelectItem key={k.record_id} value={k.record_id!}>{k.titel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Anmeldedatum</Label>
              <Input type="date" value={form.anmeldedatum} onChange={e => setForm({ ...form, anmeldedatum: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.bezahlt} onCheckedChange={v => setForm({ ...form, bezahlt: v })} />
              <Label>Bezahlt</Label>
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
            <AlertDialogTitle>Anmeldung löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Anmeldung wird unwiderruflich gelöscht. Sind Sie sicher?
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
