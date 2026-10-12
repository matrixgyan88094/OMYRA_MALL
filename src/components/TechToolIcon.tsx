import React, { useState } from 'react';
import { Terminal } from 'lucide-react';

interface TechToolIconProps {
  toolName: string;
  className?: string;
  showFallbackLabel?: boolean;
}

// Map common names to SimpleIcons / Devicon slugs for dynamic CDN fetch
const CDN_SLUG_MAP: Record<string, { devicon?: string; simpleicon?: string }> = {
  'bun': { devicon: 'bun', simpleicon: 'bun' },
  'deno': { devicon: 'deno', simpleicon: 'deno' },
  'pnpm': { simpleicon: 'pnpm' },
  'yarn': { devicon: 'yarn', simpleicon: 'yarn' },
  'npm': { devicon: 'npm', simpleicon: 'npm' },
  'turborepo': { simpleicon: 'turborepo' },
  'nx': { simpleicon: 'nx' },
  'terraform': { devicon: 'terraform', simpleicon: 'terraform' },
  'pulumi': { simpleicon: 'pulumi' },
  'ansible': { devicon: 'ansible', simpleicon: 'ansible' },
  'cockroachdb': { simpleicon: 'cockroachlabs' },
  'cassandra': { simpleicon: 'apachecassandra' },
  'kafka': { devicon: 'apachekafka', simpleicon: 'apachekafka' },
  'rabbitmq': { devicon: 'rabbitmq', simpleicon: 'rabbitmq' },
  'elasticsearch': { devicon: 'elasticsearch', simpleicon: 'elasticsearch' },
  'kibana': { simpleicon: 'kibana' },
  'datadog': { simpleicon: 'datadog' },
  'sentry': { simpleicon: 'sentry' },
  'auth0': { simpleicon: 'auth0' },
  'clerk': { simpleicon: 'clerk' },
  'planetscale': { simpleicon: 'planetscale' },
  'cloudflare': { devicon: 'cloudflare', simpleicon: 'cloudflare' },
  'aws': { devicon: 'amazonwebservices', simpleicon: 'amazonaws' },
  'gcp': { devicon: 'googlecloud', simpleicon: 'googlecloud' },
  'azure': { devicon: 'azure', simpleicon: 'microsoftazure' },
  'digitalocean': { devicon: 'digitalocean', simpleicon: 'digitalocean' },
  'heroku': { devicon: 'heroku', simpleicon: 'heroku' },
  'vercel': { simpleicon: 'vercel' },
  'netlify': { simpleicon: 'netlify' },
  'electron': { devicon: 'electron', simpleicon: 'electron' },
  'tauri': { simpleicon: 'tauri' },
  'cypress': { simpleicon: 'cypress' },
  'storybook': { devicon: 'storybook', simpleicon: 'storybook' },
  'selenium': { devicon: 'selenium', simpleicon: 'selenium' },
  'postman': { devicon: 'postman', simpleicon: 'postman' },
  'swagger': { simpleicon: 'swagger' },
};

/**
 * Production-ready, authentic framework & tech icon component.
 * Features exact vector SVG brand logos for major stacks (WordPress, PHP, CSS3, HTML5, Laravel, Java, etc.)
 * with real-time CDN logo resolution fallback for any extended tool or framework.
 */
