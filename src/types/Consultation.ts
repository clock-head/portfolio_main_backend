export interface ConsultationPayload {
  userId: number;
  selectedDate: string;
  startTime: string;
  endTime: string;
  status: string;
  resolutionStatus: string;
  hasRescheduled: boolean;
  notes: string;
}

export interface ConsultationCreationAttributes {
  userId: number;
  selectedDate: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'attended' | 'cancelled';
  resolutionStatus: string;
  hasRescheduled: boolean;
  notes: string;
}
