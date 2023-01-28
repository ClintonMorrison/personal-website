import moment from 'moment'

export function formatDate(date) {
  return moment(date).format('MMM YYYY')
}

export function formatNumber(number) {
  return `${number}` // TODO
}
