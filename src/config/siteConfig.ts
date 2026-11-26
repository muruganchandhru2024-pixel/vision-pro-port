/**
 * Central configuration for external application launch target and optional developer links.
 * All environment variables are optional. Developer buttons remain hidden unless configured.
 */
function readOptionalEnv(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export const DEFAULT_LAUNCH_APP_URL =
  readOptionalEnv(import.meta.env.VITE_LAUNCH_APP_URL)?.replace(/\/+$/, '') ||
  'http://localhost:3001';

export const SITE_CONFIG = {
  projectName: 'VisionFlow AI',
  tagline: 'An intelligent vision system built for the future of urban mobility.',
  launchAppUrl: DEFAULT_LAUNCH_APP_URL,
  developer: {
    name: 'VisionFlow Engineering',
    role: 'Independent Computer Vision & Full-Stack Systems Developer',
    bio: 'Independently engineered from scratch to investigate how Next.js, Python, FastAPI, YOLO object detection, and OpenCV tracking can transform fixed municipal intersection feeds into structured urban mobility telemetry.',
    githubUrl: readOptionalEnv(import.meta.env.VITE_GITHUB_URL),
    linkedinUrl: readOptionalEnv(import.meta.env.VITE_LINKEDIN_URL),
    personalPortfolioUrl: readOptionalEnv(import.meta.env.VITE_PORTFOLIO_URL),
    email: readOptionalEnv(import.meta.env.VITE_CONTACT_EMAIL),
  },
} as const;

export function buildAppRouteUrl(baseUrl: string, routePath: string): string {
  const cleanBase = (baseUrl || DEFAULT_LAUNCH_APP_URL).trim().replace(/\/+$/, '');
  const cleanRoute = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return `${cleanBase}${cleanRoute}`;
}
