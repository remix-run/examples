export const isDateFormat = (date: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

export const calculateDaysUntilNextBirthday = (birthday: Date): number => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const birthdayThisYear = new Date(
    currentYear,
    birthday.getMonth(),
    birthday.getDate(),
  );
  const diff = birthdayThisYear.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 3600 * 24));
  return days < 0 ? 365 + days : days;
};
