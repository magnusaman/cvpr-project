import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, Loader, AlertCircle } from 'lucide-react'
import axios from 'axios'

export default function UploadSection({ onAnalysis, loading, setLoading }) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload to API
    setLoading(true)
    const formData = new FormData()
    formData.append('image', file)

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
                <h3 className="text-2xl font-semibold mb-2">Analyzing Image...</h3>
                <p className="text-gray-400">Our AI is detecting objects in your image</p>
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
                  <ImageIcon className="w-12 h-12 text-white" />
                </motion.div>

                <h3 className="text-2xl font-semibold mb-3">
                  Drop your image here or{' '}
                  <span className="gradient-text">browse</span>
                </h3>
                <p className="text-gray-400 mb-6">
                  Support for JPEG, PNG, JPG (Max 10MB)
                </p>

                <div className="inline-flex items-center space-x-2 glass-morphism px-8 py-3 rounded-xl hover:bg-white/10 transition-all">
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Select Image</span>
                </div>
              </label>
            )}
          </div>

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
