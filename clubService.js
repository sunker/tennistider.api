const clubs = require('./clubs.json')

const clubService = {}

clubService.getAllClubs = () => {
  let result = []
  clubs.endpoints.matchi.forEach((club) => {
    result.push(Object.assign({}, club, { tag: 'matchi' }))
  })

  clubs.endpoints.matchiPadel.forEach((club) => {
    result.push(Object.assign({}, club, { tag: 'matchipadel' }))
  })

  clubs.endpoints.myCourt.clubs.forEach((club) => {
    result.push(Object.assign({}, club, { tag: 'mycourt', url: club.bookingUrl }))
  })

  result.push(Object.assign({}, clubs.endpoints.hellas, { tag: 'hellas' }))

  let enskede = clubs.endpoints.enskede
  result.push(Object.assign({}, enskede, { tag: 'enskede', url: enskede.bookingUrl }))

  return result
}

module.exports = clubService
