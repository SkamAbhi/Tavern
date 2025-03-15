import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Globe, Sparkles } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">About IsekaiConnect</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting fans of parallel worlds, one adventure at a time
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-muted-foreground">
              IsekaiConnect was born from a simple idea: what if there was a place where fans of isekai stories could
              connect, share their favorite worlds, and even find companions for their next convention or cosplay event?
            </p>
            <p className="text-muted-foreground">
              Founded in 2023 by a group of passionate isekai enthusiasts, our platform has grown to connect thousands
              of fans across the globe who share a love for transported-to-another-world adventures.
            </p>
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Isekai fans at a convention"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Community First</h3>
                <p className="text-sm text-muted-foreground">
                  Our platform is built around fostering genuine connections between isekai fans.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Shared Interests</h3>
                <p className="text-sm text-muted-foreground">
                  Find others who love the same isekai worlds, characters, and stories as you do.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Global Reach</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with isekai enthusiasts from around the world, expanding your horizons.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Magical Experiences</h3>
                <p className="text-sm text-muted-foreground">
                  Discover events, conventions, and meetups tailored for the isekai community.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted rounded-xl p-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Join Our Adventure</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Whether you're a longtime fan of classic isekai or just discovered your first transported-to-another-world
            story, there's a place for you in our community.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Start Your Journey</Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">
              At IsekaiConnect, we believe that stories about traveling to other worlds resonate with us because they
              speak to our desire for adventure, growth, and finding where we truly belong.
            </p>
            <p className="text-muted-foreground">
              Our mission is to create a space where the magic of these stories extends into real-life connections,
              friendships, and experiences that are just as meaningful as the worlds we love to explore in fiction.
            </p>
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Isekai fans sharing stories"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

