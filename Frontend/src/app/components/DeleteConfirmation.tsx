import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  message?: string;
  description?: string; // Support both for backward compatibility
}

export function DeleteConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you absolutely sure?", 
  message,
  description 
}: DeleteConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error during deletion:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-2xl border-none p-0 overflow-hidden shadow-2xl">
        <div className="p-8 bg-destructive/5 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <Trash2 className="w-8 h-8 text-destructive" />
          </div>
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 max-w-sm">
              {message || description || "This action cannot be undone. This will permanently delete the selected item."}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="p-8 bg-white border-t gap-3 sm:gap-0">
          <AlertDialogCancel className="font-bold rounded-xl border-gray-200">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-white font-bold rounded-xl px-8"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
