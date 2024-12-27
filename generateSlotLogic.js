function generateSlots(slotDuration, staffAvailability, userSelectedServices, date, isHoliday) {
    const slots = [];
  
    if (isHoliday) return []; // No slots if it's a holiday.
  
    staffAvailability.forEach((staff) => {
      const startTime = parseTime(staff.startTime, date);
      const endTime = parseTime(staff.endTime, date);
  
      let currentTime = new Date(startTime); // Start from staff's start time
  
      while (currentTime < endTime) {
        // Calculate the total duration of all selected services
        const totalServiceDuration = userSelectedServices.reduce(
          (acc, service) => acc + service.duration,
          0
        );
        const totalServiceEndTime = new Date(currentTime.getTime() + totalServiceDuration * 60000);
  
        // Ensure the entire combined service fits within staff's working hours
        if (totalServiceEndTime > endTime) break;
  
      

        // Check if staff specializes in all services
      const specializesInAll = userSelectedServices.every((service) =>
        Array.isArray(staff.specialties) && staff.specialties.includes(service.requiredSpecialty)
      );

  
        // Check if the combined service duration overlaps with staff's breaks
        const isInBreak = staff.breakTimes.some(([breakStart, breakEnd]) =>
          isTimeRangeOverlap(
            currentTime,
            totalServiceEndTime,
            parseTime(breakStart, date),
            parseTime(breakEnd, date)
          )
        );
  
        // Check if the combined service duration overlaps with staff's existing bookings
        const isBooked = (staff.bookings || []).some((booking) =>
            isTimeRangeOverlap(
              currentTime,
              totalServiceEndTime,
              parseTime(booking.start, date),
              parseTime(booking.end, date)
            )
          );
  
        if (specializesInAll && !isInBreak && !isBooked) {
          const slot = {
            time: `${formatTime(currentTime)} - ${formatTime(totalServiceEndTime)}`,
            staff: staff.name,
            services: userSelectedServices.map((service) => service.name),
          };
  
          slots.push(slot);
  
          // Record the booking for this staff member
          staff.bookings = staff.bookings || [];
          staff.bookings.push({
            start: formatTime(currentTime),
            end: formatTime(totalServiceEndTime),
            services: userSelectedServices.map((service) => service.name),
          });
        }
  
        currentTime = new Date(currentTime.getTime() + slotDuration * 60000); // Move to the next slot
      }
    });
  
    return slots;
  }
  
  // Helper: Check if a time range overlaps with another range
  function isTimeRangeOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1; // Overlap condition
  }
  
  // Helper: Parse time into a Date object
  function parseTime(timeStr, refDate) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const parsedTime = new Date(refDate);
    parsedTime.setHours(hours, minutes, 0, 0);
    return parsedTime;
  }
  
  // Helper: Format time as HH:MM
  function formatTime(date) {
    return date.toTimeString().slice(0, 5);
  }
  



const staffAvailability = [
  // Salon Category
  {
    name: 'Alice',
    category: 'Salon',
    startTime: '09:00',
    endTime: '17:00',
    breakTimes: [['12:00', '12:30'], ['15:00', '15:15']],
    specialties: ['haircut', 'bodymassage'],
    bookings: [
      { start: '10:00', end: '10:30', services: ['haircut'] },
    ],
  },

  // Fashion Category
  {
    name: 'Sophia',
    category: 'Fashion',
    startTime: '10:00',
    endTime: '18:00',
    breakTimes: [['13:00', '13:30']],
    specialties: ['makeup', 'styling'],
    bookings: [
      { start: '11:00', end: '12:00', services: ['makeup'] },
    ],
  },

  // Fitness Category
  {
    name: 'Mike',
    category: 'Fitness',
    startTime: '06:00',
    endTime: '14:00',
    breakTimes: [['09:00', '09:15']],
    specialties: ['personalTraining', 'yoga'],
    bookings: [
      { start: '07:00', end: '08:00', services: ['personalTraining'] },
    ],
  },

  // Doctor Category
  {
    name: 'Dr. Smith',
    category: 'Doctor',
    startTime: '08:00',
    endTime: '16:00',
    breakTimes: [['12:00', '12:30']],
    specialties: ['generalConsultation', 'cardiology'],
    bookings: [
      { start: '09:00', end: '09:30', services: ['generalConsultation'] },
    ],
  },

  // Legal Category
  {
    name: 'John',
    category: 'Legal',
    startTime: '09:00',
    endTime: '17:00',
    breakTimes: [['13:00', '13:30']],
    specialties: ['contractLaw', 'familyLaw'],
    bookings: [
      { start: '10:00', end: '11:00', services: ['contractLaw'] },
    ],
  },
];

const userSelectedServices = [
  // Salon Services
  { name: 'Haircut', duration: 30, requiredSpecialty: 'haircut', category: 'Salon' },
  { name: 'Body Massage', duration: 90, requiredSpecialty: 'bodymassage', category: 'Salon' },

  // Fashion Services
  { name: 'Makeup', duration: 60, requiredSpecialty: 'makeup', category: 'Fashion' },
  { name: 'Styling', duration: 45, requiredSpecialty: 'styling', category: 'Fashion' },

  // Fitness Services
  { name: 'Personal Training', duration: 60, requiredSpecialty: 'personalTraining', category: 'Fitness' },
  { name: 'Yoga', duration: 45, requiredSpecialty: 'yoga', category: 'Fitness' },

  // Doctor Services
  { name: 'General Consultation', duration: 30, requiredSpecialty: 'generalConsultation', category: 'Doctor' },
  { name: 'Cardiology Consultation', duration: 60, requiredSpecialty: 'cardiology', category: 'Doctor' },

  // Legal Services
  { name: 'Contract Law Consultation', duration: 60, requiredSpecialty: 'contractLaw', category: 'Legal' },
  { name: 'Family Law Consultation', duration: 90, requiredSpecialty: 'familyLaw', category: 'Legal' },
];
