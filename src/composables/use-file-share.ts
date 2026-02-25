function useFileShare () {
  const share = async (
    blob: Blob,
    filename: string,
    title: string
  ) => {
    const file = new File([blob], filename, { type: blob.type })

    if (navigator.canShare?.({ files: [file] })) {
      return navigator.share({ files: [file], title })
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return { share }
}
