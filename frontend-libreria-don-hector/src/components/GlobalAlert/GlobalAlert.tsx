import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlertStore } from "@/features/GlobalAlert/store";
import { DEFAULT_TEXTS } from "@/utils/constants/alerts";

export const GlobalAlert = () => {
  const { isOpen, title, description, closeAlert } = useAlertStore();

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => open || closeAlert()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || DEFAULT_TEXTS.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || DEFAULT_TEXTS.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={closeAlert}>Aceptar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
