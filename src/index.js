const keyApi = "7c9ef28bca3f2dc2ed8b6a517cada404"; // Tu API key
const imgElements = [
	document.querySelector(".img1"),
	document.querySelector(".img2"),
	document.querySelector(".img3"),
];
const search = document.querySelector(".search");
const inputSearch = document.querySelector(".input-search");
const boxImg = document.querySelector(".box-content-img");
const paginationContainer = document.querySelector(".pagination");

let currentPage = 1;
let totalPages = 100;

const fetchApi = async (urlApi) => {
	const response = await fetch(urlApi, {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer YOUR_TOKEN_HERE`,
		},
	});
	const result = await response.json();
	totalPages = result.total_pages;
	return result.results;
};

const updateImages = (pelis) => {
	pelis.forEach((pelis, index) => {
		if (imgElements[index]) {
			imgElements[index].setAttribute(
				"src",
				`https://image.tmdb.org/t/p/w500${pelis.poster_path}`
			);
		}
	});
};

const renderMovies = (pelis) => {
	boxImg.innerHTML = pelis
		.map(
			(item) => `
		<div class="box-img-pelis">
			<img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" alt="" class="img-pelis" />
		</div>
	`
		)
		.join("");
};

const loadPopularMovies = async (page = 1, limit = 18) => {
	const pelis = await fetchApi(
		`https://api.themoviedb.org/3/discover/movie?api_key=${keyApi}&include_adult=false&include_video=true&language=en-US&page=${page}&sort_by=popularity.desc`
	);
	const limitedPelis = pelis.slice(0, limit);
	updateImages(limitedPelis);
	renderMovies(limitedPelis);
	updatePagination(page);
};

const updatePagination = (page) => {
	paginationContainer.innerHTML = "";

	const maxButtons = 5;
	let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
	let endPage = Math.min(totalPages, startPage + maxButtons - 1);

	if (endPage - startPage < maxButtons - 1) {
		startPage = Math.max(1, endPage - maxButtons + 1);
	}

	if (page > 1) {
		const prevButton = document.createElement("button");
		prevButton.textContent = "Anterior";
		prevButton.classList.add("btn-pagination");
		prevButton.onclick = () => loadPopularMovies(page - 1);
		paginationContainer.appendChild(prevButton);
	}

	for (let i = startPage; i <= endPage; i++) {
		const pageButton = document.createElement("button");
		pageButton.textContent = i;
		pageButton.classList.add("btn-pagination");
		pageButton.onclick = () => loadPopularMovies(i);
		if (i === page) {
			pageButton.disabled = true;
		}
		paginationContainer.appendChild(pageButton);
	}

	if (page < totalPages) {
		const nextButton = document.createElement("button");
		nextButton.textContent = "Siguiente";
		nextButton.classList.add("btn-pagination");
		nextButton.onclick = () => loadPopularMovies(page + 1);
		paginationContainer.appendChild(nextButton);
	}
};

loadPopularMovies(currentPage);

search.addEventListener("click", async () => {
	const inputvalue = inputSearch.value;
	const query = `https://api.themoviedb.org/3/search/movie?api_key=${keyApi}&query=${inputvalue}&language=es-ES`;
	const dataSearch = await fetchApi(query);
	if (dataSearch.length > 0) {
		renderMovies(dataSearch);
		updatePagination(1);
	} else {
		boxImg.innerHTML = "<p>No se encontraron resultados.</p>";
	}
});

inputSearch.addEventListener("input", async () => {
	if (inputSearch.value === "") {
		await loadPopularMovies(currentPage);
	}
});
