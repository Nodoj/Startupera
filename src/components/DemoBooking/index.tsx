"use client";

import { useState } from "react";
import { Calendar, Clock, User, Mail, Building, Phone, CheckCircle, ArrowRight, CalendarDays } from "lucide-react";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface BookingData {
  name: string;
  email: string;
  company: string;
  phone: string;
  selectedDate: string;
  selectedTime: string;
  message: string;
}

const DemoBooking = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<'calendar' | 'form' | 'success'>('calendar');
  const [bookingData, setBookingData] = useState<BookingData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    selectedDate: "",
    selectedTime: "",
    message: ""
  });

  // Generate calendar month data
  const generateCalendarData = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get first day of current month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    // Get first day of calendar (might be from previous month)
    const firstDayOfCalendar = new Date(firstDayOfMonth);
    firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfMonth.getDay());
    
    // Generate 42 days (6 weeks) for calendar grid
    const calendarDays = [];
    const currentDate = new Date(firstDayOfCalendar);
    
    for (let i = 0; i < 42; i++) {
      const dayOfWeek = currentDate.getDay();
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      const isToday = currentDate.toDateString() === today.toDateString();
      const isPast = currentDate < today;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isAvailable = isCurrentMonth && !isPast && !isWeekend;
      
      calendarDays.push({
        date: new Date(currentDate),
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        isPast,
        isWeekend,
        isAvailable
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      calendarDays,
      monthName: firstDayOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
  };

  // Available time slots
  const timeSlots: TimeSlot[] = [
    { id: "09:00", time: "9:00 AM", available: true },
    { id: "10:00", time: "10:00 AM", available: true },
    { id: "11:00", time: "11:00 AM", available: false },
    { id: "14:00", time: "2:00 PM", available: true },
    { id: "15:00", time: "3:00 PM", available: true },
    { id: "16:00", time: "4:00 PM", available: true },
    { id: "17:00", time: "5:00 PM", available: false },
  ];

  const { calendarDays, monthName } = generateCalendarData();

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setSelectedTime("");
  };

  const handleTimeSelect = (timeId: string) => {
    setSelectedTime(timeId);
  };

  const handleContinueToForm = () => {
    setBookingData(prev => ({
      ...prev,
      selectedDate,
      selectedTime
    }));
    setCurrentStep('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the booking data to your backend
    console.log("Booking submitted:", bookingData);
    setCurrentStep('success');
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeLabel = (timeId: string) => {
    const slot = timeSlots.find(slot => slot.id === timeId);
    return slot ? slot.time : timeId;
  };

  if (currentStep === 'success') {
    return (
      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
                Demo Booked Successfully!
              </h1>
              <p className="text-lg text-body-color dark:text-body-color-dark">
                Thank you for booking a demo with us. We've sent you a confirmation email with all the details.
              </p>
            </div>

            <div className="mb-8 rounded-2xl bg-gray-50 dark:bg-gray-800 p-6">
              <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Your Demo Details
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <span className="text-body-color dark:text-body-color-dark">
                    {formatDate(bookingData.selectedDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-body-color dark:text-body-color-dark">
                    {getTimeLabel(bookingData.selectedTime)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <span className="text-body-color dark:text-body-color-dark">
                    {bookingData.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-body-color dark:text-body-color-dark">
                    {bookingData.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => {
                  setCurrentStep('calendar');
                  setSelectedDate("");
                  setSelectedTime("");
                  setBookingData({
                    name: "",
                    email: "",
                    company: "",
                    phone: "",
                    selectedDate: "",
                    selectedTime: "",
                    message: ""
                  });
                }}
                className="rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 px-6 py-3 text-base font-medium text-body-color hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Book Another Demo
              </button>
              <a
                href="/"
                className="rounded-xl bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 transition-colors"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (currentStep === 'form') {
    return (
      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
                Complete Your Booking
              </h1>
              <p className="text-lg text-body-color dark:text-body-color-dark">
                Please provide your details to confirm the demo booking.
              </p>
            </div>

            {/* Selected Date & Time Display */}
            <div className="mb-8 rounded-2xl bg-primary/5 border border-primary/20 p-6">
              <h3 className="mb-4 text-lg font-semibold text-primary">
                Selected Demo Time
              </h3>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <span className="font-medium text-black dark:text-white">
                    {formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium text-black dark:text-white">
                    {getTimeLabel(selectedTime)}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-body-color/60" />
                    <input
                      type="text"
                      required
                      value={bookingData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 pl-12 pr-4 py-3 text-base font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-body-color/60" />
                    <input
                      type="email"
                      required
                      value={bookingData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 pl-12 pr-4 py-3 text-base font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-body-color/60" />
                    <input
                      type="text"
                      required
                      value={bookingData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 pl-12 pr-4 py-3 text-base font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-body-color/60" />
                    <input
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 pl-12 pr-4 py-3 text-base font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Additional Message
                </label>
                <textarea
                  value={bookingData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 px-4 py-3 text-base font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Tell us about your specific needs or questions..."
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('calendar')}
                  className="rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 px-6 py-3 text-base font-medium text-body-color hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back to Calendar
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 transition-colors"
                >
                  Confirm Booking
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // Calendar Step
  return (
    <section className="pb-[120px] pt-[120px]">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
              Book Your AI Demo
            </h1>
            <p className="text-lg text-body-color dark:text-body-color-dark">
              Schedule a personalized demonstration of our AI automation solutions. Choose a convenient time that works for you.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Calendar Section */}
            <div>
              <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Select a Date
              </h2>
              <div className="rounded-2xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 p-6">
                {/* Month Header */}
                <div className="mb-6 text-center">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    {monthName}
                  </h3>
                </div>

                {/* Weekday Headers */}
                <div className="mb-2 grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-sm font-medium text-body-color dark:text-body-color-dark"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const dateString = day.date.toISOString().split('T')[0];
                    const isSelected = selectedDate === dateString;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => day.isAvailable && handleDateSelect(day.date)}
                        disabled={!day.isAvailable}
                        className={`
                          relative h-12 w-full rounded-lg p-2 text-sm font-medium transition-all
                          ${!day.isCurrentMonth 
                            ? 'text-gray-300 dark:text-gray-600 cursor-default' 
                            : day.isToday
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                            : day.isAvailable
                            ? isSelected
                              ? 'bg-primary text-white shadow-lg'
                              : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            : day.isWeekend
                            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          }
                        `}
                      >
                        {day.day}
                        {day.isToday && (
                          <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500"></div>
                        )}
                        {isSelected && (
                          <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white"></div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-body-color dark:text-body-color-dark">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-primary"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-gray-100 dark:bg-gray-700"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-gray-200 dark:bg-gray-600"></div>
                    <span>Unavailable</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Slots Section */}
            <div>
              <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Select a Time
              </h2>
              {selectedDate ? (
                <div className="rounded-2xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 p-6">
                  <div className="mb-4 text-sm text-body-color dark:text-body-color-dark">
                    Available times for {formatDate(selectedDate)}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => slot.available && handleTimeSelect(slot.id)}
                        disabled={!slot.available}
                        className={`flex items-center gap-3 rounded-xl p-4 text-left transition-all ${
                          selectedTime === slot.id
                            ? 'bg-primary text-white shadow-lg'
                            : slot.available
                            ? 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{slot.time}</span>
                        {!slot.available && (
                          <span className="ml-auto text-xs">Booked</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-stroke dark:border-stroke-dark bg-gray-50 dark:bg-gray-800 p-12 text-center">
                  <Clock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-body-color dark:text-body-color-dark">
                    Please select a date first to see available time slots
                  </p>
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="mt-6">
                  <button
                    onClick={handleContinueToForm}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-medium text-white hover:bg-primary/90 transition-colors"
                  >
                    Continue to Booking Details
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoBooking;
