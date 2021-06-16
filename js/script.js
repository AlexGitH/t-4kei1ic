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

// TODO: create userinfo modal
function showUserInfo(user) {
  console.log('showUserInfo:', 'user:', user);
  updateUserModal( user );
  showUserInfoModal();
}

function prepareHeaders( headers ) {
  const tr = document.createElement( 'tr' );
  const headerElements = headers.map( prop => {
    const th = document.createElement( 'th' );
    // TODO: move to styles;
    th.innerHTML = `<span style="display:inline-block; width:20px;" class="sort-direction" ></span>${prop}`;
    th.style.textAlign ='left';
    th.addEventListener( 'click', ( (isDescSort=null) => e=>{
      isDescSort = !isDescSort;
      const users = getUsers().sort( getComparator( prop, isDescSort ) );
      setUsers( users );
      redrawUserList( headers, users );
      resetAllOrderSigns();
      th.firstChild.innerText = isDescSort ? '↓' : '↑';
      console.log( `sort data by column '${prop}' in ${isDescSort ? 'DESC': 'ASC'} order` );
    } )() )
    return th;
  } );
  const actionColumnHeader = document.createElement( 'th' );
  tr.append( ...headerElements, actionColumnHeader );
  return tr;
}

function resetAllOrderSigns() {
  const headerCells = document.querySelector('#tableContainer>table>thead' ).firstChild.childNodes
  headerCells.forEach( cleanupOrderSign )
}

function cleanupOrderSign( {firstChild}) {
  if ( !firstChild ) return;
  firstChild.innerText = '';
}

function redrawUserList( headers, users ) {
  const tbody = document.querySelector('#tableContainer>table>tbody' );
  while( tbody.hasChildNodes() ) {
    tbody.removeChild(tbody.firstChild);
  }
  const rows = prepareRows( headers, users );
  tbody.append( ...rows );
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
  button.innerHTML = '&times;';
  button.addEventListener( 'click', async e=>{
    e.stopPropagation(); 
    try {
      button.setAttribute( 'disabled', true );
      const id = await deleteUser( userId );
      filterOutUser( id );
      console.log( 'user REMOVED: ', id );
      // TODO: filter out deleted user by id and redraw table
    }
    catch( e ){
      button.removeAttribute( 'disabled' );
      throw e // show error popup
    };
  })
  return button;
}

function filterOutUser( userId ) {
  const users = getUsers().filter( ({id}) => userId !== id )
  console.log('filterOutUser:', 'users:', users);
  setUsers( users );
  redrawUserList( columnHeaders, users )
}

{
  let users;

  function setUsers( fetchedUsers ) {
    users = fetchedUsers;
  }

  function getUsers() {
    return [...users];
  }
}

function compareDesc( a, b) {
  return a > b ?  1 : 
         a < b ? -1 : 0;
}

function compareAsc( a, b ) {
  return compareDesc( b, a );
}

function getComparator( propToCompare, isDesc=true ) {
  const comparator =  !isDesc ? compareAsc: compareDesc;
  return (userA,userB)=>comparator( userA[propToCompare], userB[propToCompare] );
}

( async(tableContainer) => {
  setUsers( await fetchGet( USERS_URL ) );
  renderTable( getUsers() );
  return null;
} )(tableContainer);

window.onload = function() {
  const { element, update } = createUserModalWindow()

  document.body.insertBefore( element, document.body.firstChild );
  window.userModal = element;
  window.updateUserModal = update;


  window.addEventListener( 'click', function(event) {
    if (event.target == element) {
      hideUserInfoModal();
    }
  })


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

