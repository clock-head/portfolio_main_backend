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
