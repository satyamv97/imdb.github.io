
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const movieDetails = document.getElementById('movieDetails');
const favlistItem = document.getElementById('fav_list');
const Favourite = []; // creating favourite list array which will add into this 
//list on each add fav trigger
loadFavList(); // calling this on every load to show result on screen


searchInput.addEventListener('input', () => { //event listener for search
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== '') {
    searchMovies(searchTerm);
  } else {
    searchResults.innerHTML = '';
  }
});

//whenever we type anything in search bar it will run this query but this omdbapi 
//can fetch only 10 results at a time so need to write more letters to
//start showing search results
function searchMovies(query) {

  const url = `https://www.omdbapi.com/?s=${query}&apikey=88da2735`;//&page=1

  // Clear previous search results
  searchResults.innerHTML = '';
  //console.log(query);

  // Fetch movie results from the OMDB API
  fetch(`${url}`)
    .then(response => response.json())
    .then(data => {
      if (data.Search) {
        const movies = data.Search;
        // console.log(movies);

        // Display search results
        movies.forEach(movie => {
          const listItem = document.createElement('li');
          const listDiv = document.createElement('div');
          listItem.classList.add('movie-item');
          listDiv.textContent = movie.Title;

          //adding favourite button with each results
          const favouriteBtn = document.createElement('button');
          favouriteBtn.classList.add('fav')
          favouriteBtn.textContent = 'Favourite';

          //adding eventlistener to add into fav list
          favouriteBtn.addEventListener('click', () => {
            //console.log(movie.Title)
            addToFav(movie.Title);

          })

          //event listener for showing movie which will call showMovieDetails function
          listDiv.addEventListener('click', () => {
            showMovieDetails(movie.imdbID);
            ///console.log(movie.imdbID)
          });

          listItem.appendChild(listDiv);
          listItem.appendChild(favouriteBtn);
          searchResults.appendChild(listItem);
        });
      }
    })
    .catch(error => {
      console.log('Error:', error); //if any error occurs it will run while fetching url
    });
}

//on clicking favourite of each search result this will run
function addToFav(value) {
  if (Favourite.includes(value)) {
    ///console.log("already");
    return; //return if already exist in Favourites list
  }
  ///console.log(value)
  Favourite.push(value);
  ///console.log(Favourite);


  const favList = document.createElement('li');
  favList.classList.add('fav_list_item');
  const favDiv = document.createElement('div')
  favDiv.textContent = value;

  //adding close button with every fav list
  var closeSpan = document.createElement("button");
  closeSpan.textContent = "x";
  closeSpan.className = "close";
  favList.append(favDiv)
  favList.appendChild(closeSpan);

  closeSpan.addEventListener('click', function () {
    favList.remove(); //clicking on cloise button it will remove that value from list

    //save the updated list to local storage
    saveFavoriteList(); //after each close IT IS REQUIRED to call this to update list


  })



  favlistItem.appendChild(favList);
  console.log(favlistItem);
  saveFavoriteList(); //after each adding in fav list require to save list

}

//function to save favourite list
function saveFavoriteList() {
  ///console.log("inside savefav")
  const favoriteList = document.getElementById('fav_list');
  const item = favoriteList.getElementsByTagName("div");
  const favoriteItem = [];
  ///console.log(favoriteItem + 'inside savfav-1' + item)

  for (let i = 0; i < item.length; i++) {
    favoriteItem.push(item[i].textContent);
    // console.log(favoriteItem + '12')
  }
  //it will add it into local storage
  localStorage.setItem("favouriteItems", JSON.stringify(favoriteItem));


}

//function to load favorite list from local storage
function loadFavList() {
  //console.log("inside load fav")
  const storedItems = JSON.parse(localStorage.getItem("favouriteItems"));
  //console.log("inside load fav store" + storedItems)

  if (storedItems) {
    for (let i = 0; i < storedItems.length; i++) {
      addToFav(storedItems[i]);
      //console.log("inside load ffav after adding")

    }
  }
}

//for showing movie details on new tab
function showMovieDetails(movieId) {

  //console.log(movieId);
  const url = `https://www.omdbapi.com/?apikey=88da2735&i=${movieId}`;

  //for opening new tab for this
  const newtab = window.open('', '_blank');


  // Fetch detailed information about the movie from the OMDB API
  fetch(url)
    .then(response => response.json())
    .then(movie => {
      // Display movie details
      newtab.document.write(`
        <h2>${movie.Title}</h2>
        <p><img src=${movie.Poster}/></p>
        <p>${movie.Plot}</p>
        <p>Genre: ${movie.Genre}</p>
        <p>Genre: ${movie.Year}</p>
        <p>Genre: ${movie.Rated}</p>
      `);
      movieDetails.style.display = 'block';
    })
    .catch(error => {
      console.log('Error:', error);
    })

}


