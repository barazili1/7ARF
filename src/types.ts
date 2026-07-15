export type Screen = 'SPLASH' | 'LOGIN' | 'CONDITION' | 'LICENSE' | 'PREDICTION' | 'MAINTENANCE' | 'ADMIN';

export interface Winner {
  id: string;
  userId: string;
  amount: number;
}

export interface Leader {
  id: string;
  amount: number;
}

export interface ElegantToast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'star';
}
