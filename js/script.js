USERS_URL = 'https://jsonplaceholder.typicode.com/users';

async function fetchGet( url ) {
  try {
    return await fetch( url ).then( response=>response.json() )
  }
  catch (e) {
    throw new Error( e );
  }
}

const columnHeaders = ['name','username','email','website'];


( async(doc) => {
  doc.body.innerHTML = `<table>
      <thead>
          <tr>
          ${columnHeaders.map( header=>`<th>${header}</th>`).join('')}
          </tr>
      </thead>
      <tbody>
          ${( await fetchGet( USERS_URL ) )
            .map( user => `<tr>${columnHeaders
              .map( prop =>`<td>${user[prop]}</td>`)
              .join('')}</tr>` )
            .join('') }
      </tbody>
  </table>
  `
  return null;
} )(document);
