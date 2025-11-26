import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import UploadSection from './components/UploadSection'
import ResultsDisplay from './components/ResultsDisplay'
import Features from './components/Features'
import Stats from './components/Stats'
import Team from './components/Team'
import Footer from './components/Footer'

function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)

  const handleAnalysis = (analysisResults, imageUrl) => {
    setResults(analysisResults)
    setUploadedImage(imageUrl)
  }

  const handleReset = () => {
    setResults(null)
    setUploadedImage(null)
    setLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-purple-900/20 to-pink-900/20 animate-gradient"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      {/* Content */}
      <Header />

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!results ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Hero />
              <Stats />
              <UploadSection
                onAnalysis={handleAnalysis}
                loading={loading}
                setLoading={setLoading}
              />
              <Features />
              <Team />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsDisplay
                results={results}
                imageUrl={uploadedImage}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default App
