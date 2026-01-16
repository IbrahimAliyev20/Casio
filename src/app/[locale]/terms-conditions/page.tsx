"use client";

import { useQuery } from "@tanstack/react-query";
import Container from '@/components/shared/container';
import { getTermsOfServiceQuery } from '@/services/pages/queries';

export default function TermsConditionsPage() {
  const { data: termsOfService, isLoading, error } = useQuery(getTermsOfServiceQuery());

  if (isLoading) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto bg-white">
        <Container className="py-6 sm:py-8 md:py-12 lg:py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !termsOfService?.data) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto bg-white">
        <Container className="py-6 sm:py-8 md:py-12 lg:py-20">
          <div className="text-center">
            <p className="text-red-500">Error loading terms of service content.</p>
          </div>
        </Container>
      </div>
    );
  }

  const { title, description } = termsOfService.data;

  return (
    <div className="min-h-screen max-w-6xl mx-auto bg-white">
      <Container className="py-6 sm:py-8 md:py-12 lg:py-20">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-[#14171A] mb-3 sm:mb-4 md:mb-6">
          {title}
        </h1>

        <div
          className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-[#14171A] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </Container>
    </div>
  );
}
