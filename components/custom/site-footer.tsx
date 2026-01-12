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
import { FaFacebookF, FaGlobe, FaInstagram, FaLinkedin, FaTiktok, FaX, FaYoutube } from "react-icons/fa6";

export default function SiteFooter() {
  return (
    <footer className="bg-[#f5f2ed] text-gray-900 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 md:flex md:justify-between md:items-start gap-10">
        {/* Left Section: Region & Subscribe */}
        <div className="md:w-1/4 mb-8 md:mb-0">
          <label className="text-sm mb-2 block">Change region</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Global" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="india">India</SelectItem>
              <SelectItem value="us">US</SelectItem>
            </SelectContent>
          </Select>

          <p className="mt-4 text-sm">
            Lorem ipsum dolor sit amet consectetur.
          </p>
          <Button className="mt-4 bg-black text-white hover:bg-gray-800">
            Subscribe to emails
          </Button>
        </div>

        {/* Middle Sections */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:w-3/4">
          {/* Booking */}
          <div>
            <h4 className="font-semibold mb-2">Lorem ipsum</h4>
            <ul className="space-y-1 text-sm">
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-2">Lorem ipsum</h4>
            <ul className="space-y-1 text-sm">
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-2">Lorem ipsum</h4>
            <ul className="space-y-1 text-sm">
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
            </ul>
          </div>

          {/* Purpose */}
          <div>
            <h4 className="font-semibold mb-2">Lorem ipsum</h4>
            <ul className="space-y-1 text-sm">
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-300 mt-8 py-6 flex flex-col sm:flex-row items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-0">
          <Image src="/b-corp-logo.png" alt="B Corporation" className="h-10" width={100} height={100} />
        </div>

        <div className="flex gap-4 text-xl">
          <Link href="#" aria-label="Facebook">
          <FaFacebookF />
          </Link>
          <Link href="#" aria-label="Instagram">
          <FaInstagram />
          </Link>
          <Link href="#" aria-label="TikTok">
          <FaTiktok />
          </Link>
          <Link href="#" aria-label="X">
          <FaX />
          </Link>
          <Link href="#" aria-label="YouTube">
          <FaYoutube />
          </Link>
          <Link href="#" aria-label="LinkedIn">
          <FaLinkedin />
          </Link>
          <Link href="#" aria-label="Other">
          <FaGlobe />
          </Link>
        </div>
      </div>
    </footer>
  );
}
