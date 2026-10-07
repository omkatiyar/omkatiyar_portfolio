import { AMBER, CYAN, OFFWHITE, P } from './SpecVisual';

// Black-Scholes-flavoured curves: shape breathes as "volatility" drifts.
const sigma = (tt) => 0.75 + 0.3 * Math.sin(tt * 0.7);
const GREEK_CURVES = [
  { // Delta
    n: 56, x0: -2.3, x1: 2.3, color: CYAN, opacity: 0.85,
    fn: (x, tt) => -1.0 + 1.9 / (1 + Math.exp((-x * 1.6) / sigma(tt))),
  },
  { // Gamma
    n: 56, x0: -2.3, x1: 2.3, color: OFFWHITE, opacity: 0.7,
    fn: (x, tt) => -1.0 + 1.5 * Math.exp(-Math.pow(x / sigma(tt), 2) * 0.9),
  },
  { // Vega
    n: 56, x0: -2.3, x1: 2.3, color: AMBER, opacity: 0.75,
    fn: (x, tt) => -1.0 + 1.0 * Math.exp(-Math.pow(x / (sigma(tt) * 1.4), 2)),
  },
  { // Theta
    n: 56, x0: -2.3, x1: 2.3, color: AMBER, opacity: 0.4,
    fn: (x, tt) => -0.15 - 0.55 * Math.exp(-Math.pow(x / sigma(tt), 2)),
  },
];

// Order matches the project data in ProjectSection (repo order).
export const SPECS = [
  {
    // AI Metering Service: reserve credits -> provider call -> reconcile real cost
    nodes: [
      { p: P(-2.4), kind: 'oct', color: OFFWHITE, size: 0.12 },
      { p: P(-1.1), kind: 'ring', color: AMBER, size: 0.2 },
      { p: P(0.5, 0.55), kind: 'stack', color: CYAN, size: 0.2 },
      { p: P(2.0), kind: 'oct', color: AMBER, size: 0.2 },
      { p: P(-0.3, -1.2), kind: 'box', color: OFFWHITE, size: 0.16 },
    ],
    links: [[0, 1], [1, 2], [2, 3], [1, 4], [3, 4]],
    paths: [
      { via: [0, 1, 2, 3], count: 3, speed: 0.16 },
      { via: [1, 4], count: 1, speed: 0.2 },
      { via: [3, 4], count: 1, speed: 0.18 },
    ],
  },
  {
    // Job Queue Visualizer: jobs -> queue -> workers -> success; failure -> DLQ -> retry
    nodes: [
      { p: P(-2.4), kind: 'oct', color: OFFWHITE, size: 0.12 },
      { p: P(-1.0), kind: 'stack', color: AMBER, size: 0.22, breathe: true },
      { p: P(0.5, 0.6), kind: 'oct', color: AMBER, size: 0.15 },
      { p: P(0.5, -0.6), kind: 'oct', color: AMBER, size: 0.15 },
      { p: P(2.2), kind: 'box', color: OFFWHITE, size: 0.17 },
      { p: P(1.0, -1.5), kind: 'box', color: CYAN, size: 0.14 },
    ],
    links: [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5]],
    paths: [
      { via: [0, 1, 2, 4], count: 3, speed: 0.2 },
      { via: [0, 1, 3, 4], count: 2, speed: 0.22 },
      { via: [3, 5, 1], count: 1, speed: 0.17, color: CYAN },
    ],
  },
  {
    // Webhook Relay: source -> endpoint -> relay -> destination; failed delivery replayed
    nodes: [
      { p: P(-2.4), kind: 'oct', color: OFFWHITE, size: 0.12 },
      { p: P(-1.2), kind: 'box', color: OFFWHITE, size: 0.16 },
      { p: P(0.1), kind: 'stack', color: AMBER, size: 0.22 },
      { p: P(2.0, 0.5), kind: 'oct', color: OFFWHITE, size: 0.15 },
      { p: P(1.1, -1.0), kind: 'box', color: CYAN, size: 0.13 },
    ],
    links: [[0, 1], [1, 2], [2, 3], [2, 4]],
    paths: [
      { via: [0, 1, 2, 3], count: 3, speed: 0.18 },
      { via: [2, 4, 2, 3], count: 1, speed: 0.12, color: CYAN },
    ],
  },
  {
    // Nifty Options Greeks Engine: Delta / Gamma / Vega / Theta curves under drifting volatility
    nodes: [
      { p: P(-2.4, -1.0), kind: 'oct', color: OFFWHITE, size: 0.05 },
      { p: P(2.4, -1.0), kind: 'oct', color: OFFWHITE, size: 0.05 },
      { p: P(0, 1.2), kind: 'oct', color: OFFWHITE, size: 0.05 },
      { p: P(0, -1.0), kind: 'oct', color: OFFWHITE, size: 0.05 },
    ],
    links: [[0, 1], [2, 3]],
    paths: [],
    curves: GREEK_CURVES,
    scans: [
      { curve: 0, speed: 0.08, color: CYAN },
      { curve: 1, speed: 0.06, color: OFFWHITE },
    ],
  },
  {
    // C++ System Design Patterns: Factory -> product -> Strategy context; Observer notifications
    nodes: [
      { p: P(0.2, 0.2), kind: 'oct', color: AMBER, size: 0.2 },
      { p: P(1.7, 1.0), kind: 'oct', color: OFFWHITE, size: 0.11 },
      { p: P(1.9, 0.2), kind: 'oct', color: OFFWHITE, size: 0.11 },
      { p: P(1.7, -0.6), kind: 'oct', color: OFFWHITE, size: 0.11 },
      { p: P(-1.9, 0.9), kind: 'box', color: AMBER, size: 0.17 },
      { p: P(-1.0, 1.1), kind: 'oct', color: OFFWHITE, size: 0.11 },
      { p: P(-1.5, -1.0), kind: 'stack', color: AMBER, size: 0.17 },
      { p: P(-0.3, -1.4), kind: 'oct', color: OFFWHITE, size: 0.1 },
      { p: P(0.7, -1.2), kind: 'oct', color: OFFWHITE, size: 0.1 },
    ],
    links: [[0, 1], [0, 2], [0, 3], [4, 5], [5, 0], [6, 7], [6, 8]],
    paths: [
      { via: [4, 5, 0], count: 1, speed: 0.2 },
      { via: [0, 2], count: 1, speed: 0.18 },
      { via: [6, 7], count: 1, speed: 0.25 },
      { via: [6, 8], count: 1, speed: 0.22 },
    ],
  },
];

