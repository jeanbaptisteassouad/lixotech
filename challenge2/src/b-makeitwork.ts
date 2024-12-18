(async () => {
	const urls = [
		{ url: "https://jsonplaceholder.typicode.com/posts/1" },
		{ url: "https://jsonplaceholder.typicode.com/posts/2" },
		{ url: "https://jsonplaceholder.typicode.com/posts/3" },
	];

	for (let i = 0; i < urls.length; i++) {
		const response = await fetch(urls[i].url);
		urls[i] = await response.json();
	}

	// should display a list of posts
	console.log(urls);
})();
