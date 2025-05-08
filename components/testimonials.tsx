import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from professionals who have improved their job search with Scanlance.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/diverse-group.png" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">Software Engineer</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                "Scanlance helped me identify key skills missing from my resume. After making the suggested changes, I
                got interviews at 3 top tech companies!"
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/diverse-woman-portrait.png" alt="Avatar" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Jane Smith</p>
                  <p className="text-sm text-muted-foreground">Product Manager</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                "The detailed analysis helped me understand exactly what recruiters are looking for. My resume now gets
                a much higher response rate."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/diverse-group-conversation.png" alt="Avatar" />
                  <AvatarFallback>RJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Robert Johnson</p>
                  <p className="text-sm text-muted-foreground">Data Scientist</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                "I was skeptical at first, but the AI provided insights I hadn't considered. The score breakdown by
                category was especially helpful."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
