import React, { useState, useEffect, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
//users will be = `https://api.unsplash.com/users/`
const searchUrl = `https://api.unsplash.com/search/photos/`


function App() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [newImages, setnewImages] = useState(false)

  const mounted = useRef(false) //use ref doesn't initiate a re-render

  const fetchImage = async() => {
    setLoading(true)
    const urlPage = `&page=${page}`
    const urlQuery = `&query=${query}`
    let url;

    if(query.length > 1){
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
    }else{
      url = `${mainUrl}${clientID}${urlPage}`
    }
    try {
      const response = await fetch(url)
      const data = await response.json()
      setPhotos((oldPhotos) => {
        if(query && page=== 1){
            return data.results
        } else if(query.length > 1){      
             return [...oldPhotos,...data.results]  // spread the old photos to find them when scroll up
        } else {                                    // spread data.results because these are the items returned from the search in API
          return [...oldPhotos,...data]  // spread only the existing data if user doesn't type in search
        }
      })
      setnewImages(false)
      setLoading(false)    
    } catch (error) {
      setnewImages(false)
      setLoading(false)     
    }
 }


  useEffect(() => {
    fetchImage()
    // eslint-disable-next-line
  }, [page])

  
  // This useEffect is responsible for fetching images as we scroll down the page
  useEffect(() => {
    // This code so that this fetch doesn't render on the initial run
    if(!mounted.current){
         mounted.current = true
         return
    } else if(loading){
      return
    } else if(!newImages){
      return 
    }
    setPage((oldPage) => {
      return oldPage + 1
    })
    // eslint-disable-next-line
  }, [newImages])


     //same as adding callback function to the event listener
  const event = (e) => {
    if((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 2){ // -2 to fetch the images before getting to the end
          setnewImages(true)
       }
    }

  useEffect(() => {
    window.addEventListener('scroll', event)
    return () => window.removeEventListener('scroll', event)
  },[])


  const handleSubmit = (e) => {
    e.preventDefault()
    if(!query){ //empty query
      return
    } else if(page===1) {
        fetchImage() 
    }
    setPage(1)
  }

  return(
    <main>
      <section className='search'>
        <form className='search-form' onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='form-input'
          />
          <button type='submit' className='submit-btn'>
            <FaSearch style={{cursor: 'pointer'}}/>
          </button>
        </form>
      </section>

      <section className='photos'>
        <div className='photos-center'>
          {photos.map((image, index) => {
            return <Photo key={index} {...image} />;
          })}
       </div>
       </section>
       <h2 className='loading'>{loading? 'Loading!!!!' : null}</h2>
    </main>
  )
}

export default App




// old scroll nom working code

/* 

 useEffect(() => {
    const event = window.addEventListener('scroll', () => {
      if((!loading && window.innerHeight + window.scrollY) >= document.body.scrollHeight - 50){
        setPage((oldPage) => {
          return oldPage + 1
        })
      }
   })  
    return () => window.removeEventListener('scroll', event)
    // eslint-disable-next-line
  }, [])

  */

