"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { useCurrency, COUNTRY_MAP } from "@/context/CurrencyContext";
import { Mail, ArrowRight } from "lucide-react";

const FOOTER_LINKS = {
  Booking: [
    { label: "My Booking", href: "/bookings/manage" },
    { label: "Submit trip feedback", href: "/feedback" },
    { label: "Safe Travels Hub", href: "/safe-travels" },
    { label: "Travel Alerts", href: "/travel-alerts" },
    { label: "Flexible bookings", href: "/flexible-bookings" },
    { label: "Booking conditions", href: "/booking-conditions" },
    { label: "Agent login", href: "/agent/login" },
  ],
  Company: [
    { label: "About us", href: "/about" },
    { label: "The Good Times", href: "/blog" },
    { label: "Intrepid DMC", href: "/dmc" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy policy", href: "/privacy" },
    { label: "Your privacy choices", href: "/privacy-choices", icon: true },
    {
      label: "Intrepidtravel.com accessibility statement",
      href: "/accessibility",
    },
  ],
  Contact: [
    { label: "Get in touch", href: "/contact" },
    { label: "Live chat", href: "/chat" },
    { label: "FAQ", href: "/faq" },
    { label: "Reviews", href: "/reviews" },
    { label: "Newsroom", href: "/newsroom" },
  ],
  Purpose: [
    { label: "B Corp", href: "/b-corp" },
    { label: "The Intrepid Foundation", href: "/foundation" },
    { label: "People", href: "/people" },
    { label: "Planet", href: "/planet" },
    { label: "Wildlife", href: "/wildlife" },
  ],
};

export default function SiteFooter() {
  const { countryName, setCountry, localizeLink } = useCurrency();

  return (
    <footer className="bg-[#F9F8F6] text-[#2D2424] pt-16 pb-8 border-t">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          {/* Column 1: Region & Subscribe (Span 4) */}
          <div className="md:col-span-4 space-y-10 pr-8">
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 font-medium">
                Change region
              </label>
              <Select
                value={Object.keys(COUNTRY_MAP).find(
                  (key) => COUNTRY_MAP[key].name === countryName,
                )}
                onValueChange={setCountry}
              >
                <SelectTrigger className="w-full max-w-[300px] bg-white border-zinc-300 text-sm h-12">
                  <SelectValue placeholder="Global" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COUNTRY_MAP).map(([code, { name }]) => (
                    <SelectItem key={code} value={code}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <p className="text-[#2D2424] text-[15px] leading-relaxed max-w-[320px]">
                Get the goods! Travel deals, new trips, inspiration and more.
              </p>
              <Button className="w-full max-w-[320px] bg-black hover:bg-black/90 text-white rounded-full h-12 font-bold text-sm">
                Subscribe to emails
              </Button>
            </div>
          </div>

          {/* Columns 2-5: Links (Span 2 each) */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="md:col-span-2">
              <h4 className="font-bold text-sm mb-6 text-[#2D2424]">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={localizeLink(link.href)}
                      className="text-xs text-zinc-600 hover:text-[#D40028] hover:underline transition-colors flex items-center gap-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            {/* B Corp Logo Replica */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-serif font-bold text-lg leading-none pb-1">
                B
              </div>
              <div className="text-[8px] font-bold uppercase tracking-wider mt-1 border-t border-black w-full text-center pt-0.5">
                Corporation
              </div>
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest hidden">
              Certified
            </div>
          </div>

          <div className="flex gap-6 text-xl text-black">
            <Link href="#" className="hover:text-[#D40028] transition-colors">
              <FaFacebookF />
            </Link>
            <Link href="#" className="hover:text-[#D40028] transition-colors">
              <FaInstagram />
            </Link>
            <Link href="#" className="hover:text-[#D40028] transition-colors">
              <FaTiktok />
            </Link>
            <Link href="#" className="hover:text-[#D40028] transition-colors">
              <FaXTwitter />
            </Link>
            <Link href="#" className="hover:text-[#D40028] transition-colors">
              <FaYoutube />
            </Link>
            <Link href="#" className="hover:text-[#D40028] transition-colors">
              <FaLinkedinIn />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
