function parseNewsArticle(articleElement) {
    const title = articleElement.querySelector('.JtKRv').textContent;
    const source = {
        name: articleElement.querySelector('.vr1PYe').textContent,
        logo_transparent_light: articleElement.querySelector('.msvBD.zC7z7b')?.src || '',
        logo_transparent_dark: articleElement.querySelector('.msvBD.krHqHb')?.src || '',
        dark_bg: '#000',
        light_bg: '#fff',
        dark_text: '#fff',
        light_text: '#000'
    };
    
    const created_at = articleElement.querySelector('.hvbAAd')?.getAttribute('datetime') || '';
    const author = {
        name: articleElement.querySelector('.bInasb span')?.textContent || ''
    };
    
    const featured_image = articleElement.querySelector('.Quavad')?.src || '';

    return {
        id: Math.random().toString(36).substr(2, 9),
        title,
        source,
        created_at,
        topic: {
            id: 'news',
            name: 'news'
        },
        show_topic: true,
        author,
        featured_image,
        card_type: 'full',
        has_next: false,
        is_news_plus: Math.random() > 0.5
    };
}

function generateNewsJson(container) {
    const articles = Array.from(container.querySelectorAll('article.IFHyqb'));
    const newsItems = articles.map(parseNewsArticle);
    
    return {
        news: newsItems
    };
}

// Usage:
const container = document.querySelector('.i0Zvib');
const newsJson = generateNewsJson(container);
console.log(JSON.stringify(newsJson, null, 2));


//selector from homepage blocks