# HR Helper (萬用工具箱)

This is a React application built with Vite, designed to assist with HR tasks.

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm

### Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```



### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) to view it in the browser.

### Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Deployment

### GitHub Pages

This project is configured to verify builds on GitHub Actions. To deploy to GitHub Pages:

1. Go to your repository settings on GitHub.
2. Navigate to **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. The provided workflow `.github/workflows/deploy.yml` will automatically build and deploy `dist/` branch to GitHub Pages on every push to `main`.

## Project Structure

- `src/`: Source code
  - `components/`: React components
  - `services/`: API services
- `public/`: Static assets
- `vite.config.ts`: Vite configuration
