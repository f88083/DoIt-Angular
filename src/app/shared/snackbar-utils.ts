import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalConstants } from './global-constants';

export function showSnackbar(snackBar: MatSnackBar, message: string) {
  snackBar.open(
    message,
    undefined,
    { duration: GlobalConstants.SNACKBAR_MSG_SHOW_DURATION }
  );
}