"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Container from '@/components/shared/container';
import { ChevronRight, ChevronDownIcon } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { getFaqQuery } from '@/services/pages/queries';
import { FaqResponse } from '@/types';

export default function FAQPage() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number>(0);

  const { data: faqResponse, isLoading, error } = useQuery(getFaqQuery());

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto bg-white">
        <Container className="py-6 sm:py-8 md:py-12 lg:py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !faqResponse?.data) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto bg-white">
        <Container className="py-6 sm:py-8 md:py-12 lg:py-20">
          <div className="text-center">
            <p className="text-red-500">Error loading FAQ content.</p>
          </div>
        </Container>
      </div>
    );
  }

  const faqs: FaqResponse[] = faqResponse.data;

  return (
    <div className="min-h-screen max-w-6xl mx-auto bg-white">
      <Container className="py-6 sm:py-8 md:py-12 lg:py-20">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-[#14171A] mb-3 sm:mb-4 md:mb-6">
          {t('title')}
        </h1>
        
        <div className="border-t border-[#E5E5EA] mt-4 sm:mt-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-[#E5E5EA]">
              <button
                type="button"
                onClick={() => toggleQuestion(index)}
                className="w-full flex items-center justify-between py-3 sm:py-4 md:py-6 text-left hover:opacity-70 transition-opacity cursor-pointer"
              >
                <span className="text-sm sm:text-base md:text-lg font-medium text-[#14171A] pr-3 sm:pr-4">
                  {index + 1}. {faq.question}
                </span>
                <span className="text-[#14171A] shrink-0">
                  {openIndex === index ? (
                    <ChevronDownIcon className="size-4 sm:size-5" />
                  ) : (
                    <ChevronRight className="size-4 sm:size-5" />
                  )}
                </span>
              </button>
              {openIndex === index && (
                <div className="pb-3 sm:pb-4 md:pb-6">
                  <div
                    className="text-sm sm:text-base md:text-lg text-[#14171A] leading-relaxed prose prose-sm sm:prose-base md:prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
