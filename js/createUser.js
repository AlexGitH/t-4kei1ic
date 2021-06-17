const nameToElementMap = {
  name    : fldName,
  username: fldUserName,
  email   : fldEmail,
  website : fldWebsite,
  phone   : fldPhone,
  zipcode : fldZipcode,
  city    : fldCity,
  street  : fldStreet,
  suite   : fldSuite,
}

 
const fieldToValidatorMap = {
  name    : validateName,
  username: validateUserName,
  email   : validateEmail,
  website : validateWebsite,
  phone   : noValidator,
  zipcode : noValidator,
  city    : noValidator,
  street  : noValidator,
  suite   : noValidator,
}

const userCreateFormControls = [
  userCreateBtn,
  userCancelBtn,
  ...Object.values( nameToElementMap )
]

async function onValidateAndCreateUser() {

  refreshUserErrorInfo( null );// reset field

  const errors = validateUser( nameToElementMap )
    
  if ( errors.length > 0) {
    refreshUserErrorInfo( errors );
    return ;
  }

  const userData = createUserData();
  try {
    lockUserCreationControls();
    const newUser = await createUser( userData );
    console.log('onValidateAndCreateUser:', 'newUser:', newUser);
    addNewUser( newUser );
    hideCreateUserModal();
  }
  catch (e){
    refreshUserErrorInfo( e.message );
  }
  finally{
    unlockUserCreationControls();
  }

  console.log('onValidateAndCreateUser:', 'errors:', errors);
}

function onCancelUserCreation(){
  console.log('onCancelUserCreation:', 'arguments:', arguments);
  hideCreateUserModal();
}

function showCreateUserModal() {
  const modal = document.getElementById('userCreateModal');
  modal.style.display = "block";
}

function hideCreateUserModal() {
  const modal = document.getElementById('userCreateModal');
  //cleanup form 
  Object.values( nameToElementMap ).forEach( inputElem=> inputElem.value = '' );
  refreshUserErrorInfo( null );// reset field
  modal.style.display = "none";
}

function closeCreateUserModal( ) {
  hideCreateUserModal();
  console.log( 'userModal' );
}

function unlockUserCreationControls(){
  userCreateFormControls.forEach( control=>control.removeAttribute( 'disabled' ) )
}

function lockUserCreationControls(){
  userCreateFormControls.forEach( control=>control.setAttribute( 'disabled', true ) )
}

function createUserData() {
  const {city,street,suite,zipcode, ...rest } = Object.entries( nameToElementMap )
                                                  .reduce( (res,[key,{value}]) =>
                                                     {res[key] = value.trim();return res;}, {} );
  return {
    ...rest,
    address: {
      city,street,suite,zipcode,
      geo:{ lat:'',lng:'' }, 
    },
    company:  {
      name:'',
      catchPhrase: '',
      bs: ''
    }
  };
}

function refreshUserErrorInfo( errors ) {
  const errorElement = document.getElementById('userCreateError');
  if ( !errors || errors.length <= 0 ) { // cleanup
    // TODO: move to separated function;
    while( errorElement.hasChildNodes() ) {
      errorElement.removeChild(errorElement.firstChild);
    }
    return ;
  }
  if ( Array.isArray( errors ) && errors.length > 0 ) {
    errorElement.append( createErrorsListEl( errors ) );
  }
}

function createErrorsListEl( errors ) {
  const ul = document.createElement( 'ul' );
  ul.innerHTML = errors.map( message=>`<li>${message}</li>` ).join('');
  return ul;
}

// VALIDATION

function validateName( name ) {
  if ( name.trim() === '' ) {
    return 'Name field is mandatory';
  }
  for( const char of name ) {
    const code = char.charCodeAt( 0 );
    if ( code >= 48 && code <= 57 ) {
      return 'Numbers are not allowed in name field';
    }
  }
  return null;
}

function noValidator(){return null};

function validateUser( fields ) {

  const errors = Object.entries( fields ).reduce( (res,[key,field] )=>{
    const error = fieldToValidatorMap[key]( field.value );
    if ( !!error ) { res.push( (error) ) }
    return res;
  }, [] );
  
  return errors;
}
function isNotNumberOrLetterCode(code){
  return ( code < 48 || code > 57 ) &&
         ( code < 64 || code > 90 ) &&
         ( code < 97 || code > 122 )
}
function validateUserName( name ) {
  if ( name.trim() === '' ) {
    return 'Username field is mandatory';
  }
  for( const char of name ) {
    const code = char.charCodeAt( 0 );
    if ( isNotNumberOrLetterCode( code) ) {
      return 'Username must have only letters and numbers';
    }
  }
  if ( name.indexOf( ' ' ) >= 0 || name.indexOf( '\t' ) >= 0) {
    return 'Spaces are not allowed in username';
  }
  return null;
}

function validateEmail( email ) {
  const lastIndex = email.length - 1;
  const at = email.indexOf( '@' );
  const atLast = email.lastIndexOf( '@' );
  const dotFirst = email.indexOf( '.' );
  const dotLast = email.lastIndexOf( '.' );
  for( const char of email ) {
    const code = char.charCodeAt( 0 );
    if ( code !== 46 && code !== 64 && isNotNumberOrLetterCode( code ) ) {
      return 'Email must have only english letters, numbers, "." and "@" characters';
    }
  }
  if ( email.length <= 0 ) {
    return 'Email field is mandatory';
  }
  if ( at <= 0  ||  at !== atLast ) {
    return 'Email must have only one "@" character';
  }
  if ( email.indexOf( '@.' ) >= 0 || email.indexOf( '.@' ) >= 0 || email.indexOf( '..' ) >= 0 ) {
    return 'Email must not have "@.", ".@" or ".." character combinations';
  }
  if ( dotLast === lastIndex || at === lastIndex ) {
    return 'Email must not have trailing "." or "@" characters';
  }
  if ( at < 0 || dotFirst < 0 ) {
    return 'Email must have at least one "@" and "." characters';
  }
  if ( at < 1 || dotFirst < 1 ) {
    return 'Email must not have leading "@" or "." characters';
  }
  if ( atLast > dotLast ) {
    return 'Email must have leading at least one "." character after "@"';
  }
  return null;
}

function validateWebsite( website ) {
  const site = website.trim();
  const lastIndex = site.length - 1;
  const dotLast = site.lastIndexOf( '.' );
  const dotFirst = site.indexOf( '.' );
  for( const char of site ) {
    const code = char.charCodeAt( 0 );
    if ( code !== 46 && isNotNumberOrLetterCode( code ) ) {
      return 'Website must have only english letters, numbers and "." characters';
    }
  }
  if ( site.length <= 0 ) {
    return 'Website field is mandatory';
  }
  if ( dotLast === lastIndex ) {
    return 'Website must not have trailing "." character';
  }
  if ( dotFirst < 0 ) {
    return 'Website must not have at least one "." character';
  }
  if ( dotFirst < 1 ) {
    return 'Website must not have leading "." character';
  }
  return null;
}
