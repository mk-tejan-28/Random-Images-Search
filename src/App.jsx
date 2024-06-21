// open krne ke liye react folder ko pheli baat Unsplash image search 3 folder nhi open krna hai uske andar vala open krna hai or open krne ke baad teminal me aa kr yarn dev likh dena hai jisse local host start ho jaye

import {  useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap'
import './index.css'
import axios from 'axios';


const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE = 18;

function App() {

  
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] =  useState('');



  const fetchImages = useCallback( async() => {
    try {
      if(searchInput.current.value){
        setErrorMsg('');
        const {data} = await axios.get(`${API_URL}?query=${searchInput.current.value}
          &page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY}`);
        
        setImages(data.results);
        setTotalPages(data.total_pages)
      }
    } catch (error) {
      setErrorMsg("Error in fetching images. Try again later...");
      console.log(error); 
    }
  },[page]);

  useEffect(() => {
    fetchImages();
  },[fetchImages]);

  const resetSearch= () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log(searchInput.current.value);
    resetSearch();
  };
  
  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  }

  console.log('page',page);

  return (
    <div className='container'>
      <h1 className='title'>Image Search</h1>
      {errorMsg && <p className='error-msg'>{errorMsg}</p>}
      <div className="search-section">
        <Form onSubmit={handleSearch}>
          <Form.Control 
            type="search" 
            placeholder="Type Something To Search..." 
            className='search-input'
            ref = {searchInput}
          />
        </Form>
      </div>
      <div className="filters">
        <div onClick={() => handleSelection('nature')}>Nature</div>
        <div onClick={() => handleSelection('birds')}>Birds</div>
        <div onClick={() => handleSelection('cars')}>Cars</div>
        <div onClick={() => handleSelection('shoes')}>Shoes</div>
      </div>
      <div className="images">
        {images.map((image) => (
          <img 
            key={image.id}
            src={image.urls.small} 
            alt={image.alt_description} 
            className='image'
          />
        ))}
      </div>

      <div className='buttons'>
            {page > 1 && (
              <Button onClick={() => setPage(page - 1)}>Previous</Button>
            )}
            {page < totalPages && (
              <Button onClick={() => setPage(page + 1)}>Next</Button>
            )}
          </div>
    </div> 
  );
}

export default App
