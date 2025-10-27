'use client'

import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const AboutUs = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800">About Us</h2>
        <p className="text-gray-500 mt-2 mb-10">Learn more about our company and our mission</p>

        {/* About Card */}
        <Card className="max-w-5xl mx-auto sm:flex-row sm:gap-0 shadow-md rounded-xl overflow-hidden">
          {/* Image Section */}
          <CardContent className="p-0 sm:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2Vic2l0ZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900"
              alt="About our team"
              className="w-full h-full object-cover sm:rounded-l-xl"
            />
          </CardContent>

          {/* Text Section */}
          <div className="sm:w-1/2 flex flex-col justify-between text-left bg-white">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-semibold text-gray-800">Empowering Developers, One Line at a Time</CardTitle>
              <CardDescription className="text-gray-600 mt-3">
                We’re dedicated to providing a platform where developers can collaborate, create, and share projects effortlessly. 
                Our tools make resume building and collaboration fast, fun, and frictionless.
              </CardDescription>
            </CardHeader>

            <CardFooter className="p-6 pt-0">
              <Button className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white hover:from-indigo-500 hover:to-purple-500">
                Learn More
              </Button>
            </CardFooter>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default AboutUs
