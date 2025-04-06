
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Check, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

const ResumeUploadCard = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    handleFileSelection(droppedFile)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null
    handleFileSelection(selectedFile)
  }

  const handleFileSelection = (selectedFile: File | null) => {
    if (!selectedFile) return

    // Check if file is a PDF or DOCX
    const fileType = selectedFile.type
    if (fileType !== "application/pdf" && 
        fileType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF or DOCX resume file.",
        variant: "destructive"
      })
      return
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive"
      })
      return
    }

    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    
    // Simulate upload process for now
    // In a real implementation, we would send the file to a server
    try {
      // Fake API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Resume uploaded successfully",
        description: "We're analyzing your resume now.",
        variant: "default"
      })
      
      // Navigate to results page in real implementation
      // For now, we'll just show a toast
      setTimeout(() => {
        navigate("/dashboard")
      }, 1500)
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging 
              ? "border-blue-500 bg-blue-50" 
              : file 
                ? "border-green-500 bg-green-50" 
                : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("resume-upload")?.click()}
        >
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf,.docx"
            onChange={handleFileInput}
          />
          <div className="flex flex-col items-center justify-center gap-3">
            {file ? (
              <>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-lg font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Upload className="h-6 w-6 text-gray-600" />
                </div>
                <p className="text-lg font-medium">Drag & Drop your resume here</p>
                <p className="text-sm text-gray-500">
                  or click to browse (PDF or DOCX, max 5MB)
                </p>
              </>
            )}
          </div>
        </div>

        {file && (
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading ? "Uploading..." : "Analyze My Resume"}
            </Button>
          </div>
        )}
        
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 justify-center">
          <AlertCircle className="h-4 w-4" />
          <span>Your data is secure and will only be used for analysis.</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResumeUploadCard
