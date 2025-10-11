"use client";

import { useState } from "react";
import BookingCalendar from "@/components/BookingCalendar";
import { submitContactForm } from '@/lib/actions/contact';
import { handleDemoBooking } from '@/lib/actions/booking';
import { useSearchParams } from 'next/navigation';

interface BookingData {
  name: string;
  email: string;
  company: string;
  phone: string;
  date: string;
  time: string;
}

const ContactPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingStatus, setBookingStatus] = useState<string>("");
  const searchParams = useSearchParams();
  
  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleBookingComplete = async (bookingData: BookingData) => {
    try {
      setBookingStatus("Processing...");
      const result = await handleDemoBooking(bookingData);
      
      if (result.success) {
        setBookingStatus(result.message);
      } else {
        setBookingStatus(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingStatus("An error occurred. Please try again.");
    }
  };

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
            Get in Touch
          </h1>
          <p className="text-lg text-body-color dark:text-body-color-dark">
            Schedule a demo or send us a message. We&apos;re here to help transform your business with AI.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Booking Calendar */}
          <div>
            <div className="rounded-xl bg-white px-6 py-8 shadow-three dark:bg-gray-dark">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
                Book a Demo
              </h2>
              <p className="mb-6 text-base text-body-color dark:text-body-color-dark">
                Schedule a personalized demonstration of our AI automation solutions.
              </p>
              {bookingStatus && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  bookingStatus.includes('Error') 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200' 
                    : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                }`}>
                  {bookingStatus}
                </div>
              )}
              <BookingCalendar 
                onDateTimeSelect={handleDateTimeSelect}
                onBookingComplete={handleBookingComplete}
              />
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <div className="rounded-xl bg-white px-6 py-8 shadow-three dark:bg-gray-dark">
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white">
                Send us a Message
              </h2>
              <p className="mb-8 text-base text-body-color dark:text-body-color-dark">
                Get in touch with our AI experts to discuss your project.
              </p>
              
              {searchParams?.get('success') && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    {searchParams.get('success')}
                  </p>
                </div>
              )}
              
              {searchParams?.get('error') && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {searchParams.get('error')}
                  </p>
                </div>
              )}
              
              <form action={submitContactForm} className="space-y-6">
                {/* Hidden fields for demo booking */}
                {selectedDate && (
                  <input type="hidden" name="demo_date" value={selectedDate} />
                )}
                {selectedTime && (
                  <input type="hidden" name="demo_time" value={selectedTime} />
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-dark dark:text-white"
                    >
                      Your Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-stroke bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-dark dark:text-white"
                    >
                      Your Email <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      placeholder="Enter your business email"
                      className="w-full rounded-lg border border-stroke bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="mb-2 block text-sm font-medium text-dark dark:text-white"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      placeholder="Enter your company name"
                      className="w-full rounded-lg border border-stroke bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-dark dark:text-white"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder="Enter your phone number"
                      className="w-full rounded-lg border border-stroke bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-dark dark:text-white"
                  >
                    Project Details <span className="text-primary">*</span>
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    required
                    rows={5}
                    placeholder="Tell us about your AI automation needs..."
                    className="w-full rounded-lg border border-stroke bg-[#f8f8f8] px-4 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-6 py-4 text-base font-medium text-white hover:bg-primary/90 transition-colors shadow-submit dark:shadow-submit-dark"
                >
                  {selectedDate && selectedTime ? 'Book Demo & Send Message' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
