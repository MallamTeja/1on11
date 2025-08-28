"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWithSerper = searchWithSerper;
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("./config");
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 11);
}
function getResultType(url) {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith('.pdf'))
        return 'pdf';
    if (lowerUrl.endsWith('.ppt') || lowerUrl.endsWith('.pptx'))
        return 'ppt';
    if (lowerUrl.endsWith('.doc') || lowerUrl.endsWith('.docx'))
        return 'docx';
    if (lowerUrl.endsWith('.jpg') ||
        lowerUrl.endsWith('.jpeg') ||
        lowerUrl.endsWith('.png') ||
        lowerUrl.endsWith('.gif') ||
        lowerUrl.endsWith('.bmp') ||
        lowerUrl.endsWith('.svg') ||
        lowerUrl.endsWith('.webp'))
        return 'image';
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (ytRegex.test(url))
        return 'youtube';
    return 'article';
}
async function generateSummary(title, snippet, link) {
    if (!config_1.config.gemini.apiKey) {
        return snippet || ''; // Fallback to snippet if API key is missing
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(config_1.config.gemini.apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Summarize the following content in 1-2 sentences:
Title: ${title}
${snippet ? `Snippet: ${snippet}` : ''}
${link ? `URL: ${link}` : ''}`;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    catch (error) {
        console.error('Error generating summary with Gemini:', error);
        return snippet || ''; // Fallback to snippet on error
    }
}
async function mapSerperToSearchResults(data, query, difficulty) {
    const results = [];
    // Map organic results
    if (Array.isArray(data.organic)) {
        data.organic.forEach((result) => {
            const type = getResultType(result.link);
            results.push({
                id: generateUniqueId(),
                title: result.title,
                source: new URL(result.link).hostname.replace('www.', ''),
                summary: result.snippet,
                url: result.link,
                type,
                year: result.date ? new Date(result.date).getFullYear() : undefined,
            });
            // Add sitelinks as separate results if present
            if (result.sitelinks && result.sitelinks.length > 0) {
                result.sitelinks.forEach((sitelink) => {
                    results.push({
                        id: generateUniqueId(),
                        title: sitelink.title,
                        source: new URL(sitelink.link).hostname.replace('www.', ''),
                        summary: '',
                        url: sitelink.link,
                        type: 'sitelink',
                    });
                });
            }
        });
    }
    // Map knowledge graph result if present
    if (data.knowledgeGraph) {
        results.push({
            id: generateUniqueId(),
            title: data.knowledgeGraph.title,
            source: 'knowledgeGraph',
            summary: data.knowledgeGraph.description || '',
            url: '',
            type: 'knowledgeGraph',
        });
    }
    // Map people also ask questions
    if (Array.isArray(data.peopleAlsoAsk)) {
        data.peopleAlsoAsk.forEach((qa) => {
            results.push({
                id: generateUniqueId(),
                title: qa.question,
                source: 'peopleAlsoAsk',
                summary: qa.snippet,
                url: qa.link,
                type: 'faq',
            });
        });
    }
    // Map video results (now using YouTube API data if available, or Serper's video results as fallback)
    if (Array.isArray(data.videos)) {
        for (const video of data.videos) {
            const summary = await generateSummary(video.title, video.description, video.link);
            results.push({
                id: generateUniqueId(),
                title: video.title,
                source: video.channel || new URL(video.link).hostname.replace('www.', ''),
                summary: summary,
                url: video.link,
                type: 'youtube',
                year: video.date ? new Date(video.date).getFullYear() : undefined,
            });
        }
    }
    // Map image results
    if (Array.isArray(data.images)) {
        data.images.forEach((image) => {
            results.push({
                id: generateUniqueId(),
                title: image.title,
                source: image.source || new URL(image.link).hostname.replace('www.', ''),
                summary: `Image from ${image.source || new URL(image.link).hostname.replace('www.', '')}`,
                url: image.link,
                type: 'image',
            });
        });
    }
    return results;
}
async function searchWithSerper(query, type, difficulty) {
    if (!config_1.config.serper.apiKey) {
        throw new Error('Serper API key is not configured.');
    }
    try {
        // Determine which Serper endpoint to use based on the type
        let endpoint = 'https://google.serper.dev/search';
        let useYouTubeAPI = false;
        if (type === 'image') {
            endpoint = 'https://google.serper.dev/images';
        }
        else if (type === 'video' || type === 'youtube') {
            // Prioritize YouTube API for video searches
            if (config_1.config.youtube.apiKey) {
                useYouTubeAPI = true;
            }
            else {
                endpoint = 'https://google.serper.dev/videos'; // Fallback to Serper videos if no YouTube key
            }
        }
        // Add specific search terms based on the type
        let searchQuery = query;
        if (difficulty && difficulty !== 'all') {
            searchQuery = `${query} ${difficulty} level`;
        }
        if (type === 'pdf') {
            searchQuery = `${searchQuery} filetype:pdf`;
        }
        else if (type === 'ppt') {
            searchQuery = `${searchQuery} filetype:ppt OR filetype:pptx`;
        }
        else if (type === 'docx') {
            searchQuery = `${searchQuery} filetype:doc OR filetype:docx`;
        }
        let data;
        if (useYouTubeAPI) {
            // YouTube API call
            const youtubeResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&key=${config_1.config.youtube.apiKey}&maxResults=10`);
            if (!youtubeResponse.ok) {
                throw new Error(`YouTube API error: ${youtubeResponse.status}`);
            }
            const youtubeData = await youtubeResponse.json();
            // Transform YouTube API response to SerperResponse.videos format
            data = { organic: [], videos: youtubeData.items?.map((item) => ({
                    title: item.snippet.title,
                    link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    thumbnail: item.snippet.thumbnails.default.url,
                    channel: item.snippet.channelTitle,
                    date: item.snippet.publishedAt,
                    description: item.snippet.description,
                })) || [] };
        }
        else {
            // Serper API call
            const serperResponse = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'X-API-KEY': config_1.config.serper.apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: searchQuery,
                    gl: 'us',
                    hl: 'en',
                }),
            });
            if (!serperResponse.ok) {
                throw new Error(`Serper API error: ${serperResponse.status}`);
            }
            data = await serperResponse.json();
        }
        return mapSerperToSearchResults(data, query, difficulty);
    }
    catch (err) {
        console.error('Serper search error:', err);
        throw new Error('Failed to fetch search results from Serper');
    }
}
