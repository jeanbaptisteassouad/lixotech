// There are two solutions: one runs the promises one at a time, and the other runs them concurrently.

type Post = {
	userId: number;
	id: number;
	title: string;
	body: string;
};

const fetchOnePost = async (postId: number): Promise<Post | null> => {
	try {
		const response = await fetch(
			`https://jsonplaceholder.typicode.com/posts/${postId}`,
		);
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};

const synchronouslyGetAllPosts = async (
	postIds: Array<number>,
): Promise<Array<Post>> => {
	const posts: Array<Post> = [];

	for (const postId of postIds) {
		const post = await fetchOnePost(postId);
		if (post !== null) {
			posts.push(post);
		}
	}

	return posts;
};

const concurentlyGetAllPosts = async (
	postIds: Array<number>,
): Promise<Array<Post>> => {
	return (
		await Promise.all(postIds.map((postId) => fetchOnePost(postId)))
	).filter((post) => post !== null);
};

const main = async () => {
	const postIds = [1, 2, 3];

	console.log(await concurentlyGetAllPosts(postIds));
};

main();
