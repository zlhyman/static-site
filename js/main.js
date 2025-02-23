document.addEventListener('DOMContentLoaded', () => {
    // Handle navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', async (e) => {
            if (link.dataset.page) {
                e.preventDefault();
                await loadPage(link.dataset.page);
            }
        });
    });

    // Load home page content by default
    loadHomePage();
});

async function loadPage(page) {
    const contentDiv = document.getElementById('content');
    try {
        if (page === 'blog') {
            // Load blog index
            const response = await fetch('/blog/index.html');
            contentDiv.innerHTML = await response.text();
        } else {
            // Load regular pages
            const response = await fetch(`${page}.html`);
            contentDiv.innerHTML = await response.text();
        }
    } catch (error) {
        contentDiv.innerHTML = '<h1>Error</h1><p>Could not load the page.</p>';
    }
}

function loadHomePage() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <h1>Welcome to My Website</h1>
        <p>This is a simple website built with HTML, CSS, and JavaScript.</p>
        <p>Check out our <a href="#" data-page="blog">blog</a> or learn more 
           <a href="#" data-page="about">about us</a>.</p>
    `;
}

async function loadBlogListing() {
    // This is a simple implementation. In a real site, you'd want to 
    // dynamically load blog posts from a directory or API
    return `
        <h1>Blog Posts</h1>
        <ul>
            <li><a href="#" onclick="loadBlogPost('welcome')">Welcome to my blog!</a></li>
        </ul>
    `;
}

async function loadBlogPost(postId) {
    const contentDiv = document.getElementById('content');
    try {
        const response = await fetch(`blog/posts/${postId}.md`);
        const markdown = await response.text();
        contentDiv.innerHTML = marked.parse(markdown);
    } catch (error) {
        contentDiv.innerHTML = '<h1>Error</h1><p>Could not load the blog post.</p>';
    }
} 