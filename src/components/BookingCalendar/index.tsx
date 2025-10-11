"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, ArrowLeft, CheckCircle, User, Mail, Building, Phone } from "lucide-react";

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
}

interface BookingCalendarProps {
  onDateTimeSelect?: (date: string, time: string) => void;
  onBookingComplete?: (bookingData: BookingData & { date: string; time: string }) => void;
}

const BookingCalendar = ({ onDateTimeSelect, onBookingComplete }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [step, setStep] = useState<'date' | 'time' | 'details' | 'confirmed'>('date');
  const [bookingData, setBookingData] = useState<BookingData>({
    name: "",
    email: "",
    company: "",
    phone: ""
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
    setStep('time');
    if (onDateTimeSelect) {
      onDateTimeSelect(dateString, "");
    }
  };

  const handleTimeSelect = (timeId: string) => {
    setSelectedTime(timeId);
    setStep('details');
    if (onDateTimeSelect && selectedDate) {
      onDateTimeSelect(selectedDate, timeId);
    }
  };

  const handleBackToDate = () => {
    setStep('date');
    setSelectedTime("");
  };

  const handleBackToTime = () => {
    setStep('time');
  };

  const handleBackToDetails = () => {
    setStep('details');
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmed');
    
    // Pass complete booking data to parent
    if (onBookingComplete) {
      onBookingComplete({
        ...bookingData,
        date: selectedDate,
        time: selectedTime
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="relative">
      {/* Step Indicator */}
      <div className="mb-6 flex items-center justify-center gap-1.5">
        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all ${
          step === 'date' 
            ? 'bg-primary text-white' 
            : 'bg-primary/20 text-primary'
        }`}>
          1
        </div>
        <div className={`h-1 w-8 rounded transition-all ${
          step === 'time' || step === 'details' || step === 'confirmed' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
        }`} />
        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all ${
          step === 'time' 
            ? 'bg-primary text-white' 
            : step === 'details' || step === 'confirmed'
            ? 'bg-primary/20 text-primary'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
        }`}>
          2
        </div>
        <div className={`h-1 w-8 rounded transition-all ${
          step === 'details' || step === 'confirmed' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
        }`} />
        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all ${
          step === 'details' 
            ? 'bg-primary text-white' 
            : step === 'confirmed'
            ? 'bg-primary/20 text-primary'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
        }`}>
          3
        </div>
        <div className={`h-1 w-8 rounded transition-all ${
          step === 'confirmed' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
        }`} />
        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all ${
          step === 'confirmed' 
            ? 'bg-primary text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
        }`}>
          4
        </div>
      </div>

      {/* Container with fixed height for smooth transitions */}
      <div className="relative overflow-hidden rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-dark">
        {/* Step 1: Date Selection */}
        <div className={`transition-all duration-300 ${
          step === 'date' ? 'opacity-100' : 'absolute opacity-0 pointer-events-none'
        }`}>
          <div className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-black dark:text-white">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Select a Date
            </h3>
            
            {/* Month Header */}
            <div className="mb-4 text-center">
              <h4 className="text-base font-semibold text-black dark:text-white">
                {monthName}
              </h4>
            </div>

            {/* Weekday Headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <div
                  key={`${day}-${idx}`}
                  className="p-1 text-center text-xs font-medium text-body-color dark:text-body-color-dark"
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
                      relative h-10 w-full rounded-lg p-1 text-xs font-medium transition-all
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
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-body-color dark:text-body-color-dark">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded bg-primary"></div>
                <span>Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Time Selection */}
        <div className={`transition-all duration-300 ${
          step === 'time' ? 'opacity-100' : 'absolute opacity-0 pointer-events-none'
        }`}>
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-black dark:text-white">
                <Clock className="h-5 w-5 text-primary" />
                Select a Time
              </h3>
              <button
                onClick={handleBackToDate}
                className="flex items-center gap-1 text-sm text-body-color hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-primary/10 border border-primary/20 p-3">
              <p className="text-sm font-medium text-primary">
                📅 {formatDate(selectedDate)}
              </p>
            </div>

            <div className="grid gap-2 max-h-[320px] overflow-y-auto">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && handleTimeSelect(slot.id)}
                  disabled={!slot.available}
                  className={`flex items-center gap-2 rounded-lg p-3 text-left text-sm transition-all ${
                    selectedTime === slot.id
                      ? 'bg-primary text-white shadow-lg'
                      : slot.available
                      ? 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-black dark:text-white'
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
        </div>

        {/* Step 3: Your Details */}
        <div className={`transition-all duration-300 ${
          step === 'details' ? 'opacity-100' : 'absolute opacity-0 pointer-events-none'
        }`}>
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-black dark:text-white">
                <User className="h-5 w-5 text-primary" />
                Your Details
              </h3>
              <button
                onClick={handleBackToTime}
                className="flex items-center gap-1 text-sm text-body-color hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-primary/10 border border-primary/20 p-3">
              <p className="text-sm font-medium text-primary">
                📅 {formatDate(selectedDate)} at {timeSlots.find(s => s.id === selectedTime)?.time}
              </p>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Full Name <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-color/60" />
                  <input
                    type="text"
                    required
                    value={bookingData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full rounded-lg border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Email Address <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-color/60" />
                  <input
                    type="email"
                    required
                    value={bookingData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full rounded-lg border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-color/60" />
                  <input
                    type="text"
                    value={bookingData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full rounded-lg border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-colors"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-color/60" />
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full rounded-lg border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>

        {/* Step 4: Confirmation */}
        <div className={`transition-all duration-300 ${
          step === 'confirmed' ? 'opacity-100' : 'absolute opacity-0 pointer-events-none'
        }`}>
          <div className="p-6">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
                Booking Confirmed!
              </h3>
              <p className="text-sm text-body-color dark:text-body-color-dark">
                We&apos;ve sent a confirmation email with calendar invite
              </p>
            </div>

            <div className="space-y-3 rounded-lg bg-primary/10 border border-primary/20 p-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-body-color dark:text-body-color-dark">Date & Time</p>
                  <p className="font-medium text-black dark:text-white">
                    {formatDate(selectedDate)} at {timeSlots.find(s => s.id === selectedTime)?.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-body-color dark:text-body-color-dark">Contact</p>
                  <p className="font-medium text-black dark:text-white">{bookingData.name}</p>
                  <p className="text-xs text-body-color dark:text-body-color-dark">{bookingData.email}</p>
                </div>
              </div>
              {bookingData.company && (
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-body-color dark:text-body-color-dark">Company</p>
                    <p className="font-medium text-black dark:text-white">{bookingData.company}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleBackToDetails}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 px-4 py-3 text-sm font-medium text-body-color hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
