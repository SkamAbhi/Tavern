import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-b from-indigo-950 via-indigo-900 to-purple-900 px-4 py-32 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Isekai Tavern</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            A medieval fantasy meeting space where adventurers from different worlds gather to connect, collaborate, and
            share tales of their journeys.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/tavern">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                Enter the Tavern <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative stars */}
        <div className="absolute top-12 right-12 w-2 h-2 bg-white rounded-full opacity-70"></div>
        <div className="absolute top-36 left-24 w-1 h-1 bg-white rounded-full opacity-50"></div>
        <div className="absolute bottom-24 right-36 w-1 h-1 bg-white rounded-full opacity-60"></div>
        <div className="absolute top-48 right-48 w-3 h-3 bg-white rounded-full opacity-20"></div>
        <div className="absolute bottom-48 left-48 w-2 h-2 bg-white rounded-full opacity-30"></div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">A Magical Meeting Place</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Customizable Avatars</h3>
              <p className="text-gray-600">
                Create your medieval fantasy character with unique outfits and accessories to represent yourself in the
                tavern.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Interactive Spaces</h3>
              <p className="text-gray-600">
                Move freely around the tavern, join different tables, and interact with objects in the environment.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Real-time Communication</h3>
              <p className="text-gray-600">
                Chat with nearby adventurers, share stories, and collaborate on quests and projects.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-800 py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Adventure?</h2>
          <p className="text-xl mb-8">Create your character and step into our medieval fantasy tavern.</p>
          <Link href="/tavern">
            <Button size="lg" className="bg-white text-purple-800 hover:bg-gray-100">
              Enter the Tavern
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h3 className="text-white text-lg font-semibold mb-4">Isekai Tavern</h3>
            <p>A medieval fantasy meeting space for adventurers from all worlds.</p>
            <p className="mt-8">&copy; {new Date().getFullYear()} Isekai Tavern. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

