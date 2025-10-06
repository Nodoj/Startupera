import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          if (typeof document === 'undefined') return undefined;
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) {
            const cookieValue = parts.pop()?.split(';').shift();
            return cookieValue;
          }
          return undefined;
        },
        set(name: string, value: string, options: any) {
          if (typeof document === 'undefined') return;
          let cookie = `${name}=${value}`;
          if (options?.path) cookie += `; path=${options.path}`;
          else cookie += '; path=/';  // Default to root path
          if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
          if (options?.domain) cookie += `; domain=${options.domain}`;
          if (options?.sameSite) cookie += `; samesite=${options.sameSite}`;
          if (options?.secure) cookie += '; secure';
          document.cookie = cookie;
        },
        remove(name: string, options: any) {
          if (typeof document === 'undefined') return;
          let cookie = `${name}=; max-age=0`;
          if (options?.path) cookie += `; path=${options.path}`;
          else cookie += '; path=/';  // Default to root path
          if (options?.domain) cookie += `; domain=${options.domain}`;
          document.cookie = cookie;
        },
      },
    }
  )
}
