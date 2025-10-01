import { FileInfo } from "@/types/project"

/**
 * Extracts file information from FileList or FileInfo objects
 * @param file - FileList or FileInfo object
 * @returns FileInfo object or null
 */
export function extractFileInfo(file: FileList | FileInfo | null): FileInfo | null {
  if (!file) return null

  if (file instanceof FileList) {
    const firstFile = file[0]
    if (!firstFile) return null
    
    return {
      name: firstFile.name,
      size: firstFile.size,
      type: firstFile.type,
    }
  }

  // file is already FileInfo
  return {
    name: file.name,
    size: file.size,
    type: file.type,
  }
}