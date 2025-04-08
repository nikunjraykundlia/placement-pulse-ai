import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Check, AlertCircle, XCircle, FileText, FileImage } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

const ResumeUploadCard = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
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
    setUploadError(null)

    const droppedFile = e.dataTransfer.files[0]
    handleFileSelection(droppedFile)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null
    setUploadError(null)
    handleFileSelection(selectedFile)
  }

  const handleFileSelection = (selectedFile: File | null) => {
    if (!selectedFile) return

    // Check if file is a PDF or DOCX or image
    const fileType = selectedFile.type
    const validTypes = [
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp"
    ];

    if (!validTypes.includes(fileType)) {
      setUploadError("Invalid file format. Please upload a PDF, DOCX, or image file.")
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF, DOCX, or image resume file.",
        variant: "destructive"
      })
      return
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadError("File too large. Maximum file size is 5MB.")
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive"
      })
      return
    }

    setFile(selectedFile)
    setUploadError(null)
  }

  const getFileIcon = () => {
    if (!file) return <Upload className="h-6 w-6 text-gray-600" />
    
    switch(file.type) {
      case "application/pdf":
        return <FileText className="h-6 w-6 text-red-600" />
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FileText className="h-6 w-6 text-blue-600" />
      default:
        // Images
        return <FileImage className="h-6 w-6 text-green-600" />
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadError(null)
    
    try {
      // Navigate to analysis page with the file
      toast({
        title: "Processing your resume",
        description: "We're preparing to analyze your resume.",
        variant: "default"
      })
      
      // Navigate to the analysis page with the file
      navigate("/resume-analysis", { state: { file } });
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError("Upload failed. Please try again.")
      toast({
        title: "Upload failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
            isDragging ? "border-blue-500 bg-blue-50" : 
              file ? "border-green-500 bg-green-50" : 
                "border-gray-300 hover:border-gray-400"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("resume-upload")?.click()}
        >
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf,.docx,.jpg,.jpeg,.png,.gif,.webp"
            onChange={handleFileInput}
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center gap-3">
            {isUploading ? (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : file ? (
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                {getFileIcon()}
              </div>
            )}
            
            {file ? (
              <>
                <p className="text-lg font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">Drag & Drop your resume here</p>
                <p className="text-sm text-gray-500">
                  or click to browse (PDF, DOCX, or images, max 5MB)
                </p>
              </>
            )}
          </div>
        </div>

        {uploadError && (
          <div className="mt-3 flex items-center gap-2 text-red-500 bg-red-50 p-2 rounded">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">{uploadError}</span>
          </div>
        )}

        {file && !isUploading && (
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
            >
              Analyze My Resume
            </Button>
          </div>
        )}
        
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 justify-center">
          <AlertCircle className="h-4 w-4" />
          <span>Your data is secure and will only be used for analysis.</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeUploadCard;
