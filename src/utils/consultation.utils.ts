import { Consultation } from '../models/consultation.model';
import { WorkSprint } from '../models/worksprint.model';

// Generates a list of time slots for consultations
const generateHourlySlots = () => {
  const slots = [];
  for (let h = 10; h < 18; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

// ✅ Returns [count] working days starting from [startDate]
function generateWorkingDays(
  startDate: Date,
  daysInMonth: number,
  offsetDays: number
) {
  const dates = [];
  const cursor = new Date(startDate); // Date is mutable, and cloning it like this protects the original from being mutated during iteration.
  let count = 0;

  while (count < daysInMonth) {
    const day = cursor.getDay(); // 0 = Sunday, 6 = Saturday
    if (day >= 1 && day <= 5) {
      // Monday to Friday only
      dates.push(new Date(cursor).getDate());
    }
    cursor.setDate(cursor.getDate() + 1);
    count++;
  }

  return dates.slice(offsetDays);
}

// ✅ Checks if the old consultation date is at least 1 working day ahead of now
function isWorkingDayNotice(oldDate: string, now = new Date()) {
  const oneDayLater = new Date(now);
  oneDayLater.setDate(now.getDate() + 1);

  return new Date(oldDate) >= oneDayLater;
}

// generates available time slots for a given date
function generateAvailableTimeSlots(
  consults: Array<Consultation>,
  sprints: Array<WorkSprint>
) {
  const blockedTimes = new Set();
  // base slots
  const allSlots = generateHourlySlots();
  let availableTimeSlots = [];

  consults.forEach((c) => blockedTimes.add(c.startTime));

  sprints.forEach((sprint) => {
    const startHour = parseInt(sprint.sprintStartTime.split(':')[0]);
    const endHour = parseInt(sprint.sprintEndTime.split(':')[0]);

    for (let h = startHour; h < endHour; h++) {
      blockedTimes.add(`${h.toString().padStart(2, '0')}:00`);
      blockedTimes.add(`${h.toString().padStart(2, '0')}:30`);
    }
  });

  // Final result: all time slots minus blocked ones
  return (availableTimeSlots = allSlots.filter(
    (time) => !blockedTimes.has(time)
  ));
}

export { generateWorkingDays, generateAvailableTimeSlots, isWorkingDayNotice };
