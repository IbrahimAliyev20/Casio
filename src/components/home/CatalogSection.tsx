"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import Container from '@/components/shared/container'
import { CatalogResponse } from '@/types'

export default function CatalogSection({ catalogs }: { catalogs: CatalogResponse[] | undefined }) {
  const t = useTranslations('home.catalog')

  return (
    <section className="py-6 md:py-12">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {catalogs?.map((catalog) => (
            <Link
              key={catalog.slug}
              href={catalog.slug}
              className="group bg-white border border-[#E5E5EA] rounded-sm flex h-[140px] sm:h-[160px] md:h-[194px] w-full overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-full w-[120px] sm:w-[140px] md:w-[180px] lg:w-[202px] shrink-0 rounded-l-sm overflow-hidden">
                <Image
                  src={catalog.image}
                  alt={catalog.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 202px"
                />
              </div>

              <div className="bg-white flex flex-col h-full items-start justify-between p-4 sm:px-5 sm:py-6 md:px-6 md:py-8 flex-1">
                <h3 className="font-medium text-base sm:text-lg md:text-[20px] leading-6 md:leading-[28px] text-black">
                  {catalog.name}
                </h3>
                <div className="bg-black flex items-center justify-center gap-2 md:gap-4 h-8 px-3 sm:px-4 md:px-6 py-2 w-full group-hover:bg-black/90 transition-colors">
                  <span className="font-medium text-xs leading-4 text-white whitespace-nowrap">
                    {t('goTo')}
                  </span>
                  <ArrowRight className="size-4 text-white shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
