# ConsultGPT - AI Agents for Consulting

> Use your firm's knowledge to power critical workflows—from drafting proposals to scaling research—so consultants can focus on excellence.

## 🎯 What is ConsultGPT?

ConsultGPT is an AI-powered workspace for consulting firms, inspired by Kenley.ai and Operand. It helps firms leverage their institutional knowledge through critical workflows like:

- 🔍 **Rapid Commercial Diligence (RCD)** - Fast-track market analysis for M&A targets
- ⚔️ **Competitive Landscape & Battlecards** - Map competitors and build strategic insights
- 📊 **Market Sizing & TAM/SAM/SOM** - Calculate addressable markets with data-driven approaches
- 💰 **Procurement Savings Wave Plans** - Identify cost savings opportunities
- 📈 **Net Revenue Management** - Maximize revenue through pricing and channel optimization
- 🔢 **Unit Economics Analysis** - Model and optimize key metrics for SaaS/marketplace businesses

...and **10+ more WorkStreams** covering strategy, operations, pricing, and analytics.

---

## 🚀 Key Features

### 1. **Flexible Chat Interface**
- Conversational AI that understands consulting workflows
- File upload support (CSV, XLSX, TXT, PDFs)
- Context-aware responses based on your project needs

### 2. **WorkStreams Library**
Pre-built consulting templates for common workflows:
- Due Diligence & Research
- Strategy & Market Intelligence
- Operations & Transformation
- Pricing & Revenue Growth
- Analytics & Insights

### 3. **Smart Analysis**
- AI-powered research and data synthesis
- Generates decks, reports, and proposals
- Competitor intelligence integration (via APIs)
- Multi-source data analysis

### 4. **Chat History & Projects**
- Persistent chat sessions for ongoing projects
- Easy switching between multiple analyses
- Rename and organize your work
- Export results in various formats

---

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript (fully typed)
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion (smooth, natural motion)
- **File Uploads**: UploadThing
- **AI Integration**: OpenAI GPT-4 (via API routes)
- **State Management**: React Context + URL state
- **Font**: Instrument Sans (Google Fonts)

---

## 📁 Project Structure

```
/hackathon
├── app/
│   ├── api/                      # Backend API routes
│   │   ├── ai/                   # AI-related endpoints
│   │   ├── chat/                 # Chat management
│   │   ├── files/                # File handling
│   │   ├── analyze/              # Analysis workflows
│   │   └── uploadthing/          # File upload
│   ├── chat/[chatId]/            # Individual chat page
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Home page (WorkStreams grid)
│
├── components/
│   ├── ChatContainer.tsx         # Message display
│   ├── ChatInput.tsx             # Input with file upload
│   ├── ChatMessage.tsx           # Individual message
│   ├── ChatLayout.tsx            # Main layout wrapper
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── WelcomeScreen.tsx         # WorkStreams selection
│   └── ui/                       # Reusable UI components
│
├── lib/
│   ├── workstreams.ts            # WorkStream definitions
│   └── utils.ts                  # Utility functions
│
├── contexts/
│   └── ChatContext.tsx           # Chat state management
│
└── types/
    └── index.ts                  # TypeScript interfaces
```

---

## 🎨 Design Philosophy

### Visual Identity
- **Clean & Minimal**: Focus on content, not chrome
- **Professional**: Consulting-grade aesthetics
- **Smooth Animations**: Spring physics for natural motion
- **Glassmorphism**: Subtle backdrop blur effects
- **Responsive**: Mobile-first, works everywhere

### Color Palette
- **Primary**: Blue (#3B82F6) - Professional, trustworthy
- **Text**: Gray scale from #111827 to #6B7280
- **Backgrounds**: White with subtle gray tones
- **Accents**: Blue-50 for highlights, subtle shadows

### Typography
- **Font**: Instrument Sans (400, 500, 600, 700)
- **Line Height**: 1.4 (tighter, more professional)
- **Tracking**: Tight letter spacing for modern feel

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd hackathon

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys (OpenAI, UploadThing, etc.)

# Run the development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Environment Variables

Create a `.env.local` file:

```bash
# OpenAI API Key (for AI analysis)
OPENAI_API_KEY=sk-...

# UploadThing (for file uploads)
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...

# Database (if using)
DATABASE_URL=...

# Optional: Additional integrations
PERPLEXITY_API_KEY=...
FIRECRAWL_API_KEY=...
```

---

## 💡 How to Use

### 1. Start a New Project
- Click "New Project" in the sidebar
- Or start typing in the welcome screen

### 2. Choose a WorkStream
- Browse WorkStreams by category
- Click a card to auto-populate a relevant prompt
- Or use Quick Starters at the bottom

### 3. Chat & Upload
- Describe your consulting challenge
- Upload relevant files (CSVs, spreadsheets, PDFs)
- AI will analyze and provide insights

### 4. Iterate & Export
- Ask follow-up questions
- Request specific formats (decks, reports, etc.)
- Download results when ready

---

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding New WorkStreams

Edit `lib/workstreams.ts`:

```typescript
export const WORKSTREAMS: WorkStream[] = [
  {
    id: 'your-workstream-id',
    title: 'Your WorkStream Title',
    description: 'Brief description of what it does',
    icon: '🎯',
    taskCount: 10,
    category: 'strategy', // or 'diligence', 'operations', etc.
    tags: ['Tag1', 'Tag2'],
    prompt: 'Suggested prompt to start the analysis...'
  },
  // ... more workstreams
];
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
# Coming soon
```

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use this for your own projects!

---

## 🙏 Acknowledgments

- **Inspired by**: Kenley.ai, Operand, Linear, Vercel
- **UI Components**: Tailwind CSS, Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## 📞 Contact

Questions? Reach out:
- Email: your@email.com
- Twitter: @yourusername
- LinkedIn: /in/yourprofile

---

**Built with ❤️ during a hackathon**

Transforming consulting with AI, one conversation at a time.
