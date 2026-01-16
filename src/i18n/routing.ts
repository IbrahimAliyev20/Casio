import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  locales: ['az', 'en', 'ru'],

  defaultLocale: 'az',
  
  localeDetection: false,
  
  localePrefix: 'as-needed'
});