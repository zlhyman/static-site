const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');
const frontMatter = require('front-matter');

// Configure marked for security
marked.setOptions({
    headerIds: false,
    mangle: false
});

async function buildSite() {
    // Ensure build directory exists
    await fs.ensureDir('dist');
    
    // Copy static assets
    await fs.copy('src/css', 'dist/css');
    await fs.copy('src/js', 'dist/js');
    
    // Process markdown files
    await processPages();
    await processBlogPosts();
    
    // Copy index.html to dist
    await fs.copy('src/index.html', 'dist/index.html');
}

async function processPages() {
    const pagesDir = 'src/content';  // Changed from 'src/content/pages'
    const files = await fs.readdir(pagesDir);
    
    for (const file of files) {
        if (file.endsWith('.md')) {
            const content = await fs.readFile(path.join(pagesDir, file), 'utf8');
            const { attributes, body } = frontMatter(content);
            const html = marked.parse(body);
            
            await fs.writeFile(
                path.join('dist', file.replace('.md', '.html')),
                html
            );
        }
    }
}

async function processBlogPosts() {
    const postsDir = 'src/content/blog';
    const files = await fs.readdir(postsDir);
    
    const posts = [];
    
    for (const file of files) {
        if (file.endsWith('.md')) {
            const content = await fs.readFile(path.join(postsDir, file), 'utf8');
            const { attributes, body } = frontMatter(content);
            const html = marked.parse(body);
            
            const post = {
                slug: file.replace('.md', ''),
                title: attributes.title || 'Untitled',
                date: attributes.date,
                html
            };
            
            posts.push(post);
            
            await fs.ensureDir('dist/blog/posts');
            await fs.writeFile(
                path.join('dist/blog/posts', `${post.slug}.html`),
                html
            );
        }
    }
    
    // Create blog index
    const blogIndex = generateBlogIndex(posts);
    await fs.writeFile('dist/blog/index.html', blogIndex);
}

function generateBlogIndex(posts) {
    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return `
        <h1>Blog Posts</h1>
        <ul>
            ${sortedPosts.map(post => `
                <li>
                    <a href="/blog/posts/${post.slug}.html">${post.title}</a>
                    ${post.date ? `<small>(${new Date(post.date).toLocaleDateString()})</small>` : ''}
                </li>
            `).join('')}
        </ul>
    `;
}

buildSite().catch(console.error); 