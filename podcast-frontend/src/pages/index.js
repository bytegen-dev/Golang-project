import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import axios from 'axios';
import Head from 'next/head';
import { FaFilter, FaTimes } from 'react-icons/fa'

const optionsFilter = [
  "Full Search",
  "Category",
  "Search by Title",
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [podcasts, setPodcasts] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Full Search");
  const [activePage, setActivePage] = useState(1)
  const [podcastsInPage, setPodcastsInPage] = useState([])
  const [totalPages, setTotalPages] = useState(1)

  const handleSearch = async () => {
    setSearched(true)
    setLoading(true);
    setActivePage(1)

    if(searchQuery?.length < 1){
      try{
        const response = await axios.get(`http://localhost:8080/podcasts`)
  
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setTimeout(()=>{
          setLoading(false);
          setPodcasts(response?.data)
        })
      } catch(error){
        console.error(error)
        setTimeout(()=>{
          setLoading(false);
          setPodcasts([])
        })
      }
    } else if(activeFilter === "Full Search"){
      try{
        const response = await axios.get(`http://localhost:8080/podcasts/search/${searchQuery}`)

        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setTimeout(()=>{
          setLoading(false);
          setPodcasts(response?.data)
        })
      } catch(error){
        console.error(error)
        setTimeout(()=>{
          setLoading(false);
          setPodcasts([])
        })
      }
    } else if (activeFilter === "Category"){
      try{
        const response = await axios.get(`http://localhost:8080/podcasts/category/${searchQuery}`)

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setTimeout(()=>{
          setLoading(false);
          setPodcasts(response?.data)
        })
      } catch(error){
        console.error(error)
        setTimeout(()=>{
          setLoading(false);
          setPodcasts([])
        })
      }
    } else if (activeFilter === "Search by Title"){
      try{
        const response = await axios.get(`http://localhost:8080/podcasts/title/${searchQuery}`)

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setTimeout(()=>{
          setLoading(false);
          setPodcasts(response?.data)
        })
      } catch(error){
        console.error(error)
        setTimeout(()=>{
          setLoading(false);
          setPodcasts([])
        })
      }
    }
  };

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  useEffect(()=>{
    const allPodcasts = podcasts
    const base = Math.ceil(activePage*10) - 10
    const height = Math.ceil(activePage*10)
    const visiblePodcasts = allPodcasts.slice(base, height)
    setPodcastsInPage(visiblePodcasts)

    if(allPodcasts?.length > 10){
      const no_ofpages = Math.ceil(allPodcasts.length/10)
      setTotalPages(no_ofpages)
    } else{
      setTotalPages(1)
    }

  }, [podcasts, activePage])
  
  const inputRef = useRef()

  useEffect(()=>{
    document.addEventListener('keydown', function(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        myFunction();
      }
    });

    function myFunction() {
      inputRef.current.focus()
    }
  }, [])

  const [openFilter, setOpenFilter] = useState(false)

  return (
    <div className={styles.container}>
      <Head>
        <title>Isaac Adebayo ~ Teknoir Coding Assessment</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1c1c1c" />
        <meta property="og:title" content="Isaac Adebayo's Code Assessment" />
        <meta property="og:description" content="Isaac Adebayo's Code Assessment made with NEXTjs & Golang ;)" />
        <meta property="og:image" content="/favicon.ico" />
      </Head>
      <div className={styles.input_container}>
        <div className={styles.select_filter} onClick={()=>{
          setOpenFilter(!openFilter)
        }}>
          {!openFilter ? <FaFilter /> :
          <FaTimes />}
          {openFilter && <div className={styles.modal}>
            {optionsFilter.map((option, index)=>{
              return (
                <span key={index} className={activeFilter === option ? styles.active : ""} onClick={()=>{
                  setActiveFilter(option)
                }}>
                  {option}
                </span>
              )
            })}
          </div>}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            if(e.target.value?.length < 1){
              setSearched(false)
            }
            setSearchQuery(e.target.value)
          }}
          className={loading ? styles.input_loading : ""}
          ref={inputRef}
          placeholder={`${activeFilter}_`}
        />
        <button onClick={handleSearch} disabled={loading} className={loading ? styles.input_loading : ""}>
          Search
        </button>
      </div>

      {loading && <div className={styles.loading}>
        <div className={styles.spinner}>
        </div>
        <p>Loading podcasts_</p>
      </div>}

      {(podcasts?.length > 1 && !loading) && (
        <div className={styles.list_container}>
          <ul>
            {podcastsInPage.map((podcast) => (
              <li key={podcast.id}>
                <h3>{podcast.title}</h3>
                <p>{podcast.category}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(!loading) && <>
        {podcasts.length === 0 && !loading && (
          <div className={styles.loading}>
            {(searched && searchQuery.length > 1 ) ? <p>
              {"No podcasts found :)"}
            </p> : <p>
            Search for a Podcast <span className={styles.clickable} onClick={()=>{
              inputRef.current.focus()
            }}>Ctrl + K</span>
          </p>}
          </div>
        )}
      </>}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={activePage === index + 1 ? styles.active : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
