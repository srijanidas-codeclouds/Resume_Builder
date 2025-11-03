
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import axiosInstance from '@/utils/axiosInstance'
import { API_PATHS } from '@/utils/apiPaths'
import { useState } from 'react'
import axios from 'axios'

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.CONTACT, formData)
      if (res.data.success) {
        setStatus('Message sent successfully!')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('Failed to send message. Try again.')
      }
    } catch (error) {
      console.error(error)
      setStatus('Error sending message.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-semibold text-gray-800 mb-3">Contact Us</h2>
        <p className="text-gray-600 mb-10">
          Have questions or need assistance? We're here to help! Reach out to our team and we’ll get back to you shortly.
        </p>

        <Card className="max-w-xl mx-auto shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Get in Touch</CardTitle>
            <CardDescription>We’d love to hear from you. Fill out the form below.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
              {status && (
                <p className={`text-sm ${status.includes('Message sent successfully!') ? 'text-green-600' : 'text-red-600'}`}>
                  {status}
                </p>
              )}
            </form>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

export default ContactUs
