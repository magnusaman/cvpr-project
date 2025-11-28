import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, Loader, AlertCircle, ImagePlus, X } from 'lucide-react'
import axios from 'axios'

export default function UploadSection({ onAnalysis, onBatchAnalysis, loading, setLoading }) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [selectedModel, setSelectedModel] = useState('medium') // 'medium', 'large', or 'both'

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
      if (files.length > 1) {
        setSelectedFiles(files)
        setIsBatchMode(true)
      } else if (files.length === 1) {
        handleSingleFile(files[0])
      }
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'))
      if (files.length > 1) {
        setSelectedFiles(files)
        setIsBatchMode(true)
      } else if (files.length === 1) {
        handleSingleFile(files[0])
      }
    }
  }

  const handleSingleFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    setError(null)
    setIsBatchMode(false)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload to API
    setLoading(true)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('model', selectedModel)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await axios.post(`${apiUrl}/api/predict_with_boxes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      onAnalysis(response.data, reader.result)
    } catch (err) {
      setError('Failed to analyze image. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBatchUpload = async () => {
    if (selectedFiles.length === 0) return

    setError(null)
    setLoading(true)
    setUploadProgress({ current: 0, total: selectedFiles.length })

    const results = []
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      setUploadProgress({ current: i + 1, total: selectedFiles.length })

      try {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('model', selectedModel)

        const response = await axios.post(`${apiUrl}/api/predict_with_boxes`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // Get image preview
        const imageUrl = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })

        results.push({
          filename: file.name,
          imageUrl,
          results: response.data,
          success: true
        })
      } catch (err) {
        results.push({
          filename: file.name,
          imageUrl: null,
          results: null,
          success: false,
          error: err.message
        })
      }
    }

    setLoading(false)
    setSelectedFiles([])
    setIsBatchMode(false)
    setUploadProgress({ current: 0, total: 0 })

    if (onBatchAnalysis) {
      onBatchAnalysis(results)
    }
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    if (selectedFiles.length <= 1) {
      setIsBatchMode(false)
    }
  }

  const clearSelection = () => {
    setSelectedFiles([])
    setIsBatchMode(false)
    setPreview(null)
  }

  return (
    <div className="max-w-4xl mx-auto mb-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20"></div>

        <div className="relative glass-morphism rounded-3xl p-8 md:p-12">
          {/* Model Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">
              <span className="gradient-text">Select Detection Model</span>
            </h3>
            <div className="flex justify-center gap-3">
              <motion.button
                onClick={() => setSelectedModel('medium')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedModel === 'medium'
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white'
                    : 'glass-morphism hover:bg-white/10 text-gray-300'
                }`}
              >
                ObjectVision AI (Faster)
              </motion.button>
              <motion.button
                onClick={() => setSelectedModel('large')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedModel === 'large'
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white'
                    : 'glass-morphism hover:bg-white/10 text-gray-300'
                }`}
              >
                ObjectVision AI+ (More Accurate)
              </motion.button>
              <motion.button
                onClick={() => setSelectedModel('both')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedModel === 'both'
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white'
                    : 'glass-morphism hover:bg-white/10 text-gray-300'
                }`}
              >
                Both (Compare)
              </motion.button>
            </div>
            {selectedModel === 'both' && (
              <p className="text-center text-sm text-gray-400 mt-3">
                Compare results from both models side-by-side
              </p>
            )}
          </div>

          {/* Batch Mode Selection Display */}
          {isBatchMode && selectedFiles.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  <span className="gradient-text">{selectedFiles.length}</span> Images Selected
                </h3>
                <button
                  onClick={clearSelection}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span>Clear All</span>
                </button>
              </div>

              {/* File Preview Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mb-6 max-h-64 overflow-y-auto p-2">
                {selectedFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="relative group"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs p-1 truncate rounded-b-lg">
                      {index + 1}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Batch Upload Button */}
              <div className="flex justify-center space-x-4">
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center space-x-2 glass-morphism px-6 py-3 rounded-xl cursor-pointer hover:bg-white/10 transition-all"
                >
                  <ImagePlus className="w-5 h-5" />
                  <span className="font-medium">Add More</span>
                </label>
                <motion.button
                  onClick={handleBatchUpload}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-purple-600 px-8 py-3 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50"
                >
                  <Upload className="w-5 h-5" />
                  <span>Process All Images</span>
                </motion.button>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                dragActive
                  ? 'border-primary-400 bg-primary-500/10 scale-105'
                  : 'border-gray-600 hover:border-primary-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleChange}
                disabled={loading}
              />

              {loading ? (
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-4"
                  >
                    <Loader className="w-16 h-16 text-primary-400" />
                  </motion.div>
                  {uploadProgress.total > 0 ? (
                    <>
                      <h3 className="text-2xl font-semibold mb-2">
                        Processing {uploadProgress.current} of {uploadProgress.total}...
                      </h3>
                      <div className="w-full max-w-md mx-auto bg-gray-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                          className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                        />
                      </div>
                      <p className="text-gray-400 mt-2">
                        {Math.round((uploadProgress.current / uploadProgress.total) * 100)}% complete
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-semibold mb-2">Analyzing Image...</h3>
                      <p className="text-gray-400">Our AI is detecting objects in your image</p>
                    </>
                  )}
                </div>
              ) : preview ? (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mb-6"
                  >
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-xl shadow-2xl"
                    />
                  </motion.div>
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center space-x-2 glass-morphism px-8 py-3 rounded-xl cursor-pointer hover:bg-white/10 transition-all"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">Upload Different Image</span>
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 mb-6 mx-auto"
                  >
                    <ImagePlus className="w-12 h-12 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-semibold mb-3">
                    Drop your images here or{' '}
                    <span className="gradient-text">browse</span>
                  </h3>
                  <p className="text-gray-400 mb-2">
                    Support for JPEG, PNG, JPG (Max 10MB each)
                  </p>
                  <p className="text-primary-400 font-medium mb-6">
                    Select multiple images (up to 100) for batch processing
                  </p>

                  <div className="inline-flex items-center space-x-2 glass-morphism px-8 py-3 rounded-xl hover:bg-white/10 transition-all">
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">Select Images</span>
                  </div>
                </label>
              )}
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center space-x-2 text-red-400 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
