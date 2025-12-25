
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export type ViewType = 'setup' | 'lucky-draw' | 'grouping';

export interface AppState {
  participants: Participant[];
  winners: Participant[];
}
