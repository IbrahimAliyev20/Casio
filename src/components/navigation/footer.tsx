"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "../shared/container";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import {
  getContactQuery,
  getSocialMediaQuery,
} from "@/services/contact/queries";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSubscribeMutation } from "@/services/subscribe/mutations";
import { useState } from "react";

export function Footer() {
  const locale = useLocale();
  const subscribeMutation = useSubscribeMutation();
  const { data: contactData } = useQuery(getContactQuery(locale));
  const { data: socialMediaData } = useQuery(getSocialMediaQuery(locale));
  const contact = contactData?.data;
  const socialMedia = socialMediaData?.data;
  const [email, setEmail] = useState("");
  return (
    <footer className="bg-black text-white">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between gap-8 md:gap-12 pt-8 md:pt-16 pb-8 md:pb-12">
          <div className="flex flex-col">
            <Link href="/" className="mb-4 md:mb-6">
              <Image
                src="/images/logofooter.svg"
                alt="Casio Logo"
                width={130}
                height={40}
                className="object-contain w-[100px] md:w-[130px]"
              />
            </Link>

            <p className="text-white text-sm md:text-base mb-3 md:mb-4">
              Follow us on
            </p>
            <div className="flex items-center gap-4 md:gap-5">
              {socialMedia?.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  aria-label={item.name}
                  className="hover:opacity-70 transition"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={22}
                    height={22}
                    className="w-5 h-5 md:w-[22px] md:h-[22px] filter invert"
                  />
                </Link>
              ))}
            </div>
            <div className="w-full max-w-md flex items-center gap-2 mt-5">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="bg-white text-black hover:bg-white/90 rounded-none cursor-pointer" />
              <Button onClick={() => subscribeMutation.mutate({ email })} className="bg-white text-black hover:bg-white/90 rounded-none cursor-pointer" >Subscribe</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 lg:gap-12 flex-1 max-w-2xl">
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base mb-3 md:mb-5">
                Keçidlər
              </h3>
              <ul className="space-y-2 md:space-y-3 text-white/70 text-sm md:text-base">
                <li>
                  <Link href="/catalog" className="hover:opacity-70 transition">
                    Kataloq
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:opacity-70 transition">
                    Haqqımızda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:opacity-70 transition">
                    Bizimlə əlaqə
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white text-sm md:text-base mb-3 md:mb-5">
                Info
              </h3>
              <ul className="space-y-2 md:space-y-3 text-white/70 text-sm md:text-base">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:opacity-70 transition"
                  >
                    Məxfilik siyasəti
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-conditions"
                    className="hover:opacity-70 transition"
                  >
                    İstifadə şərtləri
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:opacity-70 transition">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-semibold text-white text-sm md:text-base mb-3 md:mb-5">
                Əlaqə
              </h3>
              <ul className="space-y-2 md:space-y-3 text-white/70 text-sm md:text-base">
                <li>
                  <Link
                    href={`mailto:${contact?.email || "info@casiobaku.com"}`}
                    className="hover:opacity-70 transition break-all"
                  >
                    {contact?.email || "info@casiobaku.com"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`tel:${contact?.phone_1 || "+9947707770"}`}
                    className="hover:opacity-70 transition"
                  >
                    {contact?.phone_1 || "+994 770 77 70"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`tel:${contact?.phone_2 || "+9947707770"}`}
                    className="hover:opacity-70 transition"
                  >
                    {contact?.phone_2 || "+994 770 77 70"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div></div>
        <div className="border-t border-white/20 py-4 md:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 text-center sm:text-left">
            <p className="flex items-center gap-2 text-white text-xs md:text-sm">
              <Image
                src="/icons/copyright.svg"
                alt="copyright"
                width={16}
                height={16}
                className="w-3 h-3 md:w-4 md:h-4"
              />
              Copyright | All Rights Reserved
            </p>

            <p className="text-white text-xs md:text-sm">
              <Link href="#" className="underline hover:opacity-70 transition">
                Markup Agency
              </Link>{" "}
              tərəfindən hazırlanıb.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
