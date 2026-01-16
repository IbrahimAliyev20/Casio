import { getTranslations as getTranslationsServer } from 'next-intl/server';
import Container from '@/components/shared/container';
import Image from 'next/image';
import Link from 'next/link';
import CasioStores from '@/components/contact/CasioStores';
import { getServerQueryClient } from '@/providers/server';
import { getServerLocale } from '@/lib/utils';
import { getContactQuery, getRegionsQuery, getSocialMediaQuery } from '@/services/contact/queries';
import { SocialMediaResponse } from '@/types';

export default async function ContactPage() {
  const locale = await getServerLocale();
  const queryClient = getServerQueryClient();
  const t = await getTranslationsServer('contact');

  await Promise.all([
    queryClient.prefetchQuery(getContactQuery(locale)), 
    queryClient.prefetchQuery(getSocialMediaQuery(locale)),
    queryClient.prefetchQuery(getRegionsQuery(locale)),
  ]);

  const contactData = queryClient.getQueryData(getContactQuery(locale).queryKey);
  const socialMediaData = queryClient.getQueryData(getSocialMediaQuery(locale).queryKey);
  const regionsData = queryClient.getQueryData(getRegionsQuery(locale).queryKey);
  
  const contact = contactData?.data;
  const socialMedia = socialMediaData?.data;
  const regions = regionsData?.data;
  return (
    <div className="min-h-screen bg-white">
      <Container className="py-6 sm:py-8 md:py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
          {/* Left Section - Contact Information */}
          <div className="space-y-5 sm:space-y-6 md:space-y-8">
            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#14171A]">
              {t('title')}
            </h1>

            {/* Phone Numbers Section */}
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm text-text-primary">
                {t('phone.label')}
              </p>
              <div className="space-y-1">
                {contact?.phone_1 && contact?.phone_2 && [contact?.phone_1, contact?.phone_2].map((number: string, index: number) => (
                  <Link
                    key={index}
                    href={`tel:${number.replace(/\s/g, '')}`}
                    className="block text-sm sm:text-base text-[#14171A] hover:opacity-70 transition-opacity"
                  >
                    {number}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm text-text-primary">
                {t('email.label')}
              </p>
              <Link
                href={`mailto:${t('email.address')}`}
                className="block text-sm sm:text-base text-[#14171A] hover:opacity-70 transition-opacity break-all"
              >
                {contact?.email}
              </Link>
            </div>

            {/* Social Media Section */}
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm text-text-primary">
                {t('socialMedia.label')}
              </p>
              <div className="flex items-center gap-3 sm:gap-4 ">
                {socialMedia?.map((item: SocialMediaResponse  ) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    aria-label={item.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black flex items-center justify-center hover:opacity-70 transition-opacity"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={20}
                      height={20}
                      className="w-4 h-4 sm:w-5 sm:h-5 filter invert"
                    />
                  </Link>
                ))}
                
                
              </div>
            </div>
          </div>

          {/* Right Section - Map */}
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-full lg:min-h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.1234567890123!2d49.8536!3d40.4093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403087d42a5f7b0d%3A0x4c0c5c5c5c5c5c5c!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2saz!4v1234567890123!5m2!1sen!2saz"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      </Container>
      <CasioStores regions={regions} />
    </div>
  );
}
