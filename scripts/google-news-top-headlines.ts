//https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen
function generateNewsJson() {
    const blocks = document.querySelectorAll('c-wiz[jsrenderer="ARwRbe"]');
    const newsItems = [];
    
    blocks.forEach((block, index) => {
        const firstArticle = block.querySelector('article');
        if (!firstArticle) return;
        
        const title = firstArticle.querySelector('.gPFEn')?.textContent;
        const featuredImage = firstArticle.querySelector('.Quavad')?.src;
        const sourceLogo = firstArticle.querySelector('.msvBD.zC7z7b')?.src;
        const sourceName = firstArticle.querySelector('.vr1PYe')?.textContent;
        const timestamp = firstArticle.querySelector('.hvbAAd')?.getAttribute('datetime');
        const author = firstArticle.querySelector('.bInasb span')?.textContent;
        const articleUrl = firstArticle.querySelector('a.WwrzSb')?.href;
        
        const newsItem = {
            id: String(index + 1),
            title,
            source: {
                name: sourceName,
                logo_transparent_light: sourceLogo,
                logo_transparent_dark: firstArticle.querySelector('.msvBD.krHqHb')?.src,
                dark_bg: '#000',
                light_bg: '#fff',
                dark_text: '#fff',
                light_text: '#000'
            },
            created_at: timestamp,
            author: {
                name: author
            },
            featured_image: featuredImage,
            card_type: 'full',
            has_next: index < blocks.length - 1,
            is_news_plus: Math.random() > 0.5,
            url: articleUrl
        };
        
        newsItems.push(newsItem);
    });
    
    return {
        news: newsItems
    };
}

// Usage
const newsJson = generateNewsJson();
console.log(JSON.stringify(newsJson, null, 2));