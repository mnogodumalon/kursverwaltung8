import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Label } from '@/components/ui/label';
import type { Teilnehmer } from './types';

interface TeilnehmerTabProps {
  teilnehmer: Teilnehmer[];
  onAdd: (t: Omit<Teilnehmer, 'record_id'>) => void;
  onUpdate: (id: string, t: Omit<Teilnehmer, 'record_id'>) => void;
  onDelete: (id: string) => void;
}

const emptyTeilnehmer: Omit<Teilnehmer, 'record_id'> = {
  name: '', email: '', telefon: '', geburtsdatum: '',
};

export function TeilnehmerTab({ teilnehmer, onAdd, onUpdate, onDelete }: TeilnehmerTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Teilnehmer | null>(null);
  const [form, setForm] = useState(emptyTeilnehmer);

  const openCreate = () => { setEditing(null); setForm(emptyTeilnehmer); setDialogOpen(true); };
  const openEdit = (t: Teilnehmer) => {
    setEditing(t);
    setForm({ name: t.name, email: t.email, telefon: t.telefon, geburtsdatum: t.geburtsdatum });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    if (editing?.record_id) {
      onUpdate(editing.record_id, form);
    } else {
      onAdd(form);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Teilnehmer</h2>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Neuer Teilnehmer
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">E-Mail</TableHead>
              <TableHead className="hidden md:table-cell">Telefon</TableHead>
              <TableHead className="hidden lg:table-cell">Geburtsdatum</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teilnehmer.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Noch keine Teilnehmer angelegt
                </TableCell>
              </TableRow>
            )}
            {teilnehmer.map((t) => (
              <TableRow key={t.record_id} className="hover:bg-accent/50 transition-colors">
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{t.email}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{t.telefon}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {t.geburtsdatum && new Date(t.geburtsdatum).toLocaleDateString('de-DE')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(t)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(t.record_id!)}>
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
            <DialogTitle>{editing ? 'Teilnehmer bearbeiten' : 'Neuer Teilnehmer'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Vor- und Nachname" />
            </div>
            <div className="grid gap-2">
              <Label>E-Mail</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="teilnehmer@beispiel.de" />
            </div>
            <div className="grid gap-2">
              <Label>Telefon</Label>
              <Input value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} placeholder="+49 ..." />
            </div>
            <div className="grid gap-2">
              <Label>Geburtsdatum</Label>
              <Input type="date" value={form.geburtsdatum} onChange={e => setForm({ ...form, geburtsdatum: e.target.value })} />
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
            <AlertDialogTitle>Teilnehmer löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dieser Teilnehmer wird unwiderruflich gelöscht. Sind Sie sicher?
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
