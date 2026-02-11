"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ComponentShowcase } from "./ComponentShowcase";

export function DialogsShowcase() {
  return (
    <ComponentShowcase
      title="Dialogs"
      description="Componentes modais para interações"
    >
      <div className="space-y-4">
        {/* Dialog */}
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Abrir Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exemplo de Dialog</DialogTitle>
                <DialogDescription>
                  Dialogs são úteis para exibir conteúdo em modal.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                Conteúdo customizado do dialog pode ir aqui.
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* AlertDialog */}
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Abrir AlertDialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Isso vai deletar
                  permanentemente sua conta.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-2 justify-end">
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction>Continuar</AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-semibold mb-2">Código:</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
          {`<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button>Confirmar</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    {/* ... */}
  </AlertDialogContent>
</AlertDialog>`}
        </pre>
      </div>
    </ComponentShowcase>
  );
}
