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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  console.log(searchQuery);
  const arr = [1, 2, 3, 4, 5];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/clubPosts", {
          headers: {
            authorization: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
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
          />
        ))}
      </Row>
    </>
  );
}

export default Dashboard;
