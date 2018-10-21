const mongoose = require('mongoose'),
  TimeSlot = require('./TimeSlot'),
  Schema = mongoose.Schema

const slotSchema = new Schema({
  id: {
    type: Schema.ObjectId
  },
  key: {
    type: String,
    required: true,
    unique: true,
    index: {
      unique: true
    }
  },
  date: Date,
  startTime: Number,
  endTime: Number,
  clubId: Number,
  clubName: String,
  price: Number,
  courtNumber: Number,
  surface: String,
  link: String,
  createdAt: { type: Date, expires: '30d', default: Date.now }
})

slotSchema.methods = {
  timeSlot() {
    return new TimeSlot(Number(this.startTime, this.endTime))
  },
  isOnWeekend() {
    return (this.date.getDay() === 6) || (this.date.getDay() === 0)
  },
  isMorningSlot() {
    return (!this.isOnWeekend() && this.startTime >= 7 && this.endTime <= 9)
  },
  isLunchtimeSlot() {
    return (!this.isOnWeekend() && this.startTime >= 11 && this.endTime <= 13)
  },
  isWeekdayNightSlot() {
    return (!this.isOnWeekend() && this.startTime >= 17)
  },
  getSlotKey() {
    return this.date.getFullYear() + '_' + (this.date.getMonth() + 1) + '_' + this.date.getDate() + '_' + this.clubId + '_' + this.startTime.toFixed(2).toString() + '-' + this.endTime.toFixed(2).toString() + '_' + (this.surface ? this.surface : 'uknownsurface') + '_' + this.courtNumber + '_' + this.type
  },
  getSlotKeyExcludingCourtNumber() {
    return this.date.getFullYear() + '_' + (this.date.getMonth() + 1) + '_' + this.date.getDate() + '_' + this.clubId + '_' + this.startTime.toFixed(2).toString() + '-' + this.endTime.toFixed(2).toString() + '_' + (this.surface ? this.surface : 'uknownsurface') + '_' + this.type
  },
  daysFromToday() {
    const ONE_DAY = 1000 * 60 * 60 * 24
    const date1ms = new Date().getTime()
    const date2ms = this.date.getTime()
    const differencems = Math.abs(date1ms - date2ms)

    return Math.round(differencems / ONE_DAY)
  },
  getKey(userId) {
    return userId + '_' + this.getSlotKey()
  },
  toString() {
    return this.toSwedishDay() + ' ' + this.date.getDate() + '/' + (this.date.getMonth() + 1) + ' kl ' + this.startTime.toFixed(2).toString() + '-' + this.endTime.toFixed(2).toString() + ' ' + (this.surface ? this.surface : '')
  },
  toSwedishDay() {
    switch (this.date.getDay()) {
      case 1:
        return 'måndag'
      case 2:
        return 'tisdag'
      case 3:
        return 'onsdag'
      case 4:
        return 'torsdag'
      case 5:
        return 'fredag'
      case 6:
        return 'lördag'
      case 0:
        return 'söndag'
      default:
        return ''
    }
  }
}

slotSchema.statics = {
  saveMany: (slots) => {
    return Promise.all(slots.map((slot) => {
      return new Promise((resolve, reject) => {
        Slot.findOne({ key: slot.key }, (err, docs) => {
          if (!docs) {
            const item = new Slot({
              key: slot.key,
              date: slot._date,
              startTime: slot.timeSlot.startTime,
              endTime: slot.timeSlot.endTime,
              clubId: slot.clubId,
              clubName: slot.clubName,
              price: slot.price,
              courtNumber: slot.courtNumber,
              surface: slot.surface,
              link: slot.link,
              type: slot.type
            })
            item.save(function (err) {
              if (err) {
                if (err.code !== 11000) {
                  console.log(err)
                }
                resolve(false)
              } else {
                resolve(item)
              }
            })
          } else {
            resolve(false)
          }
        })
      })
    })
    )
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      Slot.find({ date: { $gte: new Date() } }, function (err, slots) {
        if (err) {
          reject(err)
        } else {
          resolve(slots)
        }
      })
    })
  },
  getByDate: (query) => {
    if (query.date) {
      const startDate = new Date(new Date(new Date(new Date(query.date).setHours(0)).setMinutes(0)).setSeconds(0))
      const endDate = new Date(new Date(startDate).setDate(startDate.getDate() + 1))
      Object.assign(query, { date: { "$gte": startDate, "$lt": endDate } })
    }
    return new Promise((resolve, reject) => {
      Slot.find(query, function (err, slots) {
        if (err) {
          reject(err)
        } else {
          resolve(slots)
        }
      })
    })
  },
  getUpcoming: () => {
    return new Promise((resolve, reject) => {
      Slot.find({ date: { $gte: new Date() }}, function (err, slots) {
        if (err) {
          reject(err)
        } else {
          resolve(slots)
        }
      })
    })
  }
}

const Slot = mongoose.model('slot', slotSchema)

module.exports = Slot
