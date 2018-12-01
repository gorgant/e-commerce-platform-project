import { AppUser } from 'src/app/shared/models/app-user';

export interface State {
  user: AppUser | null;
  isLoading: boolean;
  error: string;
}

export const initialState: State = {
  user: null,
  isLoading: false,
  error: null
};
