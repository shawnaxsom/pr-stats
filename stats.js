// https://stackoverflow.com/questions/55861526/how-can-i-track-how-long-pull-requests-have-been-open-on-github

import base64 from 'base-64';
import secrets from './secrets.json' assert { type: 'json' };

function formatDate(date) {
   return date.toISOString().replace('T', ' ').substr(0, 10);
}

async function timeElapsedTotal(pages) {
   for (let x = 0; x < pages; x++) {
      await timeElapsed(x);
   }
}

async function timeElapsed(page = 0){
   let headers = new Headers();
   let {
      username,
      password,
      repo,
   } = secrets;

   headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + password));

   let response = await fetch(`https://api.github.com/repos/${repo}/pulls?state=closed&per_page=100&page=${page}`, {
      method: 'GET',
      headers,
   });

   let jsonData = await response.json();

   jsonData.forEach(pr => {
      let closedAt = new Date(Date.parse(pr.closed_at));
      let createdAt = new Date(Date.parse(pr.created_at));
      let diff = closedAt.getTime() - createdAt.getTime();
      let hoursElapsed = Math.ceil(diff / (1000 * 60 * 60));

      new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      console.log(pr.created_at + ',' + formatDate(createdAt) + ',' + (createdAt.getMonth() + 1) + ',' + hoursElapsed);
      return hoursElapsed;
   });

}

console.log('created,date,month,hours_to_close');

timeElapsed(0)
   .then(timeElapsed(1))
   .then(timeElapsed(2))
   .then(timeElapsed(3));