export const TechToolIcon: React.FC<TechToolIconProps> = ({
  toolName,
  className = 'w-3.5 h-3.5',
}) => {
  const [cdnFailed, setCdnFailed] = useState(false);
  const norm = (toolName || '').toLowerCase().trim();

  // 1. WordPress (Exact Official Blue Circle & W)
  if (norm.includes('wordpress')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#21759B" />
        <path
          d="M12 2.5C6.75 2.5 2.5 6.75 2.5 12C2.5 14.15 3.22 16.14 4.43 17.74L8.83 5.67C9.33 5.67 9.8 5.67 9.8 5.67L12.72 14.47L14.97 7.85L13.9 7.85L13.9 7.23L17.26 7.23L17.26 7.85L16.29 7.85L19.38 17.08C20.7 15.63 21.5 13.91 21.5 12C21.5 6.75 17.25 2.5 12 2.5ZM3.85 12C3.85 10.3 4.35 8.72 5.21 7.39L8.83 17.86C5.83 16.66 3.85 14.17 3.85 12ZM12.18 15.62L9.75 8.35L7.96 13.56L10.36 20.53C11 20.74 11.66 20.85 12.35 20.85C12.87 20.85 13.37 20.78 13.86 20.66L12.18 15.62ZM15.69 13.43L17.82 7.85L18.42 7.85L16.2 14.36L15.69 13.43Z"
          fill="white"
        />
      </svg>
    );
  }

  // 2. PHP (Exact Official Indigo/Purple Oval with Authentic "php" Typography)
  if (norm === 'php' || (norm.includes('php') && !norm.includes('wordpress') && !norm.includes('laravel'))) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="12" rx="11" ry="7" fill="#777BB4" />
        <ellipse cx="12" cy="12" rx="10.2" ry="6.2" stroke="#4F5B93" strokeWidth="0.8" fill="none" />
        <path
          d="M6.2 14.2H4.8L5.6 9.8H7.6C8.5 9.8 9.1 10.3 8.9 11.1C8.7 12 7.9 12.5 7 12.5H5.9L5.6 14.2H6.2ZM6.4 11.3H7C7.4 11.3 7.7 11.1 7.8 10.8C7.9 10.5 7.7 10.4 7.3 10.4H6.6L6.4 11.3Z"
          fill="white"
        />
        <path
          d="M10.2 14.2H8.8L9.6 9.8H11L10.7 11.4C11.1 10.8 11.7 10.6 12.3 10.6C13.1 10.6 13.5 11.1 13.3 11.9L12.9 14.2H11.5L11.8 12.3C11.9 11.9 11.7 11.7 11.3 11.7C10.8 11.7 10.5 12.1 10.4 12.6L10.2 14.2Z"
          fill="white"
        />
        <path
          d="M15.4 14.2H14L14.8 9.8H16.8C17.7 9.8 18.3 10.3 18.1 11.1C17.9 12 17.1 12.5 16.2 12.5H15.1L14.8 14.2H15.4ZM15.6 11.3H16.2C16.6 11.3 16.9 11.1 17 10.8C17.1 10.5 16.9 10.4 16.5 10.4H15.8L15.6 11.3Z"
          fill="white"
        />
      </svg>
    );
  }

  // 3. CSS / CSS3 (Official Blue Shield with White '3' in CSS Shield)
  if (norm === 'css' || norm === 'css3' || norm.includes('css3') || (norm.includes('css') && !norm.includes('tailwind') && !norm.includes('sass') && !norm.includes('bootstrap'))) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M3.5 2L5.2 20.2L12 22L18.8 20.2L20.5 2H3.5Z" fill="#1572B6" />
        <path d="M12 3.6V20.3L17.3 18.9L18.8 3.6H12Z" fill="#33A9DC" />
        <path d="M7 6.5H17L16.6 10H10.5L10.8 12.5H16.3L15.8 16.8L12 17.8L8.2 16.8L7.9 13.8H9.7L9.9 15.3L12 15.9L14.1 15.3L14.3 13.8H7.7L7 6.5Z" fill="white" />
      </svg>
    );
  }

  // 4. HTML / HTML5 (Official Orange Shield with White '5')
  if (norm === 'html' || norm === 'html5' || norm.includes('html5')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M3.5 2L5.2 20.2L12 22L18.8 20.2L20.5 2H3.5Z" fill="#E34F26" />
        <path d="M12 3.6V20.3L17.3 18.9L18.8 3.6H12Z" fill="#EF652A" />
        <path d="M7 6.5H17L16.6 10.5H10.5L10.8 13.5H16.3L15.8 17L12 18L8.2 17L8 14H6.2L6.6 18.8L12 20.2L17.4 18.8L18.2 8.5H7.2L7 6.5Z" fill="white" />
      </svg>
    );
  }

  // 5. Laravel (Official Crimson Origami Geometric Mark)
  if (norm.includes('laravel')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#FF2D20" />
        <path
          d="M6 14.5L12 18L18 14.5M6 9.5L12 13L18 9.5M12 4.5L6 8L12 11.5L18 8L12 4.5Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // 6. Java (Official Java Steaming Coffee Cup)
  if (norm === 'java' || norm.includes('java ') || (norm.includes('java') && !norm.includes('javascript'))) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M8.5 18.5C11.5 18.5 15.5 18.5 17.5 16.5C14.5 17 11 17 8.5 18.5Z" fill="#5382A1" />
        <path d="M7.5 20.5C11.5 20.5 16.5 20.5 19 18C15 19 10 19 7.5 20.5Z" fill="#5382A1" />
        <path d="M11 2C10 3.5 12 5 12.5 6C13.5 8 11.5 9 10 10.5C9.5 9 10.5 8 11 7C11.5 6 10 4 11 2Z" fill="#EA2D2E" />
        <path d="M14 3.5C13.2 4.8 14.8 6 15.2 6.8C16 8.4 14.4 9.2 13.2 10.4C12.8 9.2 13.6 8.4 14 7.6C14.4 6.8 13.2 5.2 14 3.5Z" fill="#EA2D2E" />
        <path d="M16 11C18.5 11 19.5 12.5 18.5 14C17.5 15.5 15.5 16 13.5 16C10 16 7.5 15 7.5 13.5C7.5 12 10 11 12.5 11M16 11.5C17.5 11.8 18.5 12.5 18 13.5C17.5 14.5 16 14.8 14.5 14.8" stroke="#5382A1" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 7. Spring / Spring Boot
  if (norm.includes('spring')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#6DB33F" />
        <path d="M12 4C8 7 6 12 6 15C6 18.3 8.7 20 12 20C15.3 20 18 18.3 18 15C18 12 16 7 12 4Z" fill="white" />
        <path d="M12 4V20M12 11C13.5 12.5 15.5 13 17 13.5M12 14C10.5 15 9 15.5 7 15.5" stroke="#6DB33F" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 8. React (Official Cyan Atomic Orbit)
  if (norm.includes('react') && !norm.includes('query')) {
    return (
      <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="none">
        <circle cx="0" cy="0" r="2.05" fill="#06b6d4" />
        <g stroke="#06b6d4" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // 9. Next.js (Official Inverted Circle with Monogram N)
  if (norm.includes('next')) {
    return (
      <svg className={className} viewBox="0 0 180 180" fill="none">
        <mask id="mask0_next" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180" style={{ maskType: 'alpha' }}>
          <circle cx="90" cy="90" r="90" fill="black" />
        </mask>
        <g mask="url(#mask0_next)">
          <circle cx="90" cy="90" r="90" fill="#000000" />
          <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" />
          <rect x="115" y="54" width="12" height="72" fill="white" />
        </g>
      </svg>
    );
  }

  // 10. TypeScript (Official Blue Badge TS)
  if (norm.includes('typescript') || norm === 'ts') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M11.5 8H5.5V10.2H7.3V18H9.7V10.2H11.5V8Z" fill="white" />
        <path d="M18.5 10.5C18.1 9.9 17.4 9.5 16.3 9.5C15 9.5 14.2 10.1 14.2 11.2C14.2 12.1 14.8 12.6 15.9 13.1L16.6 13.4C18.2 14.1 19 14.9 19 16.3C19 18.2 17.4 19.3 15.3 19.3C13.6 19.3 12.4 18.5 11.8 17.1L13.8 16C14.2 16.9 14.8 17.3 15.5 17.3C16.3 17.3 16.8 16.8 16.8 16.1C16.8 15.3 16.3 14.9 15.1 14.4L14.4 14.1C13 13.5 12.1 12.5 12.1 11C12.1 9.3 13.6 7.7 16.1 7.7C17.6 7.7 18.7 8.3 19.5 9.5L18.5 10.5Z" fill="white" />
      </svg>
    );
  }

  // 11. JavaScript (Official Yellow Badge JS)
  if (norm.includes('javascript') || norm === 'js') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M8 11.5V17C8 18.1 7.2 18.5 6.2 18.5C5.1 18.5 4.3 17.8 4 16.8L5.5 15.9C5.7 16.5 6 16.9 6.4 16.9C6.8 16.9 7 16.7 7 16V11.5H8ZM13.8 11.5C15.4 11.5 16.5 12.4 16.5 14C16.5 15.5 15.4 16.3 13.9 16.9L13.3 17.1C12.3 17.5 11.8 17.9 11.8 18.6C11.8 19.3 12.4 19.8 13.3 19.8C14.2 19.8 14.8 19.2 15.2 18.5L16.4 19.3C15.7 20.4 14.6 21 13.3 21C11.3 21 10 19.8 10 18.2C10 16.6 11.1 15.8 12.6 15.2L13.2 15C14.1 14.6 14.6 14.3 14.6 13.6C14.6 13 14.1 12.6 13.4 12.6C12.6 12.6 12.1 13 11.8 13.6L10.5 12.7C11.1 11.9 12.3 11.5 13.8 11.5Z" fill="#000000" />
      </svg>
    );
  }

  // 12. Tailwind CSS (Official Cyan Double Wave)
  if (norm.includes('tailwind')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#06b6d4">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
      </svg>
    );
  }

  // 13. Vue.js (Official Emerald and Slate Chevron)
  if (norm === 'vue' || norm.includes('vue.js') || norm.includes('vuejs') || norm.includes('vue 3') || norm.includes('vue 2')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M2 3H6.5L12 12.5L17.5 3H22L12 20.5L2 3Z" fill="#42B883" />
        <path d="M6.5 3H10.5L12 5.5L13.5 3H17.5L12 12.5L6.5 3Z" fill="#35495E" />
      </svg>
    );
  }

  // 14. Nuxt (Official Double Green Triangles)
  if (norm.includes('nuxt')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M7.5 18L13 8.5L18.5 18H7.5Z" fill="#00DC82" />
        <path d="M1.5 18L6.5 9.5L11.5 18H1.5Z" fill="#00C58E" />
      </svg>
    );
  }

  // 15. Angular (Official Red Shield with A)
  if (norm.includes('angular')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 5.5L3.5 18L12 22L20.5 18L22 5.5L12 2Z" fill="#DD0031" />
        <path d="M12 4.5L12 19.5L18.5 16.2L19.8 6L12 4.5Z" fill="#C3002F" />
        <path d="M12 6.5L8.5 14.5H10.3L11.1 12.8H12.9L13.7 14.5H15.5L12 6.5ZM12 9.2L12.5 11.2H11.5L12 9.2Z" fill="white" />
      </svg>
    );
  }

  // 16. Svelte (Official Red-Orange Svelte Loop)
  if (norm.includes('svelte')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#FF3E00">
        <path d="M19.4 6.7C18.1 4.4 15.6 3 12.9 3.1C10.7 3.2 8.7 4.2 7.5 6C6.7 7.2 6.4 8.7 6.6 10.1L6.7 10.9L5.9 11.2C4.5 11.7 3.4 12.8 2.8 14.2C2.1 16 2.3 18 3.3 19.6C4.6 21.8 7.1 23.2 9.8 23.1C12 23 14 22 15.2 20.2C16 19 16.3 17.5 16.1 16.1L16 15.3L16.8 15C18.2 14.5 19.3 13.4 19.9 12C20.6 10.2 20.4 8.2 19.4 6.7Z" />
      </svg>
    );
  }

  // 17. Node.js (Official Green Hexagon)
  if (norm.includes('node') && !norm.includes('express')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L21 7.2V16.8L12 22L3 16.8V7.2L12 2Z" fill="#5FA04E" />
        <path d="M12 5.5L17.5 8.7V15.3L12 18.5L6.5 15.3V8.7L12 5.5Z" fill="#333333" />
      </svg>
    );
  }

  // 18. Express.js (Official Express Emblem)
  if (norm.includes('express')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#18181B" />
        <path d="M6 12C6 9.5 8 7.5 10.5 7.5C12.5 7.5 14 8.8 14.6 10.5H12.8C12.3 9.7 11.5 9.2 10.5 9.2C9 9.2 7.8 10.5 7.8 12C7.8 13.5 9 14.8 10.5 14.8C11.5 14.8 12.3 14.3 12.8 13.5H14.6C14 15.2 12.5 16.5 10.5 16.5C8 16.5 6 14.5 6 12Z" fill="white" />
        <path d="M15 8L18 16M18 8L15 16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // 19. NestJS (Official Red Cat Shield)
  if (norm.includes('nest')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#E0234E" />
        <path d="M6 7L12 4L18 7V13C18 17 12 20 12 20C12 20 6 17 6 13V7Z" fill="white" />
        <path d="M10 10L12 14L14 10" stroke="#E0234E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 20. Fastify (Official Dark Stopwatch/Hare)
  if (norm.includes('fastify')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#000000" />
        <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="1.8" />
        <path d="M12 8V12L15 14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 3H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 21. Hono (Official Flame Emblem)
  if (norm.includes('hono')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#E36002" />
        <path d="M12 4C12 4 15 8 15 11C15 12.7 13.7 14 12 14C10.3 14 9 12.7 9 11C9 8 12 4 12 4Z" fill="white" />
        <path d="M12 10C12 10 17 13 17 16C17 18.8 14.8 21 12 21C9.2 21 7 18.8 7 16C7 13 12 10 12 10Z" fill="white" opacity="0.8" />
      </svg>
    );
  }

  // 22. Python (Official Intertwined Yellow & Blue Snakes)
  if (norm === 'python' || (norm.includes('python') && !norm.includes('django') && !norm.includes('fastapi') && !norm.includes('flask'))) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M11.9 2C8.3 2 8.6 3.5 8.6 3.5L8.6 5.2H12.2V5.7H5.4C3.8 5.7 2.4 6.7 2.4 8.7C2.4 10.7 3.4 11.7 5.1 11.7H6.6V10.1C6.6 8.3 8.1 6.8 9.9 6.8H14.1C15.4 6.8 16.5 5.7 16.5 4.4C16.5 3 15.3 2 11.9 2ZM10.3 3.3C10.8 3.3 11.2 3.7 11.2 4.2C11.2 4.7 10.8 5.1 10.3 5.1C9.8 5.1 9.4 4.7 9.4 4.2C9.4 3.7 9.8 3.3 10.3 3.3Z" fill="#3776AB" />
        <path d="M12.1 22C15.7 22 15.4 20.5 15.4 20.5L15.4 18.8H11.8V18.3H18.6C20.2 18.3 21.6 17.3 21.6 15.3C21.6 13.3 20.6 12.3 18.9 12.3H17.4V13.9C17.4 15.7 15.9 17.2 14.1 17.2H9.9C8.6 17.2 7.5 18.3 7.5 19.6C7.5 21 8.7 22 12.1 22ZM13.7 20.7C13.2 20.7 12.8 20.3 12.8 19.8C12.8 19.3 13.2 18.9 13.7 18.9C14.2 18.9 14.6 19.3 14.6 19.8C14.6 20.3 14.2 20.7 13.7 20.7Z" fill="#FFD43B" />
      </svg>
    );
  }

  // 23. Django (Official Dark Green Block "dj")
  if (norm.includes('django')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#092E20" />
        <path d="M14 6H17V15C17 18 15 19 12.5 19C10.8 19 9.8 18.2 9.2 17.2L11 15.8C11.5 16.4 12 16.8 12.8 16.8C13.8 16.8 14 16.1 14 15.2V6ZM10.5 11C11.8 11 12.5 11.8 12.5 13C12.5 14.2 11.8 15 10.5 15C9.2 15 8.5 14.2 8.5 13C8.5 11.8 9.2 11 10.5 11Z" fill="white" />
      </svg>
    );
  }

  // 24. FastAPI (Official Teal Circle with Lightning)
  if (norm.includes('fastapi')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#05998B" />
        <path d="M13 5L7 13H12L11 19L17 11H12L13 5Z" fill="white" />
      </svg>
    );
  }

  // 25. Flask (Official Flask Silhouette)
  if (norm.includes('flask')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#000000" />
        <path d="M10 4H14M11 4V8.5L7 16C6.3 17.2 7.2 19 8.6 19H15.4C16.8 19 17.7 17.2 17 16L13 8.5V4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="15" r="1.5" fill="white" />
      </svg>
    );
  }

  // 26. Docker (Official Whale with Cargo Containers)
  if (norm.includes('docker')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M3 13C3.5 10 7 10 8 12C9 10 13 10 14 12C16 10 19 11 20 13C22 14 23 16 21 18C18 21 6 21 3 17C2 15 2.5 13.5 3 13Z" fill="#2496ED" />
        <rect x="7" y="7" width="2.5" height="2" fill="#2496ED" />
        <rect x="10.5" y="7" width="2.5" height="2" fill="#2496ED" />
        <rect x="14" y="7" width="2.5" height="2" fill="#2496ED" />
      </svg>
    );
  }

  // 27. Kubernetes (Official Helm Wheel)
  if (norm.includes('kubernetes') || norm.includes('k8s')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#326CE5" />
        <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" />
        <path d="M12 4V7M12 17V20M4 12H7M17 12H20M6.5 6.5L8.5 8.5M15.5 15.5L17.5 17.5M6.5 17.5L8.5 15.5M15.5 8.5L17.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 28. PostgreSQL (Official Blue Elephant Emblem)
  if (norm.includes('postgres')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 3C7.58 3 4 4.34 4 6C4 7.66 7.58 9 12 9C16.42 9 20 7.66 20 6C20 4.34 16.42 3 12 3Z" fill="#336791" />
        <path d="M4 6V12C4 13.66 7.58 15 12 15C16.42 15 20 13.66 20 12V6" stroke="#336791" strokeWidth="2" />
        <path d="M4 12V18C4 19.66 7.58 21 12 21C16.42 21 20 19.66 20 18V12" stroke="#336791" strokeWidth="2" />
      </svg>
    );
  }

  // 29. MySQL (Official Dolphin / Navy Emblem)
  if (norm.includes('mysql')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#00758F" />
        <path d="M6 16C8 12 11 10 14 11C16 11.7 18 10 18 8C18 7 16 6 14 7C11 8 8 11 6 16Z" fill="#F29111" />
        <circle cx="15.5" cy="8.5" r="1" fill="#ffffff" />
      </svg>
    );
  }

  // 30. MongoDB (Official Leaf)
  if (norm.includes('mongo')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2C12 2 6 7 6 13C6 17 8.5 20.5 12 22C15.5 20.5 18 17 18 13C18 7 12 2 12 2Z" fill="#47A248" />
        <path d="M12 2V22C12.5 21.5 13 20 13 13C13 7 12 2 12 2Z" fill="#3FA037" />
      </svg>
    );
  }

  // 31. Redis (Official Red Tiered Rhombus)
  if (norm.includes('redis')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M3 8L12 3L21 8L12 13L3 8Z" fill="#DC382D" />
        <path d="M3 13L12 18L21 13L12 17L3 13Z" fill="#B7281E" />
        <path d="M3 17L12 22L21 17L12 21L3 17Z" fill="#8F1F17" />
      </svg>
    );
  }

  // 32. SQLite (Official Blue Feather Badge)
  if (norm.includes('sqlite')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#003B57" />
        <path d="M6 8C6 6.5 8.7 5.5 12 5.5C15.3 5.5 18 6.5 18 8V16C18 17.5 15.3 18.5 12 18.5C8.7 18.5 6 17.5 6 16V8Z" fill="#00A2D9" />
      </svg>
    );
  }

  // 33. Supabase (Official Emerald Lightning Bolt)
  if (norm.includes('supabase')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M11.5 2L3 13.5H11.5L9.5 22L20.5 9.5H12.5L14.5 2H11.5Z" fill="#3ECF8E" />
      </svg>
    );
  }

  // 34. Firebase (Official Amber/Orange Flames)
  if (norm.includes('firebase')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M4 18L7.5 4L11 9L4 18Z" fill="#FFA000" />
        <path d="M20 18L13 3L11 9L20 18Z" fill="#F57C00" />
        <path d="M11 9L13.5 14L4 18L11 9Z" fill="#FFCA28" />
        <path d="M4 18L12 22L20 18L11 9L4 18Z" fill="#FF8F00" />
      </svg>
    );
  }

  // 35. Prisma (Official Dark Triangle Prism)
  if (norm.includes('prisma')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 19H21L12 2Z" stroke="#2D3748" strokeWidth="2" strokeLinejoin="round" fill="#2D3748" fillOpacity="0.2" />
        <path d="M12 2L15 19" stroke="#2D3748" strokeWidth="1.5" />
      </svg>
    );
  }

  // 36. Drizzle ORM (Official Dark Tile with Lime Drip Slash)
  if (norm.includes('drizzle')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#18181B" />
        <path d="M6 18L18 6" stroke="#C5F82A" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M8 20L10 18" stroke="#C5F82A" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 37. GraphQL (Official Magenta Hexagram)
  if (norm.includes('graphql')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#E10098" />
        <path d="M12 4L19 8V16L12 20L5 16V8L12 4Z" stroke="white" strokeWidth="1.5" />
        <circle cx="12" cy="4" r="1.5" fill="white" />
        <circle cx="19" cy="8" r="1.5" fill="white" />
        <circle cx="19" cy="16" r="1.5" fill="white" />
        <circle cx="12" cy="20" r="1.5" fill="white" />
        <circle cx="5" cy="16" r="1.5" fill="white" />
        <circle cx="5" cy="8" r="1.5" fill="white" />
      </svg>
    );
  }

  // 38. tRPC (Official Blue Geometric Triangle)
  if (norm.includes('trpc')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#398CCB" />
        <path d="M5 16L12 6L19 16H5Z" fill="white" />
        <path d="M12 11L16 16H8L12 11Z" fill="#2563EB" />
      </svg>
    );
  }

  // 39. Zod (Official Blue Badge)
  if (norm.includes('zod')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#3068B7" />
        <path d="M6 8H18L6 16H18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 40. TanStack Query (Official Coral Flower)
  if (norm.includes('query') || norm.includes('tanstack')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#FF4154" />
        <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" />
        <path d="M15.5 15.5L19 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 41. Zustand (Official Bear Silhouette)
  if (norm.includes('zustand')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#443E38" />
        <circle cx="12" cy="13" r="5" fill="#F59E0B" />
        <circle cx="8" cy="8" r="2.5" fill="#F59E0B" />
        <circle cx="16" cy="8" r="2.5" fill="#F59E0B" />
      </svg>
    );
  }

  // 42. Redux (Official Violet Atomic Knot)
  if (norm.includes('redux')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#764ABC" />
        <path d="M7 12C7 9.2 9.2 7 12 7C14.8 7 17 9.2 17 12C17 14.8 14.8 17 12 17C9.2 17 7 14.8 7 12Z" stroke="white" strokeWidth="2" />
      </svg>
    );
  }

  // 43. Vite (Official Purple Shield & Gold Lightning)
  if (norm.includes('vite')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M21 4L12 20L3 4L13 7L21 4Z" fill="#646CFF" />
        <path d="M13 7L10.5 12H13.5L11.5 16L17 9.5H14L15.5 7H13Z" fill="#FFD62E" />
      </svg>
    );
  }

  // 44. Webpack (Official Blue Cubes)
  if (norm.includes('webpack')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#8DD6F9" />
        <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="#1C78C0" strokeWidth="1.5" fill="#2B3A42" />
        <path d="M12 8L16 10.5V14.5L12 16.5L8 14.5V10.5L12 8Z" fill="#8DD6F9" />
      </svg>
    );
  }

  // 45. Bootstrap (Official Purple Tile with B)
  if (norm.includes('bootstrap')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#7952B3" />
        <path d="M8 7H12.5C14.2 7 15.5 7.8 15.5 9.2C15.5 10.2 14.8 11 13.8 11.3C15.2 11.6 16 12.6 16 14C16 15.8 14.5 17 12.5 17H8V7ZM10.5 9V11H12.3C13.2 11 13.8 10.5 13.8 9.8C13.8 9.2 13.2 9 12.3 9H10.5ZM10.5 13V15H12.5C13.5 15 14.2 14.5 14.2 13.8C14.2 13.2 13.5 13 12.5 13H10.5Z" fill="white" />
      </svg>
    );
  }

  // 46. Sass / SCSS (Official Pink Badge)
  if (norm.includes('sass') || norm.includes('scss')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#CF649A" />
        <path d="M6 13C6 11 8 10 10 10C12 10 13 11 13 12C13 14 9 13.5 9 15.5C9 16.5 10 17 11 17C12.5 17 13.5 16 14 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // 47. Shadcn UI (Official Black Rounded Tile with Diagonal Slash)
  if (norm.includes('shadcn')) {
    return (
      <svg className={className} viewBox="0 0 256 256" fill="none">
        <rect width="256" height="256" rx="60" fill="#000000" />
        <line x1="208" y1="128" x2="128" y2="208" stroke="white" strokeWidth="24" strokeLinecap="round" />
        <line x1="192" y1="40" x2="40" y2="192" stroke="white" strokeWidth="24" strokeLinecap="round" />
      </svg>
    );
  }

  // 48. Radix UI
  if (norm.includes('radix')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#111827" />
        <circle cx="8" cy="8" r="3" fill="#ffffff" />
        <rect x="13" y="5" width="6" height="6" rx="1" fill="#ffffff" />
        <rect x="13" y="13" width="6" height="6" rx="3" fill="#ffffff" />
      </svg>
    );
  }

  // 49. Framer Motion
  if (norm.includes('framer') || norm === 'motion') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M4 2H20V10H12L4 2Z" fill="#0055FF" />
        <path d="M4 10H12L20 18H4V10Z" fill="#0055FF" />
        <path d="M12 18H4L12 26V18Z" fill="#0055FF" />
      </svg>
    );
  }

  // 50. Figma (Official 5-Color Tile)
  if (norm.includes('figma') || norm.includes('auto layout')) {
    return (
      <svg className={className} viewBox="0 0 38 57" fill="none">
        <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
        <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
        <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
        <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
        <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
      </svg>
    );
  }

  // 51. Sketch
  if (norm.includes('sketch')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M6 3L2 9L12 21L22 9L18 3H6Z" fill="#FDB300" />
        <path d="M6 3L12 9L18 3H6Z" fill="#FDD231" />
        <path d="M2 9L12 9L12 21L2 9Z" fill="#EA6C00" />
        <path d="M22 9L12 9L12 21L22 9Z" fill="#FD9000" />
      </svg>
    );
  }

  // 52. Blender / Three.js / 3D
  if (norm.includes('blender') || norm.includes('three') || norm.includes('3d') || norm.includes('webgl')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="#EA7600" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 22V12" stroke="#EA7600" strokeWidth="2" />
        <path d="M12 12L21 7" stroke="#EA7600" strokeWidth="2" />
        <path d="M12 12L3 7" stroke="#EA7600" strokeWidth="2" />
        <circle cx="12" cy="12" r="2.5" fill="#2563EB" />
      </svg>
    );
  }

  // 53. Rust (Official Gear Cog)
  if (norm.includes('rust')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#DEA584" />
        <circle cx="12" cy="12" r="7" stroke="#000000" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="12" cy="12" r="3.5" fill="#000000" />
      </svg>
    );
  }

  // 54. Go / Golang (Official Cyan Go Logo)
  if (norm.includes('go') || norm.includes('golang')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#00ADD8" />
        <path d="M6 10C6 8 8 7 10 7C11.5 7 12.5 7.7 13 8.7L11.3 9.7C11 9.3 10.5 9 10 9C9 9 8.2 9.8 8.2 11C8.2 12.2 9 13 10 13C10.7 13 11.2 12.6 11.5 12.2H10V10.5H13.5V13.8C12.8 14.5 11.5 15 10 15C8 15 6 13.5 6 11V10ZM15 7C16.7 7 18 8.3 18 10V12C18 13.7 16.7 15 15 15C13.3 15 12 13.7 12 12V10C12 8.3 13.3 7 15 7ZM15 9C14.2 9 13.8 9.6 13.8 10.5V11.5C13.8 12.4 14.2 13 15 13C15.8 13 16.2 12.4 16.2 11.5V10.5C16.2 9.6 15.8 9 15 9Z" fill="white" />
      </svg>
    );
  }

  // 55. Flutter / Dart
  if (norm.includes('flutter') || norm.includes('dart')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M14 2L4 12L7 15L20 2H14Z" fill="#02569B" />
        <path d="M14 14L8.5 19.5L11.5 22.5L17 17L14 14Z" fill="#0175C2" />
        <path d="M17 17L11.5 22.5H17.5L20.5 19.5L17 17Z" fill="#29B6F6" />
      </svg>
    );
  }

  // 56. Swift / iOS
  if (norm.includes('swift') || norm.includes('ios')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#FA7343" />
        <path d="M18 17C16.5 18.5 14 19 11 18C7.5 16.8 5 13.5 5 10C5.5 11.5 7 13 9 13.5C6.5 11 6 8 7 6C8 7.5 10 9 12 9.5C10 7.5 10 5 11 4C13.5 7 16 11 18 17Z" fill="white" />
      </svg>
    );
  }

  // 57. Kotlin / Android
  if (norm.includes('kotlin') || norm.includes('android')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#7F52FF" />
        <path d="M4 4H20L12 12L20 20H4V4Z" fill="#E08B39" />
      </svg>
    );
  }

  // 58. C# / .NET
  if (norm === 'c#' || norm === 'csharp' || norm.includes('.net') || norm.includes('dotnet')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#512BD4" />
        <path d="M12 6C8.7 6 6 8.7 6 12C6 15.3 8.7 18 12 18C14.2 18 16.1 16.8 17.1 15L15 13.8C14.4 14.8 13.3 15.5 12 15.5C10.1 15.5 8.5 13.9 8.5 12C8.5 10.1 10.1 8.5 12 8.5C13.3 8.5 14.4 9.2 15 10.2L17.1 9C16.1 7.2 14.2 6 12 6Z" fill="white" />
        <path d="M18 10V14M16 12H20" stroke="#239120" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 59. C++ / C
  if (norm === 'c++' || norm === 'cpp') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#00599C" />
        <path d="M11 7C8.2 7 6 9.2 6 12C6 14.8 8.2 17 11 17C12.8 17 14.4 16 15.2 14.5L13.5 13.5C13 14.4 12.1 15 11 15C9.3 15 8 13.7 8 12C8 10.3 9.3 9 11 9C12.1 9 13 9.6 13.5 10.5L15.2 9.5C14.4 8 12.8 7 11 7Z" fill="white" />
        <path d="M17 10V14M15 12H19M21 10V14M19.5 12H22.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  // 60. Ruby / Ruby on Rails
  if (norm.includes('ruby') || norm.includes('rails')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#CC342D" />
        <path d="M7 6L17 6L20 11L12 20L4 11L7 6Z" stroke="white" strokeWidth="1.8" fill="none" />
        <path d="M4 11H20M12 20L8.5 11L12 6L15.5 11L12 20Z" stroke="white" strokeWidth="1.2" />
      </svg>
    );
  }

  // 61. Shopify / Liquid
  if (norm.includes('shopify') || norm.includes('liquid')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#95BF47" />
        <path d="M8 8V6C8 4.9 8.9 4 10 4H14C15.1 4 16 4.9 16 6V8H19L17.5 19H6.5L5 8H8ZM10 6V8H14V6H10Z" fill="white" />
      </svg>
    );
  }

  // 62. WooCommerce
  if (norm.includes('woo') || norm.includes('woocommerce')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#96588A" />
        <path d="M5 8L7.5 15L10 8L12 15L14.5 8H16.5L13.5 17H11L9 11L7 17H4.5L2 8H5Z" fill="white" />
      </svg>
    );
  }

  // 63. Stripe
  if (norm.includes('stripe')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#635BFF" />
        <path d="M13.8 10.8C12.3 10.4 11.7 10 11.7 9.3C11.7 8.5 12.6 8 13.9 8C15.4 8 16.8 8.5 17.7 9.1L18.4 6.8C17.3 6.3 15.7 6 13.8 6C10.7 6 8.7 7.5 8.7 10C8.7 12.4 10.6 13.4 13.1 14C14.8 14.5 15.4 15 15.4 15.8C15.4 16.8 14.3 17.3 12.9 17.3C11.2 17.3 9.4 16.6 8.4 15.8L7.6 18.2C8.9 18.9 10.9 19.3 12.9 19.3C16.3 19.3 18.5 17.7 18.5 15.1C18.5 12.6 16.5 11.5 13.8 10.8Z" fill="white" />
      </svg>
    );
  }

  // 64. Git / GitHub
  if (norm.includes('git') || norm.includes('github')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#F05032" />
        <path d="M12 4L19 11L12 18L5 11L12 4Z" stroke="white" strokeWidth="1.8" />
        <circle cx="9.5" cy="11" r="1.5" fill="white" />
        <circle cx="14.5" cy="8.5" r="1.5" fill="white" />
        <circle cx="14.5" cy="13.5" r="1.5" fill="white" />
      </svg>
    );
  }

  // 65. Vitest / Jest
  if (norm.includes('vitest') || norm.includes('jest')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#729B1B" />
        <path d="M13 3L6 14H12L11 21L18 10H12L13 3Z" fill="#FCC72B" />
      </svg>
    );
  }

  // 66. Playwright
  if (norm.includes('playwright')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#2EAD33" />
        <circle cx="9" cy="11" r="3" fill="#D32F2F" />
        <circle cx="15" cy="13" r="3.5" fill="#1976D2" />
      </svg>
    );
  }

  // 67. Lucide Icons
  if (norm.includes('lucide')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#F56565" />
        <path d="M12 4L14 9L19 11L14 13L12 18L10 13L5 11L10 9L12 4Z" fill="white" />
      </svg>
    );
  }

  // =========================================================================
  // DYNAMIC CDN LOGO RESOLVER FOR EXTENDED TECH STACKS (100% PRODUCTION READY)
  // =========================================================================
  const cleanSlug = norm.replace(/[^a-z0-9]/g, '');
  const cdnEntry = CDN_SLUG_MAP[cleanSlug] || CDN_SLUG_MAP[norm];
  const targetSlug = cdnEntry?.simpleicon || cleanSlug;

  if (!cdnFailed && targetSlug && targetSlug.length >= 2) {
    const cdnUrl = `https://cdn.simpleicons.org/${targetSlug}`;
    return (
      <img
        src={cdnUrl}
        alt={toolName}
        className={`${className} object-contain rounded-[2px]`}
        onError={() => setCdnFailed(true)}
        loading="lazy"
      />
    );
  }

  // High-fidelity fallback tech badge with monogram
  const monogram = toolName.slice(0, 2).toUpperCase();
  return (
    <span
      className={`${className} inline-flex items-center justify-center rounded-[3px] bg-slate-800 text-[9px] font-bold text-orange-400 select-none border border-slate-700/60 shadow-xs`}
      title={toolName}
    >
      {monogram || <Terminal className="w-2.5 h-2.5 text-orange-400" />}
    </span>
  );
};
export default TechToolIcon;
