import { useState } from "react";
import Modal from "./components/Modal";

const App = () => {
  const surpriseOptions = [
    'A blue ostrich eating melon',
    'A matisse style shark on the telephone',
    'A pineapple sunbathing on an island',
  ]

  const [images, setImages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const surpriseMe = async() => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setInputValue(randomValue)
  }

  const getImages = async() => {
    setImages([])
    if (!inputValue) {
      return
    }

    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: inputValue
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    }
    try {
      const response = await fetch('http://localhost:8000/images', options)
      const data = await response.json()
      console.log(data)
      setImages(data)
    } catch (error) {
      console.error(error)
    }
  }

  const uploadImage = async(e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setSelectedImage(e.target.files[0])
    setModalOpen(true)
    e.target.value = null

    const options = {
      method: 'POST',
      body: formData,
    }
    try {
      const response = await fetch('http://localhost:8000/upload', options)
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  const generateVariations = async () => {
    setImages([])
    if (!selectedImage) {
      setModalOpen(false)
      return
    }

    const options = {
      method: 'POST',
    }
    try {
      const response = await fetch('http://localhost:8000/variations', options)
      const data = await response.json()
      console.log(data)
      setImages(data)
      setModalOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="app">
      <section className="search-section">
        <p>Start with a detailed description
          <span className="surprise" onClick={surpriseMe}>Surprise me</span>
        </p>
        <div className="input-container">
          <input
            value={inputValue}
            placeholder="An impressionist oil painting
            of a sunflower in a purple vase..."
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && getImages()}
          />
          <button onClick={getImages}>Generate</button>
        </div>
        <p className="extra-info">
          Or,
          <span>
            <label htmlFor="file"> upload an image </label>
            <input onChange={uploadImage} id="file" type="file" accept="image/*" hidden/>
          </span>
          to edit.
        </p>

        {modalOpen &&
          <div className="overlay">
            <Modal
              setModalOpen={setModalOpen}
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
              generateVariations={generateVariations}
            />
          </div>}
      </section>
      <section className="image-section">
        {images?.map((image, index) => (
          <img key={index} src={image.url} alt="generated"/>
        ))}
      </section>
    </div>
  )
}

export default App
