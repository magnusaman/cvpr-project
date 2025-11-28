import { motion } from 'framer-motion'
import { ArrowLeft, Download, Share2, CheckCircle, Box, Sparkles } from 'lucide-react'

export default function ResultsDisplay({ results, imageUrl, onReset }) {
  // Check if this is comparison mode
  const isComparisonMode = results?.mode === 'comparison' && results?.results

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = 'detected-image.jpg'
    link.click()
  }

  const getTotalObjects = (resultData = results) => {
    if (resultData.detections) {
      return resultData.detections.length
    }
    return resultData.detected_objects?.length || 0
  }

  const getUniqueClasses = (resultData = results) => {
    if (resultData.detections) {
      const classes = resultData.detections.map(d => d.class)
      return [...new Set(classes)]
    }
    return resultData.detected_objects || []
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-400'
    if (confidence >= 0.6) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getAvgConfidence = (resultData) => {
    if (resultData.detections && resultData.detections.length > 0) {
      return Math.round(resultData.detections.reduce((acc, d) => acc + d.confidence, 0) / resultData.detections.length * 100)
    }
    return 0
  }

  // Render comparison view
  if (isComparisonMode) {
    const mediumResults = results.results.medium
    const largeResults = results.results.large

    return (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 glass-morphism px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Analyze Another Image</span>
          </motion.button>

          <div className="text-center">
            <h2 className="text-2xl font-bold gradient-text">Model Comparison</h2>
            <p className="text-sm text-gray-400">ObjectVision AI vs ObjectVision AI+</p>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="glass-morphism p-3 rounded-xl hover:bg-white/10 transition-all"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medium Model Results */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-morphism rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-primary-400">ObjectVision AI</h3>
              <span className="text-sm glass-morphism px-3 py-1 rounded-full">Faster</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center glass-morphism rounded-lg p-3">
                <div className="text-2xl font-bold gradient-text">{getTotalObjects(mediumResults)}</div>
                <div className="text-xs text-gray-400">Objects</div>
              </div>
              <div className="text-center glass-morphism rounded-lg p-3">
                <div className="text-2xl font-bold gradient-text">{getUniqueClasses(mediumResults).length}</div>
                <div className="text-xs text-gray-400">Classes</div>
              </div>
              <div className="text-center glass-morphism rounded-lg p-3">
                <div className="text-2xl font-bold gradient-text">{getAvgConfidence(mediumResults)}%</div>
                <div className="text-xs text-gray-400">Confidence</div>
              </div>
            </div>

            {/* Image */}
            <div className="relative rounded-xl overflow-hidden mb-4">
              <img src={imageUrl} alt="Medium Model" className="w-full h-auto" />
            </div>

            {/* Detections */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mediumResults.detections && mediumResults.detections.map((detection, index) => (
                <div key={index} className="glass-morphism rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="capitalize font-medium">{detection.class}</span>
                    <span className={`font-bold ${getConfidenceColor(detection.confidence)}`}>
                      {Math.round(detection.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
              {(!mediumResults.detections || mediumResults.detections.length === 0) && (
                <div className="text-center text-gray-400 py-4">No detections</div>
              )}
            </div>
          </motion.div>

          {/* Large Model Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-morphism rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-purple-400">ObjectVision AI+</h3>
              <span className="text-sm glass-morphism px-3 py-1 rounded-full">More Accurate</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center glass-morphism rounded-lg p-3">
                <div className="text-2xl font-bold gradient-text">{getTotalObjects(largeResults)}</div>
                <div className="text-xs text-gray-400">Objects</div>
              </div>
              <div className="text-center glass-morphism rounded-lg p-3">
                <div className="text-2xl font-bold gradient-text">{getUniqueClasses(largeResults).length}</div>
                <div className="text-xs text-gray-400">Classes</div>
              </div>
              <div className="text-center glass-morphism rounded-lg p-3">
                <div className="text-2xl font-bold gradient-text">{getAvgConfidence(largeResults)}%</div>
                <div className="text-xs text-gray-400">Confidence</div>
              </div>
            </div>

            {/* Image */}
            <div className="relative rounded-xl overflow-hidden mb-4">
              <img src={imageUrl} alt="Large Model" className="w-full h-auto" />
            </div>

            {/* Detections */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {largeResults.detections && largeResults.detections.map((detection, index) => (
                <div key={index} className="glass-morphism rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="capitalize font-medium">{detection.class}</span>
                    <span className={`font-bold ${getConfidenceColor(detection.confidence)}`}>
                      {Math.round(detection.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
              {(!largeResults.detections || largeResults.detections.length === 0) && (
                <div className="text-center text-gray-400 py-4">No detections</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Inference Time Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 glass-morphism rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-4 gradient-text">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-primary-400 font-semibold mb-2">Medium Model</div>
              <div className="text-2xl font-bold">
                {mediumResults.inference_time ? `${Math.round(mediumResults.inference_time * 1000)}ms` : 'N/A'}
              </div>
              <div className="text-sm text-gray-400">Inference Time</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-semibold mb-2">Large Model</div>
              <div className="text-2xl font-bold">
                {largeResults.inference_time ? `${Math.round(largeResults.inference_time * 1000)}ms` : 'N/A'}
              </div>
              <div className="text-sm text-gray-400">Inference Time</div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Regular single model view
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 glass-morphism px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Analyze Another Image</span>
        </motion.button>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="glass-morphism p-3 rounded-xl hover:bg-white/10 transition-all"
          >
            <Download className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-morphism p-3 rounded-xl hover:bg-white/10 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="glass-morphism rounded-2xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/20 mb-4">
            <Box className="w-8 h-8 text-primary-400" />
          </div>
          <div className="text-4xl font-bold gradient-text mb-2">{getTotalObjects()}</div>
          <div className="text-gray-400">Objects Detected</div>
        </div>

        <div className="glass-morphism rounded-2xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-4xl font-bold gradient-text mb-2">{getUniqueClasses().length}</div>
          <div className="text-gray-400">Unique Classes</div>
        </div>

        <div className="glass-morphism rounded-2xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-4xl font-bold gradient-text mb-2">
            {results.detections ?
              Math.round(results.detections.reduce((acc, d) => acc + d.confidence, 0) / results.detections.length * 100) :
              95
            }%
          </div>
          <div className="text-gray-400">Avg Confidence</div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Display */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-morphism rounded-3xl p-6"
        >
          <h2 className="text-2xl font-bold mb-4 gradient-text">Analyzed Image</h2>
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={imageUrl}
              alt="Analyzed"
              className="w-full h-auto"
            />
            <div className="absolute top-4 right-4 glass-morphism px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">
                {results.width || 'N/A'}x{results.height || 'N/A'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Detections List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-morphism rounded-3xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6 gradient-text">Detection Results</h2>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {results.detections ? (
              results.detections.map((detection, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="glass-morphism rounded-xl p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold capitalize">{detection.class}</h3>
                        <p className="text-sm text-gray-400">
                          Box: [{detection.box.map(b => Math.round(b)).join(', ')}]
                        </p>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${getConfidenceColor(detection.confidence)}`}>
                      {Math.round(detection.confidence * 100)}%
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${detection.confidence * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                    />
                  </div>
                </motion.div>
              ))
            ) : (
              getUniqueClasses().map((obj, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="glass-morphism rounded-xl p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold capitalize">{obj}</h3>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Model Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 glass-morphism rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold mb-4 gradient-text">Model Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-gray-400 text-sm mb-1">Model</div>
            <div className="font-semibold capitalize">ObjectVision AI{results.model === 'large' ? '+' : ''}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Dataset</div>
            <div className="font-semibold">COCO</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Classes</div>
            <div className="font-semibold">80</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Inference Time</div>
            <div className="font-semibold">{results.inference_time ? `${Math.round(results.inference_time * 1000)}ms` : '~50ms'}</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
