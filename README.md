# Resume Scanner Application

A modern web application for scanning, analyzing, and managing resumes using AI and advanced text processing.

## Features

- Resume parsing and analysis
- AI-powered skill extraction
- Multi-language support
- PDF and DOCX file support
- Redis-backed caching and rate limiting
- Modern UI with Next.js and Tailwind CSS

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- pnpm (recommended) or npm

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd scan
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables:
     - `REDIS_URL`: Redis connection URL (default: redis://localhost:6379)
     - `GEMINI_API_KEY`: Your Google Gemini API key
     - `NEXT_PUBLIC_APP_URL`: Your application URL
     - `RESEND_API_KEY`: (Optional) For email features

4. **Start Redis**
   ```bash
   docker-compose up -d
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

- `/app` - Next.js application routes and pages
- `/components` - React components
- `/lib` - Utility functions and business logic
- `/public` - Static assets
- `/styles` - Global styles and Tailwind CSS configuration
- `/hooks` - Custom React hooks

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Docker

The project includes Docker configuration for Redis:
- Persistence enabled
- Port: 6379
- Data volume: redis_data

## Dependencies

Key dependencies include:
- Next.js 14
- React 18
- Tailwind CSS
- Redis (via ioredis)
- Google Gemini API
- PDF processing libraries
- Various UI components from Radix UI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. # scan
