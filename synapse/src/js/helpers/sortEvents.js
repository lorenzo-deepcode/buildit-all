import moment from 'moment';

const sortEvents = events => {
  if (!events) return undefined;

  if (events.length < 1) return events;

  return events.sort((a, b) => {
    const dateA = moment(a.startTime);
    const dateB = moment(b.startTime);

    if (dateA.isBefore(dateB)) return -1;
    if (dateA.isAfter(dateB)) return 1;
    return 0;
  });
};

export default sortEvents;
