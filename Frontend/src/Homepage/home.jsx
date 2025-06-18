import React from 'react'
import { Hero } from './Hero/hero'
import { Overview } from './ProductOverview/overview'
import { Demo } from './Demo/demo'
import { About } from './About/about'
import { Features } from './Features/features'
import { FAQ } from './Faq/faq'
import { Contact } from './Contact/contact'

const Home = () => {
  return (
    <div>
      <Hero />
      <Overview />
      <About />
      <Features />
      <Demo />
      <FAQ />
      <Contact />
    </div>
  )
}

export default Home
