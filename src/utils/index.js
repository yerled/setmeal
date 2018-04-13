import moment from 'moment'

export function convertSize (value = 0, base = '', step = 1024) {
  let units = ['', 'K', 'M', 'G', 'T']
  let index = units.indexOf(base.toUpperCase())
  if (index < 0) {
    index = 0
  }
  let temp = value
  while (temp >= step && index < units.length) {
    temp = Math.round(temp / step * 100 / 100)
    index++
  }
  let unit = units[index]
  return temp + unit
}

export function initDictFromList (list = [], key = 'id') {
  let dict = {}
  list.forEach(e => {
    dict[e[key]] = e
  })
  return dict
}

export function dateFormat (date, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(date).format(pattern)
}
