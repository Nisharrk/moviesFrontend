let page = 1;
const perPage = 10;

function loadMovieData(title = null) {
  let url = `https://famous-bull-undershirt.cyclic.app/api/movies?page=${page}&perPage=${perPage}`;

  if (title) {
    url += `&title=${title}`;
    document.querySelector(".pagination").classList.add("d-none");
    page = 1;
  } else {
    document.querySelector(".pagination").classList.remove("d-none");
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let movieRows = data.map((movie) => {
        let plot = movie.plot || "N/A";
        let rated = movie.rated || "N/A";
        let runtime = movie.runtime;
        let hours = runtime ? Math.floor(runtime / 60) : "N/A";
        let minutes = runtime
          ? (runtime % 60).toString().padStart(2, "0")
          : "N/A";

        return `
        <tr data-id="${movie._id}">
          <td>${movie.year}</td>
          <td>${movie.title}</td>
          <td>${plot}</td>
          <td>${rated}</td>
          <td>${hours}:${minutes}</td>
        </tr>
        `;
      });

      document.querySelector("tbody").innerHTML = movieRows.join("");

      let movieRowsArray = Array.from(document.querySelectorAll("tbody tr"));
      movieRowsArray.forEach((row) => {
        row.addEventListener("click", (e) => {
          let id = e.currentTarget.getAttribute("data-id");
          fetch(`https://famous-bull-undershirt.cyclic.app/api/movies/${id}`)
            .then((response) => response.json())
            .then((data) => {
              // Populate and display the modal with the movie data
              document.querySelector(".modal-title").innerHTML = data.title;

              // build the HTML for the modal body
              let modalBodyHTML = `<img class="img-fluid w-100" src="${data.poster}"><br><br>`;
              modalBodyHTML += `<strong>Directed By:</strong> ${data.directors.join(
                ", "
              )}<br><br>`;
              if (data.fullplot) {
                modalBodyHTML += `<p>${data.fullplot.substring(0, 200)}...</p>`;
              } else {
                modalBodyHTML += `<p>N/A</p>`;
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

      document.querySelector("#current-page").innerHTML = page;
    })
    .catch((error) => console.log(error));
}

document.addEventListener("DOMContentLoaded", function () {
  loadMovieData();

  document
    .querySelector("#previous-page")
    .addEventListener("click", function () {
      if (page > 1) {
        page--;
        loadMovieData();
      }
    });

  document.querySelector("#next-page").addEventListener("click", function () {
    page++;
    loadMovieData();
  });

  document
    .querySelector("#searchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      let title = document.querySelector("#title").value;
      loadMovieData(title);
    });

  document.querySelector("#clearForm").addEventListener("click", function () {
    document.querySelector("#title").value = "";
    loadMovieData();
  });
});
