
export const readAsDataURL = (files, ref) => {
    let reader = new FileReader()
    reader.onload = e => ref.current.src = e.target.result
	reader.readAsDataURL(files)
}