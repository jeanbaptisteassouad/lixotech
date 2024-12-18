// CR: Better to use a const or let instead of a var. Var variable are hoisted and are not block-scoped.
// CR: For simplicity and to be more DRY, use an array of integers called postIds.
var urls = [
	{ url: "https://jsonplaceholder.typicode.com/posts/1" },
	{ url: "https://jsonplaceholder.typicode.com/posts/2" },
	{ url: "https://jsonplaceholder.typicode.com/posts/3" },
];

// CR: Missing let for the i declaration.
// CR: Bad for ending condition, must use < instead of <=.
for (i = 0; i <= urls.length; i++) {
	// CR: Missing const for the response declaration.
	// CR: urls[i] is incorrect, it must be « urls[i].url ».
	// CR: Fetch returns a promise. It must be awaited or thened.
	// CR: Fetch can fail. What should we do in this case?
	response = fetch(urls[i]);

	// CR: Should not reuse urls. It would be better to use another variable, like posts.
	// CR: We want the json body, so we must call .json method on the response and await it.
	// CR: We also need to take care of the exception if the body is invalid JSON.
	urls[i] = response;
}

// should display a list of posts
console.log(urls);
