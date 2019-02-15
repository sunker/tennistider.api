const clubs = require('./clubs.json');
const matchi = require('./matchi.json');

const clubService = {};

clubService.getAllClubs = () => {
  let result = [];
  clubs.endpoints.matchi.forEach(club => {
    result.push(Object.assign({}, club, { tag: 'matchi' }));
  });

  clubs.endpoints.matchiPadel.forEach(club => {
    result.push(Object.assign({}, club, { tag: 'matchipadel' }));
  });

  clubs.endpoints.myCourt.clubs.forEach(club => {
    result.push(
      Object.assign({}, club, { tag: 'mycourt', url: club.bookingUrl })
    );
  });

  let enskede = clubs.endpoints.enskede;
  result.push(
    Object.assign({}, enskede, { tag: 'enskede', url: enskede.bookingUrl })
  );

  return result.map(addTagname);
};

clubService.getAllV2Clubs = () => {
  let result = [];

  matchi.forEach(club => {
    result.push(Object.assign({}, club, { tag: 'matchi' }));
  });

  clubs.endpoints.myCourt.clubs.forEach(club => {
    result.push(
      Object.assign({}, club, { tag: 'mycourt', url: club.bookingUrl })
    );
  });

  let enskede = clubs.endpoints.enskede;
  result.push(
    Object.assign({}, enskede, { tag: 'enskede', url: enskede.bookingUrl })
  );

  return result.map(addTagname);
};

function addTagname(c) {
  return {
    ...c,
    tagName: c.name
      .replace(/å/g, 'a')
      .replace(/Å/g, 'A')
      .replace(/ä/g, 'a')
      .replace(/Ä/g, 'A')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ /g, '-')
  };
}

module.exports = clubService;
