# ScholarSearch - AI-Powered Academic Search

ScholarSearch is a Next.js application that leverages Google's Gemini AI to provide intelligent academic search results. The application allows users to search for scholarly articles, research papers, and other academic resources.

## Features

- AI-powered search using Google's Gemini API
- Academic content discovery
- Filter results by content type
- Modern UI with dark/light mode support

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Gemini API key to `.env.local`

```
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and add it to your `.env.local` file

## Usage

1. Enter a search query in the search bar
2. View the AI-generated search results
3. Filter results by content type using the tabs
4. Click on results to view the source or download content

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Google Gemini AI
- shadcn/ui components

## License

This project is licensed under the MIT License.