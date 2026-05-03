import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { UserOrganization } from '../../context/user.api';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  supplier: UserOrganization | null;
}

export function DeleteConfirmation({ isOpen, onClose, onConfirm, supplier }: DeleteConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting supplier:', error);
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
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 max-w-sm">
              This will permanently delete the account for <span className="font-bold text-gray-900">{supplier?.user_details.first_name} {supplier?.user_details.last_name}</span> and the organization <span className="font-bold text-gray-900">{supplier?.organization_details.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="p-8 bg-white border-t gap-3 sm:gap-0">
          <AlertDialogCancel className="font-bold rounded-lg border-gray-200">No, Keep Account</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-white font-bold rounded-lg px-8"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete Supplier'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
