"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SliderResponse } from '@/types'
import Container from '../shared/container'

export default function HeroSection({ sliders }: { sliders: SliderResponse[] | undefined }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const banners = sliders?.map((slider) => ({
    image: slider.image,
    title: slider.title,
    subtitle: slider.description,
  }))

  return (
    <section className="relative w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {banners?.map((banner, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px]">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="100vw"
                />
                
               <Container className="relative">
               <div className="absolute left-0 top-[60px] sm:top-[80px] md:top-[100px] lg:top-[132px] flex flex-col gap-3 sm:gap-4 md:gap-6 z-10 w-full px-4 sm:px-6 md:px-10 lg:px-[142px]">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[56px] leading-tight md:leading-[72px] font-medium text-white max-w-full md:max-w-[479px]">
                    {banner.title}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base leading-5 md:leading-6 text-white max-w-[280px] sm:max-w-[350px] md:max-w-[414px] font-light">
                    {banner.subtitle}
                  </p>
                </div>
               </Container>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1312px] px-4 flex items-center justify-between z-20 pointer-events-none">
          <CarouselPrevious 
            className={cn(
              "relative -left-10 top-0 translate-x-0 translate-y-0 pointer-events-auto",
              "backdrop-blur-md bg-white border border-[#E5E5EA] rounded-[32px] p-3",
              "size-10 md:size-12 hover:bg-white/90 transition-colors",
              "hidden md:flex"
            )}
            variant="ghost"
          >
            <ChevronLeft className="size-5 md:size-6 text-[#8E8E93]" />
            <span className="sr-only">Previous slide</span>
          </CarouselPrevious>
          <CarouselNext 
            className={cn(
              "relative -right-10 top-0 translate-x-0 translate-y-0 pointer-events-auto",
              "backdrop-blur-md bg-white border border-[#E5E5EA] rounded-[32px] p-3",
              "size-10 md:size-12 hover:bg-white/90 transition-colors",
              "hidden md:flex"
            )}
            variant="ghost"
          >
            <ChevronRight className="size-5 md:size-6 text-black" />
            <span className="sr-only">Next slide</span>
          </CarouselNext>
        </div>
      </Carousel>

      {count > 1 && (
        <div className="absolute bottom-6 md:bottom-[24px] left-1/2 -translate-x-1/2 flex gap-[5px] z-10">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'backdrop-blur-md rounded-full transition-all',
                'size-3 border border-white',
                current === index + 1
                  ? 'bg-white'
                  : 'bg-white/20 hover:bg-white/30'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
