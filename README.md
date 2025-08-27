# ScholarSearch - AI-Powered Academic Search

ScholarSearch is a full-stack application with a Next.js frontend and Node.js backend that leverages Google's Gemini AI to provide intelligent academic search results. The application allows users to search for scholarly articles, research papers, and other academic resources.

## Project Structure

```
.
├── frontend/              # Next.js frontend application
│   ├── app/              # App router pages and layouts
│   ├── components/       # Reusable UI components
│   ├── lib/             # Frontend utilities and services
│   └── public/          # Static assets
├── backend/             # Backend services
│   └── src/            # Backend source code
│       ├── config.ts   # Configuration
│       ├── gemini-service.ts  # Gemini AI integration
│       └── serper-service.ts  # Search API integration
├── package.json        # Project dependencies and scripts
└── tsconfig*.json     # TypeScript configurations
```

## Features

- AI-powered search using Google's Gemini API
- Academic content discovery
- Filter results by content type
- Modern UI with dark/light mode support
- Type-safe codebase with TypeScript

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Google Gemini API key
- Serper API key (for web search)
- YouTube API key (optional, for video search)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Set up environment variables:
   - Create `.env` file in the project root with the following variables:

```
# Frontend
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SERPER_API_KEY=your_serper_api_key_here
NEXT_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Backend
GEMINI_API_KEY=your_gemini_api_key_here
SERPER_API_KEY=your_serper_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here  # Optional
```

4. Run the development server:

```bash
# Start both frontend and backend
yarn dev

# Or start them separately
yarn dev:frontend  # Frontend only
yarn dev:backend   # Backend only (in watch mode)
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `yarn dev` - Start both frontend and backend in development mode
- `yarn build` - Build both frontend and backend for production
- `yarn start` - Start the production server
- `yarn lint` - Run ESLint on the codebase

## How to Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and add it to your `.env` file
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