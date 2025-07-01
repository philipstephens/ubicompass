# 🧭 UBI Compass - Production Ready

**Universal Basic Income Policy Analysis Tool**

A comprehensive, multilingual UBI feasibility calculator powered by real Canadian economic data from Statistics Canada (2000-2023). Democratizing UBI policy analysis for billions of people worldwide.

## 🌟 Features

- **📊 Real Economic Data**: Statistics Canada datasets covering GDP, government finances, population, and income distribution
- **🌍 Multilingual Support**: 70+ languages via Google Translate API integration
- **⚡ Real-time Calculations**: Interactive sliders with instant feasibility assessment
- **🎯 Professional Analysis**: GDP percentage, budget impact, and feasibility scoring
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🔒 Secure**: CSP-compliant with modern security practices

## 🚀 Live Demo

[Try UBI Compass](https://your-domain.com) - Available in English, French, Spanish, and 70+ other languages

---

## 📁 Project Structure

```bash
ubi-compass/
├── src/
│   ├── routes/
│   │   ├── api/translate/          # Google Translate API integration
│   │   ├── api/statscan/           # Statistics Canada data endpoints
│   │   └── ubi-compass-simple/     # Main UBI calculator interface
│   ├── components/                 # Reusable UI components
│   └── utils/                      # Utility functions
├── utilities/                      # Python data processing scripts
├── docs/                          # Documentation and guides
├── scripts/                       # PowerShell automation scripts
└── public/                        # Static assets
```

## 🛠️ Technology Stack

- **Frontend**: [Qwik](https://qwik.dev/) + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: PostgreSQL with Statistics Canada data
- **Translation**: Google Translate API
- **Charts**: Chart.js for data visualization
- **Deployment**: Ready for Vercel, Netlify, or any Node.js host

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 16+ (for local development)
- Google Cloud account (for translation features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/philipstephens/ubi-compass.git
cd ubi-compass
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database and API keys
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5173/ubi-compass-simple/
```

## 🌍 Translation Setup

To enable multilingual support:

1. **Create Google Cloud Project**
2. **Enable Cloud Translation API**
3. **Create API Key**
4. **Add to .env file**:
```bash
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

## 📊 Data Sources

- **Statistics Canada**: GDP, government finances, population data
- **Canadian Census**: Demographic breakdowns
- **Bank of Canada**: Inflation and economic indicators
- **Coverage**: 2000-2023 with comprehensive economic datasets

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Statistics Canada for comprehensive economic data
- Google Translate for multilingual accessibility
- Qwik team for the amazing framework

## Vercel Edge

This starter site is configured to deploy to [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions), which means it will be rendered at an edge location near to your users.

## Installation

The adaptor will add a new `vite.config.ts` within the `adapters/` directory, and a new entry file will be created, such as:

```
└── adapters/
    └── vercel-edge/
        └── vite.config.ts
└── src/
    └── entry.vercel-edge.tsx
```

Additionally, within the `package.json`, the `build.server` script will be updated with the Vercel Edge build.

## Production build

To build the application for production, use the `build` command, this command will automatically run `npm run build.server` and `npm run build.client`:

```shell
npm run build
```

[Read the full guide here](https://github.com/QwikDev/qwik/blob/main/starters/adapters/vercel-edge/README.md)

## Dev deploy

To deploy the application for development:

```shell
npm run deploy
```

Notice that you might need a [Vercel account](https://docs.Vercel.com/get-started/) in order to complete this step!

## Production deploy

The project is ready to be deployed to Vercel. However, you will need to create a git repository and push the code to it.

You can [deploy your site to Vercel](https://vercel.com/docs/concepts/deployments/overview) either via a Git provider integration or through the Vercel CLI.
