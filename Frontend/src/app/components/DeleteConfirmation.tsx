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
        <div className="p-6 sm:p-10 bg-destructive/5 flex flex-col items-center text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6 transition-transform hover:scale-110">
            <Trash2 className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" />
          </div>
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 max-w-sm font-medium text-xs sm:text-sm leading-relaxed">
              {message || description || "This action cannot be undone. This will permanently delete the selected item and remove it from our systems."}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="p-6 sm:p-8 bg-white border-t gap-3 shrink-0 flex-col-reverse sm:flex-row">
          <AlertDialogCancel className="font-black uppercase tracking-widest text-xs h-12 rounded-xl border-gray-200 hover:bg-gray-50 transition-all sm:flex-1">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={isDeleting}
            className="bg-destructive hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs h-12 rounded-xl px-10 shadow-xl shadow-red-100 transition-all hover:scale-105 sm:flex-1"
          >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Yes, Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
