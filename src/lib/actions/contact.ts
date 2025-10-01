'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitContactForm(formData: FormData) {
  const supabase = await createClient()
  
  const contactData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    subject: formData.get('subject') as string || 'New Contact Form Submission',
    message: formData.get('message') as string,
    status: 'new'
  }

  const { error } = await supabase
    .from('contact_submissions')
    .insert(contactData)

  if (error) {
    console.error('Error submitting contact form:', error)
    redirect('/contact?error=Failed to submit form. Please try again.')
  }

  revalidatePath('/contact')
  redirect('/contact?success=Thank you! We will get back to you soon.')
}

export async function submitDemoBooking(formData: FormData) {
  const supabase = await createClient()
  
  const bookingData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    company: formData.get('company') as string,
    phone: formData.get('phone') as string || null,
    message: formData.get('message') as string || null,
    booking_date: formData.get('booking_date') as string,
    booking_time: formData.get('booking_time') as string,
    status: 'pending'
  }

  // Check if time slot is already booked
  const { data: existingBooking } = await supabase
    .from('demo_bookings')
    .select('id')
    .eq('booking_date', bookingData.booking_date)
    .eq('booking_time', bookingData.booking_time)
    .in('status', ['pending', 'confirmed'])
    .single()

  if (existingBooking) {
    redirect('/book-demo?error=This time slot is already booked. Please select another time.')
  }

  const { error } = await supabase
    .from('demo_bookings')
    .insert(bookingData)

  if (error) {
    console.error('Error submitting demo booking:', error)
    redirect('/book-demo?error=Failed to book demo. Please try again.')
  }

  revalidatePath('/book-demo')
  redirect('/book-demo?success=Demo booked successfully! We will contact you soon.')
}

export async function getContactSubmissions() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contact submissions:', error)
    return []
  }

  return data
}

export async function updateContactStatus(id: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('contact_submissions')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating contact status:', error)
    throw new Error('Failed to update status')
  }

  revalidatePath('/admin/contacts')
}

export async function getDemoBookings() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('demo_bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching demo bookings:', error)
    return []
  }

  return data
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('demo_bookings')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating booking status:', error)
    throw new Error('Failed to update status')
  }

  revalidatePath('/admin/bookings')
}

export async function getAvailableTimeSlots(date: string) {
  const supabase = await createClient()
  
  const { data: bookedSlots } = await supabase
    .from('demo_bookings')
    .select('booking_time')
    .eq('booking_date', date)
    .in('status', ['confirmed', 'pending'])

  const allSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ]
  
  const bookedTimes = bookedSlots?.map(slot => slot.booking_time) || []
  const availableSlots = allSlots.filter(time => !bookedTimes.includes(time))
  
  return availableSlots
}
