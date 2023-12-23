import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Posts from "../ui/Posts";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SearchBar from "../ui/Searchbar";
import Spinner from "../ui/Spinner";

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [like,setLike] = useState(false);
  const [save,setSaved] = useState(false);
  const [likedPostsSet, setLikedPostsSet] = useState(new Set());
  const [savedPostsSet, setSavedPostsSet] = useState(new Set());

  const auth = JSON.parse(localStorage.getItem("user"));
  const userID=auth._id;

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  
  useEffect(function(){
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/getUserDetails/like/save?userID=${userID}`,{
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();

        // Assuming userData contains likedPostIds and savedPostIds
        setLikedPostsSet(new Set(userData.likedPostIds));
        setSavedPostsSet(new Set(userData.savedPostIds));
        localStorage.setItem("userData",JSON.stringify(userData));
        console.log(JSON.stringify(userData));
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    fetchUserDetails();
  },[like,save])

  function handleLike(){
    setLike(like=>!like);
    
  }

  function handleSave(){
    setSaved(save=>!save);
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/user/clubPosts", {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  console.log(data);
  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
      </Row>
      <Row>
        <SearchBar onSearch={handleSearch} />
      </Row>
      <Row>
        {data.map((data) => (
          <Posts
            key={data._id}
            id={data._id}
            title={data.title}
            description={data.description}
            coordinators={data.coordinators}
            clubName={data.clubName}
            setHandleLike={handleLike}
            setHandleSave = {handleSave}
            likeByUser = {likedPostsSet.has(data._id)}
            saveByUser = {savedPostsSet.has(data._id)}
          />
        ))}
      </Row>
    </>
  );
}

export default Dashboard;
