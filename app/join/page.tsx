"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CharacterPreview from "../components/character-preview"

export default function JoinPage() {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    characterRace: "human",
    gender: "male",
    hairStyle: "short",
    hairColor: "brown",
    outfit: "casual",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join the Tavern</CardTitle>
            <CardDescription>Create your account and customize your character</CardDescription>
          </CardHeader>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account Details</TabsTrigger>
              <TabsTrigger value="character">Character Customization</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit}>
              <TabsContent value="account">
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      placeholder="Choose how you'll appear to others"
                      value={formData.displayName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/">Cancel</Link>
                  </Button>
                  <Button type="button" onClick={() => document.querySelector('[data-value="character"]')?.click()}>
                    Next: Character Customization
                  </Button>
                </CardFooter>
              </TabsContent>

              <TabsContent value="character">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Character Race</Label>
                        <Select
                          value={formData.characterRace}
                          onValueChange={(value) => handleSelectChange("characterRace", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a race" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="human">Human</SelectItem>
                            <SelectItem value="elf">Elf</SelectItem>
                            <SelectItem value="dwarf">Dwarf</SelectItem>
                            <SelectItem value="halfling">Halfling</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <RadioGroup
                          value={formData.gender}
                          onValueChange={(value) => handleSelectChange("gender", value)}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label>Hair Style</Label>
                        <Select
                          value={formData.hairStyle}
                          onValueChange={(value) => handleSelectChange("hairStyle", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select hair style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short</SelectItem>
                            <SelectItem value="long">Long</SelectItem>
                            <SelectItem value="ponytail">Ponytail</SelectItem>
                            <SelectItem value="bald">Bald</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Hair Color</Label>
                        <Select
                          value={formData.hairColor}
                          onValueChange={(value) => handleSelectChange("hairColor", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select hair color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="black">Black</SelectItem>
                            <SelectItem value="brown">Brown</SelectItem>
                            <SelectItem value="blonde">Blonde</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                            <SelectItem value="silver">Silver</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Outfit</Label>
                        <Select value={formData.outfit} onValueChange={(value) => handleSelectChange("outfit", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select outfit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="casual">Casual Tavern Clothes</SelectItem>
                            <SelectItem value="noble">Noble Attire</SelectItem>
                            <SelectItem value="adventurer">Adventurer's Gear</SelectItem>
                            <SelectItem value="mage">Mage Robes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <CharacterPreview characterData={formData} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => document.querySelector('[data-value="account"]')?.click()}
                  >
                    Back to Account
                  </Button>
                  <Button type="submit">Create Character & Enter Tavern</Button>
                </CardFooter>
              </TabsContent>
            </form>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

