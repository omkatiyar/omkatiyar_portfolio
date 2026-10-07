// Source of truth for project copy — used by both the HTML section and the 3D gallery/scene.
export const PROJECTS = [
  {
    title: 'AI Metering Service',
    short: 'AI Metering',
    description: 'Per-user AI usage metering that reserves estimated credits before the provider call and reconciles them against real token cost after — the same billing problem tools like Cursor and Claude Code face, where true cost is known only once the model responds.',
    github: 'https://github.com/omkatiyar/ai-metering-service',
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    features: [
      'Reserve-then-reconcile credit flow around every provider call',
      'Quota correctness under concurrent load via row-level locking',
      'UNIQUE idempotency constraint preventing double-charges on retries',
      'Partial and failed provider calls charged or released explicitly',
      'Tested against real Postgres, not mocks'
    ]
  },
  {
    title: 'Job Queue Visualizer',
    short: 'Job Queue',
    description: 'Real-time visualization of distributed job processing with retry logic, dead-letter routing, and backpressure monitoring.',
    technologies: ['Node.js', 'PostgreSQL', 'React', 'Docker Compose'],
    features: [
      'Push jobs via REST API, watch them process in real-time',
      'Visual dead-letter queue with retry/discard controls',
      'Configurable concurrency, backoff, and rate limiting',
      'Live dashboard with queue depth, throughput, and failure rate metrics'
    ]
  },
  {
    title: 'Webhook Relay Service',
    short: 'Webhook Relay',
    description: 'Self-hosted webhook inspection and replay tool with rate limiting, filtering, and delivery guarantees.',
    technologies: ['Node.js', 'PostgreSQL', 'React', 'Docker'],
    features: [
      'Receive, store, and inspect incoming webhooks in real-time',
      'Replay failed deliveries with exponential backoff',
      'Per-endpoint rate limiting and authentication',
      'Filterable event log with full request/response capture'
    ]
  },
  {
    title: 'Nifty Options Greeks Engine',
    short: 'Greeks Engine',
    description: 'Algorithmic trading engine using Black-Scholes model and Greek analysis for options signal generation on NSE.',
    period: 'Aug 2024 - Sep 2024',
    technologies: ['Rust', 'Python', 'NSE API', 'Black-Scholes Model'],
    features: [
      'Real-time option chain extraction via NSE API',
      'Black-Scholes Greeks calculation (Delta, Gamma, Theta, Vega)',
      'Signal generation engine with buy/sell thresholds',
      'Backtested: 62% win rate, 70% yearly ROI, 36% max drawdown'
    ]
  },
  {
    title: 'C++ System Design Patterns',
    short: 'C++ Patterns',
    description: 'Production-grade implementations of design patterns applied to real-world systems — Uber, Amazon, Zomato, and more.',
    technologies: ['C++', 'OOP', 'Design Patterns'],
    features: [
      'Strategy Pattern: Uber dynamic pricing, Amazon tax calculation',
      'Factory Pattern: Loan processing, cloud storage provisioning',
      'Observer Pattern: YouTube channel notifications, alert systems',
      'Multiple other design patterns like Singleton, Decorator, Builder etc. practiced along with these (See GitHub for more)'
    ]
  }
];
