
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-xs">
          <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 hover:bg-white p-2 rounded-md shadow-md" />
          <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 hover:bg-white p-2 rounded-md shadow-md"/>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1 ">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold h-[450px]">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
