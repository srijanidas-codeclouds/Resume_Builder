
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Features = () => {
  useEffect(() => {
    const all = document.querySelectorAll('.spotlight-card')

    const handleMouseMove = (ev) => {
      all.forEach((e) => {
        const blob = e.querySelector('.blob')
        const fblob = e.querySelector('.fake-blob')
        if (!blob || !fblob) return

        const rec = fblob.getBoundingClientRect()
        blob.style.opacity = '1'

        blob.animate(
          [
            {
              transform: `translate(${
                ev.clientX - rec.left - rec.width / 2
              }px, ${ev.clientY - rec.top - rec.height / 2}px)`
            }
          ],
          { duration: 300, fill: 'forwards' }
        )
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    'Easy-to-use resume templates',
    'Drag and drop interface',
    'Customizable sections',
    'Export to PDF and Word formats',
    'Cloud storage for resumes',
    'Real-time collaboration'
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-800">Features</h2>

        {/* Grid of Feature Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {features.map((feature, i) => (
            <div key={i} className="spotlight-card group bg-border relative overflow-hidden rounded-xl p-px transition-all duration-300 ease-in-out">
              <Card className="group-hover:bg-card/90 w-72 border-none transition-all duration-300 ease-in-out group-hover:backdrop-blur-[20px]">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 dark:text-white">{feature}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Discover how this feature makes resume building smoother and faster.
                  </p>
                </CardContent>
              </Card>
              <div className="blob absolute top-0 left-0 h-20 w-20 rounded-full bg-sky-600/60 opacity-0 blur-2xl transition-all duration-300 ease-in-out dark:bg-sky-400/60" />
              <div className="fake-blob absolute top-0 left-0 h-20 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
