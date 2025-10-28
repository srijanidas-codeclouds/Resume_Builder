import React from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Product Manager",
    avatar: "/assets/avatars/sarah.jpg",
    comment:
      "This resume builder transformed my job-search process. I landed an interview within days!",
  },
  {
    id: 2,
    name: "Michael Lee",
    role: "Software Engineer",
    avatar: "/assets/avatars/michael.jpg",
    comment:
      "Very intuitive and the templates look professional. Strong recommendation.",
  },
  {
    id: 3,
    name: "Priya Singh",
    role: "UX Designer",
    avatar: "/assets/avatars/priya.jpg",
    comment:
      "Easy to customise and export. The PDF came out perfectly formatted.",
  },
]

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-semibold text-gray-900">
          Reviewed by the community
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Hear what our users have to say about their experience with the Resume
          Builder.
        </p>
      </div>

      {/* Testimonial Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 lg:px-8">
        {testimonials.map((t) => (
          <Card
            key={t.id}
            className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-0">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </CardHeader>

            <CardContent className="pt-4 text-left">
              <p className="text-gray-700 italic leading-relaxed">
                “{t.comment}”
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default TestimonialsSection
