import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Posts from "../ui/Posts";
import React, { useState } from "react";
import styled from "styled-components";
import SearchBar from "../ui/Searchbar";



function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  console.log(searchQuery);
  const arr = [1, 2, 3, 4, 5];
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
        <p>TEST</p>
      </Row>
      <Row>
        <SearchBar onSearch={handleSearch} />
      </Row>
      <Row>
        {arr.map((a) => (
          <Posts key={a} id={a} />
        ))}
      </Row>
    </>
  );
}

export default Dashboard;
