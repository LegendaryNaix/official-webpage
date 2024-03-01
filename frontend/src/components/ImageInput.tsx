import { cn } from '@/lib/utils'
import { PhotoIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import * as React from 'react'

export interface ImageInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect: (file: File) => void
}

const ImageInput = React.forwardRef<HTMLInputElement, ImageInputProps>(
  ({ className, onFileSelect, ...props }, ref) => {
    const [imagePreview, setImagePreview] = React.useState<string | null>(null)

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null
      if (file) {
        processFile(file)
        onFileSelect(file)
      }
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const files = event.dataTransfer.files
      if (files && files.length > 0) {
        processFile(files[0])
        event.dataTransfer.clearData()
      }
    }

    const processFile = (file: File | null) => {
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }

    return (
      <div
        className={clsx(
          'mt-2 flex justify-center rounded-md border border-dashed border-zinc-200 px-6 py-8 shadow-sm dark:border-zinc-400',
          {
            'border-none py-0': imagePreview
          }
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="text-center">
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagePreview}
              alt="Preview"
              className="mx-auto h-24 w-auto sm:h-32"
            />
          ) : (
            <>
              <PhotoIcon
                className="mx-auto h-12 w-12 text-zinc-600 dark:text-zinc-400"
                aria-hidden="true"
              />
              <div className="mt-4 flex items-center text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                <label
                  className={cn(
                    'relative cursor-pointer rounded-md font-semibold focus-within:outline-none focus-within:ring-0',
                    className
                  )}
                  htmlFor="file-upload"
                >
                  <span className="text-amber-400">파일 업로드</span>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    ref={ref}
                    {...props}
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">또는 드래그앤 드롭</p>
              </div>
              <p className="text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                PNG, JPG, GIF up to 10MB
              </p>
            </>
          )}
        </div>
      </div>
    )
  }
)

ImageInput.displayName = 'ImageInput'

export { ImageInput }
