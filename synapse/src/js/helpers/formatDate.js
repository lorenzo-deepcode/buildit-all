import moment from 'moment';

const formatDate = date => {
  if (date) {
    return moment(date).format('MMMM Do YYYY');
  }
  return '';
};

export default formatDate;
