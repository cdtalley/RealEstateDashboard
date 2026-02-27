# Real Estate Portfolio Dashboard

An advanced, production-ready real estate analytics dashboard built with Next.js, TypeScript, and modern data visualization libraries. This dashboard provides comprehensive insights for association admins and portfolio managers.

## Features

- **Comprehensive Metrics**: Portfolio value, revenue, occupancy rates, and ROI tracking
- **Advanced Visualizations**: 
  - Revenue & expenses time series analysis
  - Occupancy rate trends
  - Market trends and price analysis
  - Top performing properties
  - Geographic distribution
- **Interactive Property Table**: Sortable, filterable property portfolio with search functionality
- **Real-time Data**: Realistic dummy data generation with 150+ properties
- **Modern UI**: Beautiful, responsive design with dark theme and smooth animations
- **Production Ready**: TypeScript, optimized performance, scalable architecture

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Advanced charting library
- **Framer Motion** - Smooth animations
- **Lucide React** - Modern icon library
- **date-fns** - Date manipulation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/              # API routes for data endpoints
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main dashboard page
├── components/           # React components
│   ├── Dashboard.tsx     # Main dashboard container
│   ├── MetricCard.tsx   # Key metrics display
│   ├── RevenueChart.tsx # Revenue visualization
│   ├── OccupancyChart.tsx
│   ├── MarketTrendsChart.tsx
│   ├── PropertyPerformanceChart.tsx
│   ├── GeographicDistribution.tsx
│   └── PropertyTable.tsx
└── lib/
    ├── types.ts          # TypeScript interfaces
    └── data-generator.ts # Realistic data generation
```

## Data Generation

The dashboard uses programmatically generated realistic data including:
- 150+ properties across 8 major US cities
- 24 months of financial metrics
- 36 months of market trends
- Property performance metrics
- Geographic distribution data

All data is generated server-side via API routes for optimal performance.

## Key Metrics Tracked

- **Portfolio Value**: Total current value of all properties
- **Annual Revenue**: Total rental income
- **Occupancy Rate**: Average occupancy across portfolio
- **ROI**: Return on investment metrics
- **Cap Rate**: Capitalization rate analysis
- **Market Trends**: Price and rent trends over time
- **Geographic Distribution**: Properties by location

## Customization

The dashboard is highly customizable:
- Modify data generation in `lib/data-generator.ts`
- Adjust visualizations in component files
- Update styling via Tailwind classes
- Add new metrics by extending types in `lib/types.ts`

## Performance Optimizations

- Server-side data generation
- Client-side memoization for expensive computations
- Responsive image loading
- Optimized re-renders with React hooks
- Efficient chart rendering with Recharts

## License

MIT

