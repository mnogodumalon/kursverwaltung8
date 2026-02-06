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
import type { Raum } from './types';

interface RaeumeTabProps {
  raeume: Raum[];
  onAdd: (r: Omit<Raum, 'record_id'>) => void;
  onUpdate: (id: string, r: Omit<Raum, 'record_id'>) => void;
  onDelete: (id: string) => void;
}

const emptyRaum: Omit<Raum, 'record_id'> = {
  raumname: '', gebaeude: '', kapazitaet: 30,
};

export function RaeumeTab({ raeume, onAdd, onUpdate, onDelete }: RaeumeTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Raum | null>(null);
  const [form, setForm] = useState(emptyRaum);

  const openCreate = () => { setEditing(null); setForm(emptyRaum); setDialogOpen(true); };
  const openEdit = (r: Raum) => {
    setEditing(r);
    setForm({ raumname: r.raumname, gebaeude: r.gebaeude, kapazitaet: r.kapazitaet });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.raumname) return;
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
        <h2 className="text-lg font-semibold text-foreground">Räume</h2>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Neuer Raum
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Raumname</TableHead>
              <TableHead>Gebäude</TableHead>
              <TableHead>Kapazität</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {raeume.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Noch keine Räume angelegt
                </TableCell>
              </TableRow>
            )}
            {raeume.map((r) => (
              <TableRow key={r.record_id} className="hover:bg-accent/50 transition-colors">
                <TableCell className="font-medium">{r.raumname}</TableCell>
                <TableCell className="text-muted-foreground">{r.gebaeude}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {r.kapazitaet} Plätze
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(r)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(r.record_id!)}>
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
            <DialogTitle>{editing ? 'Raum bearbeiten' : 'Neuer Raum'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Raumname *</Label>
              <Input value={form.raumname} onChange={e => setForm({ ...form, raumname: e.target.value })} placeholder="z.B. Seminarraum A" />
            </div>
            <div className="grid gap-2">
              <Label>Gebäude</Label>
              <Input value={form.gebaeude} onChange={e => setForm({ ...form, gebaeude: e.target.value })} placeholder="z.B. Hauptgebäude" />
            </div>
            <div className="grid gap-2">
              <Label>Kapazität</Label>
              <Input type="number" value={form.kapazitaet} onChange={e => setForm({ ...form, kapazitaet: Number(e.target.value) })} />
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
            <AlertDialogTitle>Raum löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dieser Raum wird unwiderruflich gelöscht. Sind Sie sicher?
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
