"use client";
import React from 'react';
import { useStoreModule } from '@/hooks/useStoreModule';
import { getTheme } from "@/components/themes";

export default function ContactPage() {
  const Theme = getTheme("premium");
  const { contact, loading } = useStoreModule('contact');

  return (
    <div className="w-full bg-[#f4f7ff] min-h-screen font-poppins">
      <Theme.Breadcrumb title={"Contact"} pages={["contact"]} />

      {/* Reduced outer padding from py-16 to py-10 */}
      <section className="py-10">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-6">
          <div className="flex flex-col xl:flex-row gap-6 items-start">
            
            {/* Left Box: Contact Information */}
            <div className="xl:max-w-[340px] w-full bg-white rounded-xl border border-neutral-200/60 shadow-sm">
              {/* Tighter padding here too */}
              <div className="py-4 px-5 border-b border-neutral-100">
                <h2 className="font-semibold text-base text-[#002265]">
                  Contact Information
                </h2>
              </div>
              <div className="p-5">
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-3.5 bg-neutral-200 w-2/3 rounded"></div>
                    <div className="h-3.5 bg-neutral-200 w-1/2 rounded"></div>
                  </div>
                ) : (
                  <Theme.ContactInfo 
                    location={contact?.location || contact?.data?.location}
                    email={contact?.email || contact?.data?.email}
                    phone={contact?.phone || contact?.data?.phone}
                  />
                )}
              </div>
            </div>

            {/* Right Box: Compact Contact Form Wrapper */}
            {/* Dropped padding down significantly to make the form feel smaller and neater */}
            <div className="flex-1 w-full bg-white rounded-xl border border-neutral-200/60 shadow-sm p-5 sm:p-6 md:p-8">
              <Theme.ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}