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
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaX,
  FaYoutube,
} from "react-icons/fa6";
import { useCurrency, COUNTRY_MAP } from "@/context/CurrencyContext";
import { Mail, ArrowRight } from "lucide-react";

export default function SiteFooter() {
  const { countryName, setCountry, localizeLink } = useCurrency();

  return (
    <footer className="bg-[#2D2424] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand & Subscribe */}
          <div className="lg:col-span-1 space-y-8">
            <Link
              href={localizeLink("/")}
              className="text-3xl font-serif font-black tracking-tighter"
            >
              INTREPID
              <span className="text-primary font-light underline decoration-2 underline-offset-4 ml-1">
                TRAVEL
              </span>
            </Link>
            <div className="space-y-4">
              <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                Get the latest travel inspiration, news and exclusive offers
                delivered straight to your inbox.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-10 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <Button className="rounded-full w-12 h-12 p-0 flex items-center justify-center">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-white/50">
                Destinations
              </h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <Link
                    href={localizeLink("/destinations/peru")}
                    className="hover:text-primary transition-colors"
                  >
                    Peru
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/destinations/vietnam")}
                    className="hover:text-primary transition-colors"
                  >
                    Vietnam
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/destinations/italy")}
                    className="hover:text-primary transition-colors"
                  >
                    Italy
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/destinations/japan")}
                    className="hover:text-primary transition-colors"
                  >
                    Japan
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/destinations/morocco")}
                    className="hover:text-primary transition-colors"
                  >
                    Morocco
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-white/50">
                Support
              </h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <Link
                    href={localizeLink("/contact")}
                    className="hover:text-primary transition-colors"
                  >
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/faq")}
                    className="hover:text-primary transition-colors"
                  >
                    Help Centre
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/bookings/manage")}
                    className="hover:text-primary transition-colors"
                  >
                    Manage booking
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/travel-alerts")}
                    className="hover:text-primary transition-colors"
                  >
                    Travel Alerts
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/insurance")}
                    className="hover:text-primary transition-colors"
                  >
                    Insurance
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-white/50">
                Company
              </h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <Link
                    href={localizeLink("/about")}
                    className="hover:text-primary transition-colors"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/purpose")}
                    className="hover:text-primary transition-colors"
                  >
                    Our Purpose
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/careers")}
                    className="hover:text-primary transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/partners")}
                    className="hover:text-primary transition-colors"
                  >
                    Partner with us
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/legal")}
                    className="hover:text-primary transition-colors"
                  >
                    Legal & Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-white/50">
                Inspiration
              </h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <Link
                    href={localizeLink("/blog")}
                    className="hover:text-primary transition-colors"
                  >
                    The Good Times
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/guides")}
                    className="hover:text-primary transition-colors"
                  >
                    Travel Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/stories")}
                    className="hover:text-primary transition-colors"
                  >
                    Traveler Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/podcast")}
                    className="hover:text-primary transition-colors"
                  >
                    Our Podcast
                  </Link>
                </li>
                <li>
                  <Link
                    href={localizeLink("/newsletter")}
                    className="hover:text-primary transition-colors"
                  >
                    Newsletter
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-bold text-sm">
                B
              </div>
              <div className="text-[10px] uppercase tracking-widest font-bold leading-tight">
                Certified
                <br />B Corporation
              </div>
            </div>
            <div className="hidden sm:block text-zinc-500 text-xs font-medium">
              © 2026 Intrepid Travel. All rights reserved.
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex gap-4 text-zinc-400">
              <Link href="#" className="hover:text-white transition-colors">
                <FaFacebookF />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <FaInstagram />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <FaTiktok />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <FaX />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <FaYoutube />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <FaLinkedin />
              </Link>
            </div>

            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <Select
                value={Object.keys(COUNTRY_MAP).find(
                  (key) => COUNTRY_MAP[key].name === countryName,
                )}
                onValueChange={setCountry}
              >
                <SelectTrigger className="w-32 bg-transparent border-white/10 text-xs h-9 font-bold uppercase tracking-wider">
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
          </div>
        </div>
      </div>
    </footer>
  );
}
