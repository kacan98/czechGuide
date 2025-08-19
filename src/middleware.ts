import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const { request, url, redirect } = context;
  
  // Only handle root path redirects
  if (url.pathname === '/') {
    const acceptLanguage = request.headers.get('accept-language');
    
    if (acceptLanguage) {
      // Parse the Accept-Language header
      const languages = acceptLanguage
        .split(',')
        .map(lang => {
          const [code, quality = '1'] = lang.trim().split(';q=');
          return {
            code: code.split('-')[0].toLowerCase(), // Get language code (sv from sv-SE)
            quality: parseFloat(quality)
          };
        })
        .sort((a, b) => b.quality - a.quality); // Sort by preference
      
      // Check if Swedish is preferred and higher quality than English
      const svPreference = languages.find(lang => lang.code === 'sv');
      const enPreference = languages.find(lang => lang.code === 'en');
      
      // If Swedish is preferred and has higher or equal preference to English
      if (svPreference && (!enPreference || svPreference.quality >= enPreference.quality)) {
        return redirect('/sv/', 302);
      }
    }
  }
  
  return next();
});