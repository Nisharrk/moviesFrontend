let page = 1;
const perPage = 10;

function loadMovieData(title = null) {
  let url =
    "https://famous-bull-undershirt.cyclic.app/api/movies?page=" +
    page +
    "&perPage=" +
    perPage;

  if (title) {
    url += "&title=" + title;
    page = 1;
    document.querySelector(".pagination").classList.add("d-none");
  } else {
    document.querySelector(".pagination").classList.remove("d-none");
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Creating the <tr> Elements
      let movieRows = data.map((movie) => {
        let runtime =
          Math.floor(movie.runtime / 60) +
          ":" +
          (movie.runtime % 60).toString().padStart(2, "0");
        return `<tr data-id="${movie._id}">
                        <td>${movie.year}</td>
                        <td>${movie.title}</td>
                        <td>${movie.plot ? movie.plot : "N/A"}</td>
                        <td>${movie.rated ? movie.rated : "N/A"}</td>
                        <td>${runtime}</td>
                    </tr>`;
      });
      // Adding <tr> Elements to the Table
      let tableBody = document.querySelector("#moviesTable tbody");
      tableBody.innerHTML = movieRows.join("");

      movieRows.forEach((row) => {
        let tr = document.createElement("tr");
        tr.innerHTML = row;
        tableBody.appendChild(tr);
      });

      // Updating the "Current Page"
      const currentPage = document.querySelector("#current-page");
      currentPage.innerHTML = page;
    })
    .catch((error) => console.error(error));

  // select all of the <tr> elements in the table
  let movieRows = document.querySelectorAll("table tr");

  // loop through the <tr> elements and add a click event to each one
  movieRows.forEach((row) => {
    row.addEventListener("click", (event) => {
      // get the value of the "data-id" attribute of the clicked element
      let movieId = event.target.getAttribute("data-id");

      // make a request for data using the path: /api/movies/data-id
      fetch(`https://famous-bull-undershirt.cyclic.app/api/movies/${movieId}`)
        .then((response) => response.json())
        .then((data) => {
          // set the "modal-title" of your "detailsModal" to show the value of the title property
          document.querySelector(".modal-title").innerHTML = data.title;

          // build the HTML for the modal body
          let modalBodyHTML = `<img class="img-fluid w-100" src="${data.poster}"><br><br>`;
          modalBodyHTML += `<strong>Directed By:</strong> ${data.directors.join(
            ", "
          )}<br><br>`;
          modalBodyHTML += `<p>${data.fullplot.substring(0, 200)}...</p>`;
          if (data.cast) {
            modalBodyHTML += `<strong>Cast:</strong> ${data.cast.join(
              ", "
            )}<br><br>`;
          } else {
            modalBodyHTML += `<strong>Cast:</strong> N/A<br><br>`;
          }
          modalBodyHTML += `<strong>Awards:</strong> ${data.awards.text}<br>`;
          modalBodyHTML += `<strong>IMDB Rating:</strong> ${data.imdb.rating} (votes: ${data.imdb.votes})`;

          // update the modal body with the new HTML
          document.querySelector(".modal-body").innerHTML = modalBodyHTML;

          // show the modal
          $("#detailsModal").modal("show");
        });
    });
  });
}
