USERS_URL = 'https://jsonplaceholder.typicode.com/users';

async function fetchGet( url ) {
  try {
    return await fetch( url ).then( response=>response.json() )
  }
  catch (e) {
    throw new Error( e );
  }
}

async function createUser( {name, username, email, website, ...rest} ) {
  return await fetch( USERS_URL, {
  method: 'POST',
  body: JSON.stringify({
    name,
    username,
    email,
    website,
    ...rest
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));
}

const columnHeaders = ['name','username','email','website'];


( async(tableContainer) => {
  tableContainer.innerHTML = `<table>
      <thead>
          <tr>
          ${columnHeaders.map( header=>`<th>${header}</th>`).join('')}
          </tr>
      </thead>
      <tbody>
          ${( await fetchGet( USERS_URL ) )
            .map( user => `<tr>${columnHeaders
              .map( prop =>`<td>${user[prop]}</td>`)
              .join('')} <td><button onclick="console.log('delete');">X</button></td></tr>` )
            .join('') }
      </tbody>)
  </table>
  `
  return null;
} )(tableContainer);

window.onload = function() {
  btnCreateUser.addEventListener( 'click', ()=>{
    createUser({
      name: 'Jane Doe',
      username: 'janedoe21',
      email : 'janedoe@test.com',
      website : 'http://janedoe.testdomain.com',
    //   "address": {
    //   "street": "Kulas Light",
    //   "suite": "Apt. 556",
    //   "city": "Gwenborough",
    //   "zipcode": "92998-3874",
    //   "geo": {
    //     "lat": "-37.3159",
    //     "lng": "81.1496"
    //   }
    // },
    // "phone": "1-770-736-8031 x56442",
    });

    // createUser({
    //   name: 'Jane Doe',
    //   username: 'janedoe21',
    //   email : 'janedoe@test.com',
    //   website : 'http://janedoe.testdomain.com',
    //   "address": {
    //   "street": "Kulas Light",
    //   "suite": "Apt. 556",
    //   "city": "Gwenborough",
    //   "zipcode": "92998-3874",
    //   "geo": {
    //     "lat": "-37.3159",
    //     "lng": "81.1496"
    //   }
    // },
    // "phone": "1-770-736-8031 x56442",
    // });
  } )
}

