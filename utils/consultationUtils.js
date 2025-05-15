// Generates a list of time slots for consultations
generateHourlySlots = () => {
  const slots = [];
  for (let h = 10; h < 18; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

// ✅ Returns [count] working days starting from [startDate]
function generateWorkingDays(startDate, count) {
  const dates = [];
  const cursor = new Date(startDate);

  while (dates.length < count) {
    const day = cursor.getDay(); // 0 = Sunday, 6 = Saturday
    if (day >= 1 && day <= 5) {
      // Monday to Friday only
      dates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

// ✅ Checks if the old consultation date is at least 1 working day ahead of now
function isWorkingDayNotice(oldDate, now = new Date()) {
  const oneDayLater = new Date(now);
  oneDayLater.setDate(now.getDate() + 1);

  return new Date(oldDate) >= oneDayLater;
}

// generates available time slots for a given date
function generateAvailableTimeSlots(consults, sprints) {
  const blockedTimes = new Set();
  // base slots
  const allSlots = generateHourlySlots();

  consults.forEach((c) => blockedTimes.add(c.selectedTime));

  sprints.forEach((sprint) => {
    const startHour = parseInt(sprint.sprint_start_time.split(':')[0]);
    const endHour = parseInt(sprint.sprint_end_time.split(':')[0]);

    for (let h = startHour; h < endHour; h++) {
      blockedTimes.add(`${h.toString().padStart(2, '0')}:00`);
    }
  });

  // Final result: all time slots minus blocked ones
  return (availableTimeSlots = allSlots.filter(
    (time) => !blockedTimes.has(time)
  ));
}

module.exports = {
  generateWorkingDays,
  generateAvailableTimeSlots,
  isWorkingDayNotice,
};
