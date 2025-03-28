"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Shield, Scale, Globe, Users, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 px-4 py-24 mx-auto text-center md:py-32">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Legal Empowerment Through Blockchain
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Haki connects NGOs with legal professionals to solve human rights challenges using blockchain technology
              for transparency and trust.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 mt-10 md:flex-row">
              <Button asChild size="lg" className="gap-2 text-lg">
                <Link to="/marketplace">
                  Explore Bounties <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 text-lg">
                <Link to="/register">
                  Join Haki <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 md:grid-cols-4"
          >
            {[
              { value: "120+", label: "Legal Bounties", icon: Scale },
              { value: "85+", label: "NGOs Supported", icon: Globe },
              { value: "250+", label: "Lawyers Onboarded", icon: Users },
              { value: "$1.2M", label: "Funds Secured", icon: Shield },
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-background/90">
                  <CardContent className="p-6">
                    <stat.icon className="w-10 h-10 mb-4 text-primary" />
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto mb-16 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Transforming Legal Aid with Blockchain</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Our platform combines legal expertise with blockchain technology to create transparent, efficient, and
              impactful solutions.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {[
              {
                title: "Transparent Escrow",
                description:
                  "Secure funding with blockchain-based escrow that ensures fair payment for completed work.",
                icon: Shield,
              },
              {
                title: "Tokenized Bounties",
                description:
                  "Convert legal needs into tokenized bounties that can be funded, tracked, and verified on-chain.",
                icon: Scale,
              },
              {
                title: "AI-Powered Matching",
                description:
                  "Our AI matches the right legal professionals to the cases where they can make the most impact.",
                icon: Users,
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full transition-all duration-300 border-none shadow-md hover:shadow-lg bg-gradient-to-br from-background to-background/90">
                  <CardContent className="flex flex-col h-full p-6">
                    <feature.icon className="w-12 h-12 p-2 mb-4 rounded-lg text-primary bg-primary/10" />
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto mb-16 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Success Stories</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              See how Haki is making a difference in human rights cases around the world.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 md:grid-cols-2"
          >
            {[
              {
                quote:
                  "Haki helped us secure legal representation for indigenous land rights that we couldn't have afforded otherwise. The blockchain escrow gave us confidence in the process.",
                author: "Maria Rodriguez",
                role: "NGO Director, Amazon Conservation Alliance",
              },
              {
                quote:
                  "As a human rights lawyer, Haki connects me with cases where I can make a real difference. The platform handles all the logistics so I can focus on the legal work.",
                author: "James Chen",
                role: "Human Rights Attorney",
              },
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full border-none shadow-md bg-gradient-to-br from-background to-background/90">
                  <CardContent className="flex flex-col h-full p-6">
                    <div className="flex-1">
                      <p className="text-lg italic">"{testimonial.quote}"</p>
                    </div>
                    <div className="mt-4">
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative p-8 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 to-secondary/90 md:p-12"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_70%)]" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to Make a Difference?</h2>
              <p className="mt-4 text-xl text-white/80">
                Join our platform today and be part of the movement to make legal aid more accessible, transparent, and
                effective.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 mt-8 md:flex-row">
                <Button asChild size="lg" variant="secondary" className="gap-2 text-lg">
                  <Link to="/register">
                    Create an Account <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="gap-2 text-lg bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <Link to="/marketplace">
                    Browse Bounties <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto mb-16 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How Haki Works</h2>
            <p className="mt-4 text-xl text-muted-foreground">Our streamlined process makes it easy to get started</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid max-w-4xl grid-cols-1 gap-8 mx-auto md:grid-cols-2"
          >
            {[
              {
                title: "For NGOs",
                steps: [
                  "Create a bounty describing your legal needs",
                  "Fund the bounty with secure blockchain escrow",
                  "Review applications from qualified lawyers",
                  "Release payment when milestones are completed",
                ],
              },
              {
                title: "For Lawyers",
                steps: [
                  "Complete your profile and verification",
                  "Browse available bounties matching your expertise",
                  "Apply to cases where you can make an impact",
                  "Receive payment through blockchain escrow",
                ],
              },
            ].map((column, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full border-none shadow-md bg-gradient-to-br from-background to-background/90">
                  <CardContent className="p-6">
                    <h3 className="mb-6 text-2xl font-bold text-center">{column.title}</h3>
                    <ul className="space-y-4">
                      {column.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-3">
                          <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-primary/10">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

