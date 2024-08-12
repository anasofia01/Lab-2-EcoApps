document.getElementById('fetch-button').addEventListener('click', fetchData);

async function fetchData() {
	showState('loading');
	try {
		const postResponse = await fetch('http://localhost:3004/posts');
		if (!postResponse.ok) {
			throw new Error('Network response was not ok');
		}
		const dataPost = await postResponse.json();
		const userResponse = await fetch('http://localhost:3004/users');
		if (!userResponse.ok) {
			throw new Error('Network response was not ok');
		}
		const userData = await userResponse.json();
		renderData(dataPost, userData);
		showState('data-container');
	} catch (error) {
		showState('error');
	}
}

function showState(state) {
	const states = ['loading', 'error', 'data-container'];
	states.forEach((s) => setVisibility(s, s === state));
}

function setVisibility(id, isVisible) {
	document.getElementById(id).style.display = isVisible ? 'block' : 'none';
}

function renderData(dataPost, userData) {
	const container = document.getElementById('data-container');
	if (dataPost.length > 0 && userData.length > 0) {
		container.innerHTML = dataPost
			.map((post) => {
				const user = userData.find((u) => parseInt(u.id) === parseInt(post.userId));
				return `
      <div class="post">
        <h2>${post.title}</h2>
        <p>${post.body}</p>
        <p><b>Author:</b> ${user ? user.name : 'Anónimo'}</p>
        <button class="delete-button" data-id="${post.id}">Delete</button>
      </div>
      `;
			})
			.join('');
		document.querySelectorAll('.delete-button').forEach((button) => {
			button.addEventListener('click', deletePost);
		});
	}
}

async function deletePost(event) {
	const postId = event.target.dataset.id;
	try {
		const response = await fetch(`http://localhost:3004/posts/${postId}`, {
			method: 'DELETE',
		});
		if (!response.ok) {
			// Reload the page to reflect the changes
			throw new Error('Network response was not ok');
		}
		fetchData();
	} catch (error) {
		showState('error');
	}
}

document.getElementById('open-modal-button').addEventListener('click', openModal);
document.getElementById('close-modal-button').addEventListener('click', closeModal);
document.getElementById('post-form').addEventListener('submit', addPost);

function openModal() {
	document.getElementById('modal').style.display = 'block';
}

function closeModal() {
	document.getElementById('modal').style.display = 'none';
}

async function addPost(event) {
	event.preventDefault();
	const userId = document.getElementById('user-id').value;
	const title = document.getElementById('title').value;
	const body = document.getElementById('body').value;
	try {
		const response = await fetch('http://localhost:3004/posts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				title,
				body,
			}),
		});
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		closeModal();
		fetchData();
	} catch (error) {
		showState('error');
	}
}
