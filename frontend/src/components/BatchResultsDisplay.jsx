import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Download, CheckCircle, XCircle, Box, Sparkles, ChevronDown, ChevronUp, Image as ImageIcon, FileText, Clock } from 'lucide-react'
import ImageWithBoxes from './ImageWithBoxes'

export default function BatchResultsDisplay({ batchResults, onReset }) {
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  const successfulResults = batchResults.filter(r => r.success)
  const failedResults = batchResults.filter(r => !r.success)

  const getTotalObjects = () => {
    return successfulResults.reduce((acc, r) => {
      // Handle comparison mode
      if (r.results?.mode === 'comparison') {
        const mediumCount = r.results.results?.medium?.detections?.length || 0
        const largeCount = r.results.results?.large?.detections?.length || 0
        return acc + Math.max(mediumCount, largeCount) // Use the model that detected more
      }
      // Handle single model
      return acc + (r.results?.detections?.length || r.results?.num_detected || 0)
    }, 0)
  }

  const getUniqueClasses = () => {
    const allClasses = successfulResults.flatMap(r => {
      // Handle comparison mode
      if (r.results?.mode === 'comparison') {
        const mediumClasses = r.results.results?.medium?.detections?.map(d => d.class) || []
        const largeClasses = r.results.results?.large?.detections?.map(d => d.class) || []
        return [...mediumClasses, ...largeClasses]
      }
      // Handle single model
      if (r.results?.detections) {
        return r.results.detections.map(d => d.class)
      }
      return r.results?.detected_objects || []
    })
    return [...new Set(allClasses)]
  }

  const getAvgInferenceTime = () => {
    const times = successfulResults.flatMap(r => {
      // Handle comparison mode - take the average of both models
      if (r.results?.mode === 'comparison') {
        const mediumTime = r.results.results?.medium?.inference_time
        const largeTime = r.results.results?.large?.inference_time
        const validTimes = [mediumTime, largeTime].filter(t => t != null)
        return validTimes
      }
      // Handle single model
      if (r.results?.inference_time) {
        return [r.results.inference_time]
      }
      return []
    })
    if (times.length === 0) return null
    return times.reduce((a, b) => a + b, 0) / times.length
  }

  const handleDownloadReport = () => {
    const report = {
      summary: {
        totalImages: batchResults.length,
        successful: successfulResults.length,
        failed: failedResults.length,
        totalObjectsDetected: getTotalObjects(),
        uniqueClasses: getUniqueClasses(),
        avgInferenceTime: getAvgInferenceTime()
      },
      results: batchResults.map(r => ({
        filename: r.filename,
        success: r.success,
        detections: r.results?.detections || [],
        numDetected: r.results?.num_detected || 0,
        inferenceTime: r.results?.inference_time || null,
        error: r.error || null
      }))
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `batch-results-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-400'
    if (confidence >= 0.6) return 'text-yellow-400'
    return 'text-orange-400'
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 glass-morphism px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Process More Images</span>
        </motion.button>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="glass-morphism rounded-xl p-1 flex">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              List
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadReport}
            className="flex items-center space-x-2 glass-morphism px-4 py-3 rounded-xl hover:bg-white/10 transition-all"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Download Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
      >
        <div className="glass-morphism rounded-2xl p-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/20 mb-3">
            <ImageIcon className="w-6 h-6 text-primary-400" />
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">{batchResults.length}</div>
          <div className="text-gray-400 text-sm">Total Images</div>
        </div>

        <div className="glass-morphism rounded-2xl p-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400 mb-1">{successfulResults.length}</div>
          <div className="text-gray-400 text-sm">Successful</div>
        </div>

        <div className="glass-morphism rounded-2xl p-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 mb-3">
            <Box className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-1">{getTotalObjects()}</div>
          <div className="text-gray-400 text-sm">Objects Found</div>
        </div>

        <div className="glass-morphism rounded-2xl p-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/20 mb-3">
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-yellow-400 mb-1">{getUniqueClasses().length}</div>
          <div className="text-gray-400 text-sm">Unique Classes</div>
        </div>

        <div className="glass-morphism rounded-2xl p-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mb-3">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-1">
            {getAvgInferenceTime() ? `${Math.round(getAvgInferenceTime() * 1000)}ms` : 'N/A'}
          </div>
          <div className="text-gray-400 text-sm">Avg Time</div>
        </div>
      </motion.div>

      {/* Unique Classes Found */}
      {getUniqueClasses().length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-morphism rounded-2xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold mb-4 gradient-text">All Detected Classes</h3>
          <div className="flex flex-wrap gap-2">
            {getUniqueClasses().map((cls, index) => (
              <motion.span
                key={cls}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.02 }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500/30 text-sm font-medium capitalize"
              >
                {cls}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results Grid/List */}
      {viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {batchResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.02 }}
              className={`glass-morphism rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform ${
                expandedIndex === index ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              {result.success && result.imageUrl ? (
                <img
                  src={result.imageUrl}
                  alt={result.filename}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square bg-red-500/20 flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-400" />
                </div>
              )}
              <div className="p-3">
                <p className="text-sm truncate font-medium">{result.filename}</p>
                {result.success ? (
                  <p className="text-xs text-green-400">
                    {result.results?.mode === 'comparison'
                      ? `${result.results.results?.medium?.detections?.length || 0}/${result.results.results?.large?.detections?.length || 0} objects`
                      : `${result.results?.detections?.length || result.results?.num_detected || 0} objects`
                    }
                  </p>
                ) : (
                  <p className="text-xs text-red-400">Failed</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {batchResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.02 }}
              className="glass-morphism rounded-xl overflow-hidden"
            >
              <div
                className="flex items-center p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                {result.success && result.imageUrl ? (
                  <img
                    src={result.imageUrl}
                    alt={result.filename}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 bg-red-500/20 rounded-lg mr-4 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-400" />
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-medium">{result.filename}</p>
                  {result.success ? (
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="text-green-400">
                        {result.results?.mode === 'comparison'
                          ? `M:${result.results.results?.medium?.detections?.length || 0} L:${result.results.results?.large?.detections?.length || 0}`
                          : `${result.results?.detections?.length || result.results?.num_detected || 0} objects`
                        }
                      </span>
                      {result.results?.inference_time && (
                        <span>{Math.round(result.results.inference_time * 1000)}ms</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-400">{result.error || 'Failed to process'}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedIndex === index && result.success && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-700 overflow-hidden"
                  >
                    <div className="p-4">
                      {result.results?.mode === 'comparison' ? (
                        // Comparison mode display
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Medium Model */}
                          <div>
                            <h4 className="font-semibold mb-2 text-primary-400">ObjectVision AI</h4>
                            <div className="w-full rounded-lg mb-2 overflow-hidden">
                              <ImageWithBoxes
                                imageUrl={result.imageUrl}
                                detections={result.results.results?.medium?.detections}
                                width={result.results.results?.medium?.width}
                                height={result.results.results?.medium?.height}
                              />
                            </div>
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                              {result.results.results?.medium?.detections?.map((detection, dIndex) => (
                                <div key={dIndex} className="flex items-center justify-between bg-white/5 rounded p-2 text-sm">
                                  <span className="capitalize">{detection.class}</span>
                                  <span className={`font-bold ${getConfidenceColor(detection.confidence)}`}>
                                    {Math.round(detection.confidence * 100)}%
                                  </span>
                                </div>
                              )) || <div className="text-center text-gray-400 py-2">No detections</div>}
                            </div>
                          </div>

                          {/* Large Model */}
                          <div>
                            <h4 className="font-semibold mb-2 text-purple-400">ObjectVision AI+</h4>
                            <div className="w-full rounded-lg mb-2 overflow-hidden">
                              <ImageWithBoxes
                                imageUrl={result.imageUrl}
                                detections={result.results.results?.large?.detections}
                                width={result.results.results?.large?.width}
                                height={result.results.results?.large?.height}
                              />
                            </div>
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                              {result.results.results?.large?.detections?.map((detection, dIndex) => (
                                <div key={dIndex} className="flex items-center justify-between bg-white/5 rounded p-2 text-sm">
                                  <span className="capitalize">{detection.class}</span>
                                  <span className={`font-bold ${getConfidenceColor(detection.confidence)}`}>
                                    {Math.round(detection.confidence * 100)}%
                                  </span>
                                </div>
                              )) || <div className="text-center text-gray-400 py-2">No detections</div>}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Single model display
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="overflow-hidden rounded-lg">
                            <ImageWithBoxes
                              imageUrl={result.imageUrl}
                              detections={result.results?.detections}
                              width={result.results?.width}
                              height={result.results?.height}
                            />
                          </div>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            <h4 className="font-semibold mb-2">Detections:</h4>
                            {result.results?.detections?.map((detection, dIndex) => (
                              <div key={dIndex} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                                <span className="capitalize font-medium">{detection.class}</span>
                                <span className={`font-bold ${getConfidenceColor(detection.confidence)}`}>
                                  {Math.round(detection.confidence * 100)}%
                                </span>
                              </div>
                            )) || (
                              result.results?.detected_objects?.map((obj, oIndex) => (
                                <div key={oIndex} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                                  <span className="capitalize font-medium">{obj}</span>
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Failed Results Warning */}
      {failedResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass-morphism rounded-2xl p-6 border border-red-500/30"
        >
          <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
            <XCircle className="w-6 h-6 mr-2" />
            Failed to Process ({failedResults.length} images)
          </h3>
          <div className="space-y-2">
            {failedResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{result.filename}</span>
                <span className="text-red-400">{result.error || 'Unknown error'}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
