import { Card, CardContent } from "@/components/ui/card"
import { QuoteIcon } from "lucide-react"

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">It Brings a smile to our faces ❤️</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              Real feedback from people who've used Scanlance to improve their resumes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface Testimonial {
  name: string
  content: string
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { name, content } = testimonial

  return (
    <Card className="h-full overflow-hidden border bg-background">
      <CardContent className="p-6 relative">
        <QuoteIcon className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
        <blockquote className="text-sm sm:text-base mb-4 mt-2 text-muted-foreground">"{content}"</blockquote>
        <div className="mt-auto pt-2 border-t">
          <p className="font-medium text-foreground">{name}</p>
        </div>
      </CardContent>
    </Card>
  )
}

const testimonials: Testimonial[] = [
  {
    name: "Sanjay Sharma",
    content:
      "I was surprised this tool actually found problems in my resume. It showed me I was being too technical and not highlighting my achievements properly. Made some changes and my resume looks much better now.",
  },
  {
    name: "Jhansi",
    content:
      "I tried many things for my resume but nothing worked. This tool pointed out I was missing important keywords from job descriptions. After making the suggested changes, my resume improved a lot.",
  },
  {
    name: "Kajal Verma",
    content:
      "My resume needed work but I didn't know what was wrong. This tool showed me I was writing too much about my responsibilities and not enough about my actual accomplishments. The feedback was very helpful.",
  },
  {
    name: "Vineeth Kumar",
    content:
      "The suggestions were specific to my field which was good. Made some small changes based on the feedback and my resume is much clearer now.",
  },
  {
    name: "Krishna Pavan",
    content:
      "I was not sure about using this but it was worth trying. It found some mistakes and formatting issues I missed. Also helped me fix some awkward sentences. Simple but useful feedback.",
  },
  {
    name: "Karthik Reddy",
    content:
      "As a fresher I struggled with my resume. This tool helped me focus on my projects and internship experience instead of just listing courses. The feedback made my resume much more professional.",
  },
]
