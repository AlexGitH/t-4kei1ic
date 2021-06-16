function createUserModalWindow() {
  const modal = document.createElement( 'div' );
  const modalContent = document.createElement( 'div' );
  const modalHeader = document.createElement( 'div' );

  const closeButton = document.createElement( 'span' );
  closeButton.className = 'close';
  closeButton.innerHTML = '&times;'
  closeButton.addEventListener( 'click', hideUserInfoModal )
  const modalBody = document.createElement( 'div' );
  const title = document.createElement( 'h2' );

  modal.id = 'userInfoModal';
  modal.className = 'modal';

  modalContent.className = 'modal-content'
  modalHeader.className = 'modal-header'
  modalBody.className = 'modal-body'

  modalHeader.append( closeButton, title );
  modalContent.append( modalHeader, modalBody);
  modal.append( modalContent );
  
  const fieldTitleMap = [
    ['username', 'User name'],
    ['email', 'Email'],
    ['website','Website'],
    ['phone', 'Phone'],
    ['address', 'Address', ( {zipcode, city, street, suite, geo:{lat,lng} } )=>`${zipcode}, ${city}, ${street}, ${suite}, (${lat}, ${lng})` ],
    ['company', 'Company', ( {name} ) => name ],
  ]

  const update = user => {
    title.innerText = `${user.name}`
    const formatValue = ( format, value )=>typeof format === 'function' ? format(value) : value;
    const rows = fieldTitleMap.map( ([key,title, formatFn])=>
                                        `<tr>
                                          <th>${title}:</th>
                                          <td>${formatValue( formatFn, user[key] )}</td>
                                        </tr>`)
                                      .join('');
    modalBody.innerHTML = `<table><tbody>${rows}</tbody></table>`
  };

  return { element: modal, update };
}

function showUserInfoModal() {
  const modal = document.getElementById('userInfoModal');
  modal.style.display = "block";
}

function hideUserInfoModal() {
  const modal = document.getElementById('userInfoModal');
  modal.style.display = "none";
}
