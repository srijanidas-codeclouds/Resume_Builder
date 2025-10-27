
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const ContactUs = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-semibold text-gray-800 mb-3">Contact Us</h2>
        <p className="text-gray-600 mb-10">
          Have questions or need assistance? We're here to help! Reach out to our team and we’ll get back to you shortly.
        </p>

        {/* Contact Card */}
        <Card className="max-w-xl mx-auto shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Get in Touch</CardTitle>
            <CardDescription>We’d love to hear from you. Fill out the form below.</CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4 text-left">
              <Input
                type="text"
                placeholder="Your Name"
                className="focus-visible:ring-indigo-500"
              />
              <Input
                type="email"
                placeholder="Your Email"
                className="focus-visible:ring-indigo-500"
              />
              <Textarea
                placeholder="Your Message"
                rows={5}
                className="focus-visible:ring-indigo-500"
              />
            </form>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90">
              Send Message
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

export default ContactUs
