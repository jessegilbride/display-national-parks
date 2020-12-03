'use strict';

function generateAddress(parkItem) {
  // console.log(parkItem[1].addresses[0]);

  const line1 = parkItem[1].addresses[0].line1;
  const line2 = parkItem[1].addresses[0].line2;
  const line3 = parkItem[1].addresses[0].line3;
  const city = parkItem[1].addresses[0].city;
  const stateCode = parkItem[1].addresses[0].stateCode;
  const postalCode = parkItem[1].addresses[0].postalCode;

  return `
  ${line1 ? line1 + '<br>' : ''}
  ${line2 ? line2 + '<br>' : ''}
  ${line3 ? line3 + '<br>' : ''}
  ${city}, ${stateCode} ${postalCode}`
}

function generateParksListItem(parkItem) {
  // console.log("generateParksListItem() ran");
  
  const parkName = parkItem[1].fullName;
  const parkDescription = parkItem[1].description;
  const parkAddress = generateAddress(parkItem);
  const parkURL = parkItem[1].url;

  // console.log(parkAddress[0]);

  return `
  <li>
    <h3>${parkName}</h3>
    <p>${parkDescription}</p>
    <p class="park-address">${parkAddress}</p>
    <p><a href="${parkURL}" class="park-link" target=_blank>${parkURL}</a></p>
  </li>`
}

function generateParksListString(parksJSON) {
  const parksListString = Object.entries(parksJSON.data)
    .map(parkItem => generateParksListItem(parkItem));

  return parksListString.join('');
}

function displayParks(parksJSON) {
  $('#results').removeClass('hidden');
  
  const stateSelected = $('#js-search-state option:selected').html()
  $('#js-state-name').text(stateSelected);

  const parksList = generateParksListString(parksJSON);
  $('#js-parks-list').append(parksList);
}

function formatQueryParameters(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getParks(state, maxResults) {
  const apiKey = `EX5vPnbF6BdSnDqOJ1LzfbtvteCuXigfoC1toC9k`;
  const endpointURL = `https://developer.nps.gov/api/v1/parks`;
  const params = {
    api_key: apiKey,
    stateCode: state,
    limit: maxResults
  };
  const queryString = formatQueryParameters(params);
  const url = `${endpointURL}?${queryString}`;

  fetch(url)
    .then(
      response => {
      if (response.ok) {
        return response.json();
      }
      // throw new Error(response.statusText);
    })
    .then(
      responseJSON => displayParks(responseJSON)
      )
    .catch(
      error => {
        alert("fetch response failed")
        $('#results').addClass('hidden'); // hide prior results, if in DOM
        $('#js-error-message').text(`${error.message}`);
      }
    );
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#js-parks-list').empty();
    const searchState = $('#js-search-state').val();
    const maxResults = $('#js-search-results-limit').val();
    getParks(searchState, maxResults);
  });
}

$(watchForm);