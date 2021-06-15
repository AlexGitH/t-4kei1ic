USERS_URL = 'https://jsonplaceholder.typicode.com/users';

async function fetchGet( url ) {
  try {
    const response = await fetch( url );
    if ( !response.ok ) throw new Error( `Fetch GET status code: ${response.status}` );
    return await response.json();
  }
  catch (e) {
    throw e;
  }
}

async function createUser( {name, username, email, website, ...rest} ) {
  try {
    const response = await fetch( USERS_URL, {
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
    });
    if ( !response.ok ) throw new Error( `Fetch POST status code: ${response.status}` );
    return await response.json()
  }
  catch (e) {
    throw e;
  }
}

async function deleteUser( id ) {
  try {
    const response = await fetch(`${USERS_URL}/${id}`, {
      method: 'DELETE',
    });
    if ( !response.ok ) throw new Error( `Fetch DELETE status code: ${response.status}` );
    return id;
  }
  catch (e) {
    throw e;
  }
}

const columnHeaders = ['name','username','email','website'];

function renderTable( users ) {

  const thead = document.createElement( 'thead' );
  const tbody = document.createElement( 'tbody' );
  const table = document.createElement( 'table' );
  thead.append( prepareHeaders( columnHeaders ) );
  tbody.append( ...prepareRows( columnHeaders, users ) );
  table.append( thead, tbody );
  // tableContainer
  while( tableContainer.hasChildNodes() ) {
    tableContainer.removeChild(tableContainer.firstChild);
   }
  tableContainer.appendChild( table );
}

function showUserInfo(user) {
  console.log('showUserInfo:', 'user:', user);
}

function prepareHeaders( headers ) {
  const tr = document.createElement( 'tr' );
  const headerElements = headers.map( prop => {
    const th = document.createElement( 'th' );
    th.innerText = prop;
    th.style.textAlign ='left';
    th.addEventListener( 'click', ( (isDescSort=null) => e=>{
      isDescSort = !isDescSort;
      console.log( `sort data by column '${prop}' in ${isDescSort ? 'DESC': 'ASC'} order` );
    } )() )
    return th;
  } );
  const actionColumnHeader = document.createElement( 'th' );
  tr.append( ...headerElements, actionColumnHeader );
  return tr;
}

function prepareRows( headers, users ) {
  return users.map( user=>{
    const tr = document.createElement( 'tr' );
    tr.addEventListener( 'click', e=>{
      e.preventDefault();
      showUserInfo( user );
    } );

    const btnRemove = makeButtonRemove( user.id );
    tr.append( ...headers.map( makeCell( user ) ) , btnRemove );
    return tr;
  })
}

function makeCell( user ){
  return function( prop ){
    const td = document.createElement( 'td' );
    td.innerText = user[prop];
    return td;
  }
}

function makeButtonRemove( userId ) {
  const button = document.createElement( 'button' );
  button.innerText = 'X';
  button.addEventListener( 'click', async e=>{
    e.stopPropagation(); 
    try {
      const id = await deleteUser( userId );
      console.log( 'user REMOVED: ', id );
      // TODO: filter out deleted user by id and redraw table
    }
    catch( e ){
      throw e // show error popup
    };
  })
  return button;
}

( async(tableContainer) => {
  const users = await fetchGet( USERS_URL );
  renderTable( users );
  // tableContainer.innerHTML = `<table>
  //     <thead>
  //         <tr>
  //         ${columnHeaders.map( header=>`<th>${header}</th>`).join('')}
  //         </tr>
  //     </thead>
  //     <tbody>
  //         ${( await fetchGet( USERS_URL ) )
  //           .map( user => `<tr>${columnHeaders
  //             .map( prop =>`<td>${user[prop]}</td>`)
  //             .join('')} <td><button onclick="console.log('delete');">X</button></td></tr>` )
  //           .join('') }
  //     </tbody>)
  // </table>
  // `
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

